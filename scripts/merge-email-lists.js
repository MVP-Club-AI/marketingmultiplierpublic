/**
 * Merge and deduplicate email lists
 *
 * Usage: node merge-email-lists.js
 *
 * Reads from: marketing/inputs/email-lists/source-*.csv
 * Outputs to: marketing/inputs/email-lists/master-list.csv
 */

const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../marketing/inputs/email-lists');
const outputFile = path.join(inputDir, 'master-list.csv');

// Parse CSV (simple parser for our use case)
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  return lines.slice(1).map(line => {
    // Handle quoted fields with commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });
}

// Extract first name from full name
function extractFirstName(fullName) {
  if (!fullName) return '';
  // Handle cases like "Charlie!!" or names with special chars
  const cleaned = fullName.replace(/[!@#$%^&*()]+/g, '').trim();
  const parts = cleaned.split(/\s+/);
  return parts[0] || '';
}

// Try to guess name from email (fallback)
function guessNameFromEmail(email) {
  if (!email) return '';
  const localPart = email.split('@')[0];
  // Common patterns: firstname.lastname, firstnamelastname, firstname_lastname
  const cleaned = localPart
    .replace(/[0-9]+/g, '')
    .replace(/[._-]/g, ' ')
    .trim();
  const parts = cleaned.split(/\s+/);
  if (parts[0] && parts[0].length > 1) {
    // Capitalize first letter
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  return '';
}

// Main merge logic
function mergeEmailLists() {
  const emailMap = new Map(); // email -> { firstName, email, source, timestamp }

  // 1. Process Getting Started form (has names) - this is priority since it has real names
  const gettingStartedFile = path.join(inputDir, 'source-getting-started-form.csv');
  if (fs.existsSync(gettingStartedFile)) {
    const content = fs.readFileSync(gettingStartedFile, 'utf-8');
    const rows = parseCSV(content);

    rows.forEach(row => {
      // Find email column (handles various header formats)
      let email = '';
      let fullName = '';
      let timestamp = '';

      for (const [key, value] of Object.entries(row)) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('email') && value && value.includes('@')) {
          email = value.toLowerCase().trim();
        }
        if (keyLower.includes('name') && !keyLower.includes('company') && value) {
          fullName = value;
        }
        if (keyLower.includes('timestamp')) {
          timestamp = value;
        }
      }

      const firstName = extractFirstName(fullName);

      if (email && email.includes('@')) {
        // Prefer this source since it has names
        emailMap.set(email, {
          firstName: firstName,
          email: email,
          source: 'getting-started-form',
          timestamp: timestamp,
          nameGuessed: false
        });
      }
    });
    console.log(`Processed getting-started-form: ${rows.length} rows`);
  }

  // 2. Process Email List form (no names)
  const emailListFile = path.join(inputDir, 'source-email-list-form.csv');
  if (fs.existsSync(emailListFile)) {
    const content = fs.readFileSync(emailListFile, 'utf-8');
    const rows = parseCSV(content);

    rows.forEach(row => {
      const email = (row['Email Address'] || row['Email'] || '').toLowerCase().trim();
      const timestamp = row['Timestamp'] || '';

      if (email && email.includes('@')) {
        // Only add if we don't already have this email (preserve names from other source)
        if (!emailMap.has(email)) {
          emailMap.set(email, {
            firstName: guessNameFromEmail(email),
            email: email,
            source: 'email-list-form',
            timestamp: timestamp,
            nameGuessed: true
          });
        }
      }
    });
    console.log(`Processed email-list-form: ${rows.length} rows`);
  }

  // 3. Process Website Landing (no names)
  const websiteFile = path.join(inputDir, 'source-website-landing.csv');
  if (fs.existsSync(websiteFile)) {
    const content = fs.readFileSync(websiteFile, 'utf-8');
    const rows = parseCSV(content);

    rows.forEach(row => {
      // This file seems to have email as first column without header
      const email = (Object.values(row)[0] || '').toLowerCase().trim();
      const timestamp = Object.values(row)[1] || '';

      if (email && email.includes('@')) {
        if (!emailMap.has(email)) {
          emailMap.set(email, {
            firstName: guessNameFromEmail(email),
            email: email,
            source: 'website-landing',
            timestamp: timestamp,
            nameGuessed: true
          });
        }
      }
    });
    console.log(`Processed website-landing: ${rows.length} rows`);
  }

  // Convert to array and sort by email
  const masterList = Array.from(emailMap.values())
    .sort((a, b) => a.email.localeCompare(b.email));

  // Generate CSV output
  const csvHeader = 'first_name,email,status,source,name_guessed';
  const csvRows = masterList.map(entry => {
    const firstName = entry.firstName || '';
    const nameGuessed = entry.nameGuessed ? 'yes' : 'no';
    return `${firstName},${entry.email},active,${entry.source},${nameGuessed}`;
  });

  const csvContent = [csvHeader, ...csvRows].join('\n');
  fs.writeFileSync(outputFile, csvContent);

  // Summary
  console.log('\n=== MERGE SUMMARY ===');
  console.log(`Total unique emails: ${masterList.length}`);
  console.log(`With confirmed names: ${masterList.filter(e => !e.nameGuessed && e.firstName).length}`);
  console.log(`With guessed names: ${masterList.filter(e => e.nameGuessed && e.firstName).length}`);
  console.log(`Without names: ${masterList.filter(e => !e.firstName).length}`);
  console.log(`\nOutput: ${outputFile}`);

  // List entries without names for manual review
  const noNames = masterList.filter(e => !e.firstName);
  if (noNames.length > 0) {
    console.log('\n=== EMAILS NEEDING MANUAL NAME ENTRY ===');
    noNames.forEach(e => console.log(`  ${e.email}`));
  }

  return masterList;
}

mergeEmailLists();

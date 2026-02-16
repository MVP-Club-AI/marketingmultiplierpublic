#!/usr/bin/env node
/**
 * Newsletter Sender
 *
 * Sends personalized emails via Gmail API.
 *
 * Usage:
 *   node scripts/send-newsletter.js --test          # Send test to yourself
 *   node scripts/send-newsletter.js --preview       # Show what would be sent
 *   node scripts/send-newsletter.js --send          # Send to all active subscribers
 *
 * First run will open a browser for Google OAuth authorization.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

// ============ CONFIG ============
const CONFIG = {
  // Email settings
  senderName: '[Your Company]',
  replyTo: 'hello@[your-domain]',

  // File paths (relative to repo root)
  credentialsPath: 'credentials.json',
  tokenPath: 'token.json',

  // Google Sheet with email list
  sheetId: '1aEkiTNpdUm5vv31Ln-zWPvHTZgP-CX_zhBOB08jCpkk',
  sheetRange: 'master-list!A:C', // first_name, email, status

  // Rate limiting
  delayBetweenEmails: 100, // ms

  // Test email (where --test sends)
  testEmail: 'test@[your-domain]',
};

// Parse command line args for --subject and --newsletter
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { mode: null, subject: null, newsletter: null };

  for (let i = 0; i < args.length; i++) {
    if (['--test', '--preview', '--send'].includes(args[i])) {
      parsed.mode = args[i];
    } else if (args[i] === '--subject' && args[i + 1]) {
      parsed.subject = args[i + 1];
      i++;
    } else if (args[i] === '--newsletter' && args[i + 1]) {
      parsed.newsletter = args[i + 1];
      i++;
    }
  }

  return parsed;
}

// OAuth scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

// ============ AUTH ============

async function authorize() {
  const repoRoot = path.resolve(__dirname, '..');
  const credPath = path.join(repoRoot, CONFIG.credentialsPath);
  const tokenPath = path.join(repoRoot, CONFIG.tokenPath);

  if (!fs.existsSync(credPath)) {
    console.error('Error: credentials.json not found.');
    console.error('Download it from Google Cloud Console and save to repo root.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check for existing token
  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // Get new token
  return getNewToken(oAuth2Client, tokenPath);
}

async function getNewToken(oAuth2Client, tokenPath) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n=== AUTHORIZATION REQUIRED ===');
  console.log('Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\nAfter authorizing, you\'ll get a code. Paste it below.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the authorization code: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
        console.log('\nToken saved. You won\'t need to do this again.\n');
        resolve(oAuth2Client);
      } catch (err) {
        reject(new Error('Error getting token: ' + err.message));
      }
    });
  });
}

// ============ EMAIL FUNCTIONS ============

async function loadEmailListFromSheets(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Reading email list from Google Sheets...');

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.sheetId,
    range: CONFIG.sheetRange,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.error('No data found in Google Sheet');
    process.exit(1);
  }

  // First row is headers
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const emailIdx = headers.indexOf('email');
  const nameIdx = headers.indexOf('first_name');
  const statusIdx = headers.indexOf('status');

  if (emailIdx === -1) {
    console.error('Could not find "email" column in sheet');
    process.exit(1);
  }

  const subscribers = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const email = row[emailIdx]?.trim();
    const firstName = nameIdx >= 0 ? row[nameIdx]?.trim() : '';
    const status = statusIdx >= 0 ? row[statusIdx]?.trim().toLowerCase() : 'active';

    if (email && email.includes('@') && status === 'active') {
      subscribers.push({ email, firstName });
    }
  }

  return subscribers;
}

function loadNewsletterHTMLFromPath(newsletterPath) {
  const repoRoot = path.resolve(__dirname, '..');
  const htmlPath = path.join(repoRoot, newsletterPath);

  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: Newsletter HTML not found at ${newsletterPath}`);
    process.exit(1);
  }

  return fs.readFileSync(htmlPath, 'utf8');
}

function personalizeEmail(html, firstName) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there!';
  return html
    .replace(/\{\{greeting\}\}/g, greeting)
    .replace(/\{\{first_name\}\}/g, firstName || 'there');
}

function createRawEmail(to, subject, htmlBody, senderName, replyTo) {
  const boundary = 'boundary_' + Date.now();

  const headers = [
    `To: ${to}`,
    `From: ${senderName} <me>`,
    replyTo ? `Reply-To: ${replyTo}` : '',
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join('\r\n');

  // Plain text version (simple strip of HTML)
  const plainText = htmlBody
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    plainText,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    htmlBody,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const raw = headers + '\r\n\r\n' + body;
  return Buffer.from(raw).toString('base64url');
}

async function sendEmail(gmail, to, subject, htmlBody, senderName, replyTo) {
  const raw = createRawEmail(to, subject, htmlBody, senderName, replyTo);

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
  } catch (err) {
    console.error('Full error:', JSON.stringify(err.response?.data || err.message, null, 2));
    throw err;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ MAIN ============

async function main() {
  const { mode, subject, newsletter } = parseArgs();

  if (!mode || !['--test', '--preview', '--send'].includes(mode)) {
    console.log(`
Newsletter Sender

Usage:
  node scripts/send-newsletter.js --test --subject "Subject" --newsletter "path/to/file.html"
  node scripts/send-newsletter.js --preview --subject "Subject" --newsletter "path/to/file.html"
  node scripts/send-newsletter.js --send --subject "Subject" --newsletter "path/to/file.html"

Options:
  --subject      Email subject line (required for --send)
  --newsletter   Path to newsletter HTML file (required)

Email list: ${CONFIG.emailListPath}
`);
    process.exit(0);
  }

  if (!newsletter) {
    console.error('Error: --newsletter path is required');
    process.exit(1);
  }

  if (mode === '--send' && !subject) {
    console.error('Error: --subject is required for --send');
    process.exit(1);
  }

  // Authorize (needed for both Sheets and Gmail)
  const auth = await authorize();

  // Load data
  const subscribers = await loadEmailListFromSheets(auth);
  const html = loadNewsletterHTMLFromPath(newsletter);

  const effectiveSubject = subject || '[TEST] Newsletter Preview';

  console.log(`Loaded ${subscribers.length} active subscribers from Google Sheets`);
  console.log(`Newsletter: ${newsletter}`);
  console.log(`Subject: ${effectiveSubject}\n`);

  // Preview mode - just show stats
  if (mode === '--preview') {
    const withNames = subscribers.filter(s => s.firstName).length;
    console.log('=== PREVIEW ===');
    console.log(`Would send to ${subscribers.length} subscribers`);
    console.log(`  - ${withNames} with personalized greeting ("Hi Name,")`);
    console.log(`  - ${subscribers.length - withNames} with generic greeting ("Hi there!")`);
    console.log('\nFirst 5 recipients:');
    subscribers.slice(0, 5).forEach(s => {
      const greeting = s.firstName ? `Hi ${s.firstName},` : 'Hi there!';
      console.log(`  ${s.email} → "${greeting}"`);
    });
    process.exit(0);
  }

  // Gmail client
  const gmail = google.gmail({ version: 'v1', auth });

  // Test mode - send to configured test email
  if (mode === '--test') {
    console.log(`Sending test email to: ${CONFIG.testEmail}`);
    const personalizedHtml = personalizeEmail(html, 'TestName');

    await sendEmail(
      gmail,
      CONFIG.testEmail,
      `[TEST] ${effectiveSubject}`,
      personalizedHtml,
      CONFIG.senderName,
      CONFIG.replyTo
    );

    console.log('Test email sent! Check your inbox.');
    process.exit(0);
  }

  // Send mode - send to everyone
  if (mode === '--send') {
    console.log('=== SENDING TO ALL SUBSCRIBERS ===\n');

    let sent = 0;
    let errors = [];

    for (const subscriber of subscribers) {
      try {
        const personalizedHtml = personalizeEmail(html, subscriber.firstName);
        await sendEmail(
          gmail,
          subscriber.email,
          effectiveSubject,
          personalizedHtml,
          CONFIG.senderName,
          CONFIG.replyTo
        );
        sent++;
        const greeting = subscriber.firstName ? `Hi ${subscriber.firstName},` : 'Hi there!';
        console.log(`✓ ${subscriber.email} (${greeting})`);

        // Rate limiting
        await sleep(CONFIG.delayBetweenEmails);

      } catch (err) {
        errors.push({ email: subscriber.email, error: err.message });
        console.log(`✗ ${subscriber.email}: ${err.message}`);
      }
    }

    console.log('\n=== COMPLETE ===');
    console.log(`Sent: ${sent}`);
    console.log(`Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\nFailed emails:');
      errors.forEach(e => console.log(`  ${e.email}: ${e.error}`));
    }
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

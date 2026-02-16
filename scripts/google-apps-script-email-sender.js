/**
 * Weekly Email Sender
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Google Sheets with your email list
 * 2. Extensions → Apps Script
 * 3. Paste this entire script
 * 4. Update the CONFIG section below
 * 5. Run sendWeeklyEmail() to send
 *
 * SHEET FORMAT:
 * Column A: first_name
 * Column B: email
 * Column C: status (must be "active" to receive email)
 *
 * First row should be headers.
 */

// ============ CONFIG - UPDATE THESE ============
const CONFIG = {
  // Email settings
  SUBJECT: "This Week at [Your Company] - [Date]",
  SENDER_NAME: "[Your Company]",
  REPLY_TO: "hello@[your-domain]", // Optional: set your reply-to address

  // Sheet settings
  SHEET_NAME: "Sheet1", // Name of the sheet tab with email list

  // Testing
  TEST_MODE: true, // Set to false to send to everyone
  TEST_EMAIL: "mhasting1066@gmail.com", // Only sends here when TEST_MODE is true
};

// ============ EMAIL HTML TEMPLATE ============
// Paste your newsletter HTML here
// Use {{greeting}} for the full greeting line:
//   - With name: "Hi Sarah,"
//   - Without name: "Hi there!"

const EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Inline styles work better for email */
    body {
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #081f3f;
      background-color: #faf5f0;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #15465b 0%, #081f3f 100%);
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 24px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 16px;
    }
    .section-title {
      color: #081f3f;
      border-bottom: 2px solid #d97706;
      padding-bottom: 4px;
      margin-top: 24px;
    }
    .cta-button {
      display: inline-block;
      background: #d97706;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: bold;
      margin: 16px 0;
    }
    .footer {
      background: #081f3f;
      color: rgba(255,255,255,0.8);
      text-align: center;
      padding: 16px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>This Week at [Your Company]</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Week of [Date]</p>
    </div>

    <div class="content">
      <p class="greeting">{{greeting}}</p>

      <!-- YOUR NEWSLETTER CONTENT HERE -->

      <!-- REFLECTION SECTION -->
      <h2 class="section-title">This Week's Reflection</h2>

      <p>[Your weekly reflection content goes here]</p>

      <!-- UPCOMING SECTION -->
      <h2 class="section-title">Coming Up This Week</h2>

      <ul>
        <li><strong>Monday:</strong> [Event] — [Time]</li>
        <li><strong>Wednesday:</strong> [Event] — [Time]</li>
      </ul>

      <p style="text-align: center;">
        <a href="[COMMUNITY_URL]" class="cta-button">Join the Community</a>
      </p>

      <p>See you in there,<br><strong>[Your Team]</strong></p>
    </div>

    <div class="footer">
      <p>[Your Company] | [Your tagline]<br>
      Questions? Just reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

// ============ MAIN FUNCTIONS ============

/**
 * Send the weekly email to all active subscribers
 */
function sendWeeklyEmail() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Find column indexes
  const nameCol = headers.indexOf('first_name');
  const emailCol = headers.indexOf('email');
  const statusCol = headers.indexOf('status');

  if (emailCol === -1) {
    throw new Error('Could not find "email" column in sheet');
  }

  let sentCount = 0;
  let skippedCount = 0;
  const errors = [];

  // Process each row (skip header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[emailCol];
    const firstName = nameCol !== -1 ? row[nameCol] : '';
    const status = statusCol !== -1 ? row[statusCol] : 'active';

    // Skip if no email or not active
    if (!email || !email.includes('@')) {
      skippedCount++;
      continue;
    }

    if (status && status.toLowerCase() !== 'active') {
      skippedCount++;
      continue;
    }

    // In test mode, only send to test email
    if (CONFIG.TEST_MODE && email.toLowerCase() !== CONFIG.TEST_EMAIL.toLowerCase()) {
      skippedCount++;
      continue;
    }

    try {
      // Personalize the email
      // With name: "Hi Sarah," / Without name: "Hi there!"
      const greeting = firstName ? ('Hi ' + firstName + ',') : 'Hi there!';
      const personalizedHtml = EMAIL_HTML
        .replace(/\{\{greeting\}\}/g, greeting)
        .replace(/\{\{first_name\}\}/g, firstName || 'there')
        .replace(/\{\{fallback_greeting\}\}/g, firstName || 'there');

      // Send email
      GmailApp.sendEmail(email, CONFIG.SUBJECT, '', {
        htmlBody: personalizedHtml,
        name: CONFIG.SENDER_NAME,
        replyTo: CONFIG.REPLY_TO || undefined
      });

      sentCount++;
      Logger.log('Sent to: ' + email + ' (greeting: ' + greeting + ')');

      // Rate limiting - avoid hitting Gmail limits
      Utilities.sleep(100);

    } catch (e) {
      errors.push(email + ': ' + e.message);
      Logger.log('Error sending to ' + email + ': ' + e.message);
    }
  }

  // Summary
  const summary = [
    '=== EMAIL SEND COMPLETE ===',
    'Sent: ' + sentCount,
    'Skipped: ' + skippedCount,
    'Errors: ' + errors.length,
    CONFIG.TEST_MODE ? '(TEST MODE - only sent to ' + CONFIG.TEST_EMAIL + ')' : ''
  ].join('\n');

  Logger.log(summary);

  if (errors.length > 0) {
    Logger.log('Errors:\n' + errors.join('\n'));
  }

  // Show alert
  SpreadsheetApp.getUi().alert(summary);
}

/**
 * Preview the email (sends test to yourself)
 */
function previewEmail() {
  const testEmail = Session.getActiveUser().getEmail();
  const personalizedHtml = EMAIL_HTML
    .replace(/\{\{greeting\}\}/g, 'Hi TestName,')
    .replace(/\{\{first_name\}\}/g, 'TestName')
    .replace(/\{\{fallback_greeting\}\}/g, 'TestName');

  GmailApp.sendEmail(testEmail, '[PREVIEW] ' + CONFIG.SUBJECT, '', {
    htmlBody: personalizedHtml,
    name: CONFIG.SENDER_NAME
  });

  SpreadsheetApp.getUi().alert('Preview sent to: ' + testEmail);
}

/**
 * Count how many emails will be sent
 */
function countRecipients() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const emailCol = headers.indexOf('email');
  const statusCol = headers.indexOf('status');

  let activeCount = 0;
  let withNames = 0;
  let withoutNames = 0;

  const nameCol = headers.indexOf('first_name');

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[emailCol];
    const status = statusCol !== -1 ? row[statusCol] : 'active';
    const firstName = nameCol !== -1 ? row[nameCol] : '';

    if (email && email.includes('@') && (!status || status.toLowerCase() === 'active')) {
      activeCount++;
      if (firstName) {
        withNames++;
      } else {
        withoutNames++;
      }
    }
  }

  SpreadsheetApp.getUi().alert(
    'Recipients: ' + activeCount + '\n' +
    'With names: ' + withNames + '\n' +
    'Without names (will use "Hi there"): ' + withoutNames
  );
}

/**
 * Add menu items when sheet opens
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Newsletter Email')
    .addItem('Count Recipients', 'countRecipients')
    .addItem('Preview Email (send to me)', 'previewEmail')
    .addSeparator()
    .addItem('Send Weekly Email', 'sendWeeklyEmail')
    .addToUi();
}

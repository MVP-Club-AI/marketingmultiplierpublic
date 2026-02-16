# Weekly Email Workflow

This document describes how to send the weekly [Your Company] newsletter with personalized greetings using the Gmail API.

## Quick Reference

```bash
# Preview who will receive (no emails sent)
node scripts/send-newsletter.js --preview --newsletter "path/to/newsletter.html"

# Send test email to yourself
node scripts/send-newsletter.js --test --newsletter "path/to/newsletter.html"

# Send to all active subscribers
node scripts/send-newsletter.js --send --subject "This Week at [Your Company] - [Date]" --newsletter "path/to/newsletter.html"
```

**Typical workflow:** Just tell Claude "generate newsletter" then "send newsletter" -- Claude handles the commands.

---

## Weekly Process

```
WEEKLY EMAIL WORKFLOW
---------------------------------------------------------------------

1. FOUNDER WRITES REFLECTION
   --> Save to: /marketing/inputs/newsletter/YYYY-MM-DD_reflection.md

2. TELL CLAUDE: "Generate this week's newsletter"
   --> Provide: video link, blog links, upcoming events
   --> Claude generates HTML
   --> Saves to: /marketing/to-review/newsletter/

3. REVIEW
   --> Preview HTML in browser
   --> Request edits if needed

4. TELL CLAUDE: "Send the newsletter"
   --> Claude runs test send, then full send
   --> Reads subscribers from Google Sheet
   --> Archives HTML to /marketing/posted/newsletter/
```

### Sunday: Step by Step

1. **Write founder reflection**
   - Save to `/marketing/inputs/newsletter/YYYY-MM-DD_reflection.md`

2. **Tell Claude: "Generate this week's newsletter"**
   - Include: YouTube video link, any blog post URLs, event updates
   - Claude creates the HTML and saves it

3. **Review in browser**
   - Open the HTML file
   - Request any changes

4. **Tell Claude: "Send the newsletter"**
   - Claude sends a test email first
   - You verify it looks good
   - Claude sends to all subscribers

5. **Done** -- Claude archives the HTML automatically

---

## Email Content Guidelines

### Structure (in order)
1. **Header** -- "This Week at [Your Company]" + week date
2. **Greeting** -- Personalized (`{{greeting}}`)
3. **Intro paragraph** -- Brief welcome, 1-2 sentences
4. **Founder Reflection** -- The lead content, highest value
5. **This Week (Look Back)** -- YouTube video, key highlights
6. **From the Blog** -- Links to blog posts only (not LinkedIn)
7. **Coming Up This Week** -- Events with dates, times, meeting links
8. **Getting Started callout** -- If upcoming sessions scheduled
9. **CTA** -- Join [Your Company] button
10. **Sign-off** -- "See you in there, [Founder Names]"
11. **Footer** -- "Questions? Just reply to this email."

### Content Rules

**Greeting:**
- With name: "Hi Sarah,"
- Without name: "Hi there!"
- Use `{{greeting}}` placeholder in template

**Video (YouTube):**
- Do NOT embed video (email clients block iframes)
- Use clickable thumbnail image
- YouTube thumbnails: `https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg`
- Add "Watch on YouTube ->" link below

**Blog Links:**
- Link to blog posts on your website, NOT LinkedIn posts
- URL format: `https://www.[your-domain]/blog/[slug]/`
- Include brief description and author

**Events:**
- List day, date, time in your timezone (e.g., "Monday 1/27 - 6-8pm ET")
- Include event name and brief description
- Include meeting link for each

**Reflection:**
- Avatar with first initial
- Author name and "This week's reflection" label
- Keep paragraphs short and scannable
- Bold key phrases for skimmability

### Visual Style
- Header: Dark gradient (#15465b -> #081f3f)
- Accent color: Orange (#d97706)
- Gold accent: #eba714
- Section headers: Orange underline
- Event box: Dark background (#081f3f) with gold title
- Buttons: Orange with white text
- Body background: Cream (#faf5f0)

---

## Information Needed Each Week

| Component | Source | Notes |
|-----------|--------|-------|
| **Founder reflection** | Founder writes in `/inputs/newsletter/` | 1-2 paragraphs, personal, specific |
| **YouTube video** | This week's recordings/presentations | Get video ID for thumbnail |
| **Blog posts** | Check `/marketing/posted/blog/` | Get URLs from your website |
| **Upcoming events** | Google Calendar / Community platform | Include meeting links |

### Regular Weekly Events

| Day | Event | Time | Meeting Link |
|-----|-------|------|--------------|
| [Fill in day] | [Fill in event name] | [Fill in time and timezone] | [Fill in meeting URL] |
| [Fill in day] | [Fill in event name] | [Fill in time and timezone] | [Fill in meeting URL] |
| [Fill in day] | [Fill in event name] | [Fill in time and timezone] | [Fill in meeting URL] |

### Getting Video Thumbnail
For YouTube video `https://www.youtube.com/watch?v=VIDEO_ID`:
- Thumbnail URL: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
- If maxresdefault doesn't exist, try `hqdefault.jpg`

---

## Setup (One-Time)

### 1. Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "[Your Company] Email")
3. Enable APIs:
   - APIs & Services -> Library -> Search "Gmail API" -> Enable
   - APIs & Services -> Library -> Search "Google Sheets API" -> Enable

### 2. OAuth Consent Screen

1. Go to **Google Auth Platform** -> **Branding**
   - App name: "[Your Company] Email Sender"
   - Support email: your email
2. Go to **Audience**
   - User type: External
   - Publishing status: Testing
3. Add **Test users**: [Fill in your team member emails, e.g., founder1@[your-domain], founder2@[your-domain]]
4. Go to **Data Access** -> Add scopes:
   - `gmail.send`
   - `spreadsheets.readonly`

### 3. OAuth Credentials

1. Go to **Google Auth Platform** -> **Clients**
2. Create OAuth client -> Desktop app
3. Download JSON -> save as `credentials.json` in repo root
4. (This file is gitignored for security)

### 4. First Authorization (Each Team Member)

The repo includes a shared `token.json`, but it's authorized for one account. **Each team member should re-authorize with their own @[your-domain] account:**

1. Delete the existing token:
   ```bash
   rm token.json
   ```

2. Run the script:
   ```bash
   node scripts/send-newsletter.js --preview --newsletter "marketing/posted/newsletter/YYYY-MM-DD_weekly-email.html"
   ```

3. Open the URL it provides in your browser
4. Sign in with **your** @[your-domain] account (must be a test user)
5. Authorize the app
6. Copy the code from the redirect URL (everything after `code=` and before `&`)
7. Paste into terminal

Your personal `token.json` is created. Emails will send from your account.

**Note for Claude:** If a team member reports auth errors or wants to send from a different account, remind them to delete `token.json` and re-authorize.

---

## Maintaining the Email List

### Email List Location
The email list is stored in Google Sheets and read directly via API:
- **Sheet ID:** `[YOUR_SHEET_ID]`
- **Tab:** `[your-list-tab-name]`

### Sheet Format
| first_name | email | status |
|------------|-------|--------|
| Sarah | sarah@example.com | active |
| | unknown@example.com | active |

- `status`: Must be `active` to receive emails
- Leave `first_name` blank if unknown (greeting will be "Hi there!")

### Adding New Subscribers
Add a row to the Google Sheet with email and status = `active`.

### Unsubscribing
Change `status` to `unsubscribed` in the Google Sheet.

---

## Email-Safe HTML Guidelines

Email clients (Gmail, Outlook, Apple Mail) have limited CSS support.

### DO use:
- Tables for layout with `align="center"` and `valign="middle"`
- Inline styles
- `text-align: center` for text centering

### DON'T use:
- `display: flex`, `align-items`, `justify-content`
- CSS classes (inline styles are more reliable)
- Absolute positioning for overlays

### Avatar Example (email-safe)
```html
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="48" height="48" align="center" valign="middle"
        style="background: #d97706; border-radius: 50%; color: #fff;
               font-weight: 600; font-size: 18px;">
      [Initial]
    </td>
  </tr>
</table>
```

### Video Thumbnails
- Show thumbnail image with "Watch on YouTube ->" link below
- Don't try to overlay play buttons (breaks in email)

---

## Troubleshooting

### "Request had insufficient authentication scopes"
Delete `token.json` and re-authorize:
```bash
rm token.json
node scripts/send-newsletter.js --test
```

### "Gmail sending limits exceeded"
- Google Workspace: 500 emails/day
- Free Gmail: 100 emails/day

### Emails going to spam
- Use a consistent sender address
- Ask recipients to add you to contacts
- Avoid spam trigger words
- Consider authenticating your domain (SPF, DKIM)

### Token expired
Delete `token.json` and re-run the script to get a new token.

---

## Legacy: Google Apps Script Method

The original method using Google Sheets + Apps Script is documented in `scripts/google-apps-script-email-sender.js`. This still works but requires more manual copy/paste. The direct Gmail API method above is recommended.

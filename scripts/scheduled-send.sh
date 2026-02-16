#!/bin/bash
# Scheduled newsletter send script
# Update the variables below for each send, then set a cron job:
#   crontab -e
#   0 6 17 2 * /path/to/your/repo/scripts/scheduled-send.sh

REPO_DIR="/path/to/your/repo"
SUBJECT="This Week at [Your Company] - [Date]"
NEWSLETTER="marketing/to-post/newsletter/YYYY-MM-DD_weekly-email.html"

cd "$REPO_DIR"
node scripts/send-newsletter.js --send --subject "$SUBJECT" --newsletter "$NEWSLETTER" >> "$REPO_DIR/scripts/newsletter-send.log" 2>&1
# Move to posted after sending
mv "$NEWSLETTER" marketing/posted/newsletter/

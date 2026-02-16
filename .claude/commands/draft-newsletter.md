# Draft Newsletter

Create this week's newsletter (HTML email).

## Reference Documents

- **Template:** `/marketing/templates/weekly-newsletter.html`
- **Workflow:** `/docs/06-weekly-email-workflow.md`
- **Previous emails:** `/marketing/posted/newsletter/`

## Instructions

### 1. Gather Inputs

**Ask user for:**
- Founder reflection (or check `/marketing/inputs/newsletter/` for draft)
- Which founder is writing this week ([Founder 1], [Founder 2], or [Founder 3])
- Any YouTube video to feature
- Any specific wins, learnings, or community highlights

**Auto-gather:**
- Recent blog posts from `/marketing/posted/blog/` (pick 2-3 most recent)
- Upcoming events from the recurring schedule (see below)

### 2. Recurring Weekly Events

| Day | Event | Time (ET) | Google Meet |
|-----|-------|-----------|-------------|
| Monday | [Weekly Event 1] | [TIME] | [EVENT_LINK] |
| Tuesday | [Weekly Event 2] | [TIME] | [EVENT_LINK] |
| Wednesday | [Weekly Event 3] | [TIME] | [EVENT_LINK] |

**[Onboarding Event] sessions:** Usually first week of each month (confirm with user)

### 3. Generate HTML Email

Use the template structure from `/marketing/templates/weekly-newsletter.html`:

```
STRUCTURE
─────────────────────────────────────────────────────────────
1. Header          "This Week at [Your Company]" + week date
2. Greeting        {{greeting}} placeholder (personalized on send)
3. Intro           Brief welcome paragraph
4. Reflection      Founder's personal reflection (the lead content)
5. This Week       YouTube video thumbnail + description
6. From the Blog   2-3 recent blog post links
7. Upcoming Events Schedule box with dates/times/Meet links
8. Callout         [Onboarding Event] dates if applicable
9. CTA             "Join [Your Company]" button
10. Signature      "See you in there, [Founder 1], [Founder 2] & [Founder 3]"
11. Footer         Reply prompt
```

### 4. Content Rules

**Greeting:**
- Use `{{greeting}}` placeholder — script personalizes on send

**Founder Reflection:**
- Orange avatar with first initial
- Author name + "This week's reflection" label
- Keep paragraphs short, scannable
- Bold key phrases for skimmability

**YouTube Video:**
- Do NOT embed (email clients block iframes)
- Use clickable thumbnail: `https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg`
- Add "Watch on YouTube →" link below

**Blog Links:**
- Link to [your-domain]/blog/, NOT LinkedIn
- Include title, brief description, author

**Events:**
- Format: "Monday 2/3 • 6-8pm ET"
- Include event name and Google Meet link

### 5. Email-Safe HTML

**DO use:**
- Tables for layout (with `align="center"`, `valign="middle"`)
- Inline styles where needed
- The CSS from the template (works in most clients)

**DON'T use:**
- Flexbox for critical layout (breaks in Outlook)
- Video embeds
- Overlay effects on images

### 6. Output

Save to: `/marketing/to-review/newsletter/YYYY-MM-DD_weekly-email.html`

## Final Summary

```
WEEKLY EMAIL DRAFT CREATED

Week of: [Date]
Founder reflection by: [Name]
Video: [Title or "None this week"]
Blog posts: [Count]
Events: [List dates]

Saved to: /marketing/to-review/newsletter/[filename]

Next steps:
1. Open HTML in browser to preview
2. Request any edits
3. Run send script (see /docs/06-weekly-email-workflow.md)
```

## Quick Reference: Sending

```bash
# Preview recipients
node scripts/send-newsletter.js --preview --newsletter "path/to/file.html"

# Test send to yourself
node scripts/send-newsletter.js --test --newsletter "path/to/file.html"

# Send to all subscribers
node scripts/send-newsletter.js --send --subject "This Week at [Your Company] - Feb 2" --newsletter "path/to/file.html"
```

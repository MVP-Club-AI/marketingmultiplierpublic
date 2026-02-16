# Setup Guide

This is a marketing system powered by Claude Code. It provides a complete content pipeline for creating, reviewing, approving, and publishing marketing content across LinkedIn, newsletters, blog, and community channels.

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js 18+
- Git
- A Google Cloud project with Gmail API enabled (for newsletter sending)

## Step 1: Customize Your Brand

### CLAUDE.md
Open `CLAUDE.md` and fill in all `[Fill in]` and `[Your Company]` placeholders:
- Company overview and core thesis
- Brand voice (We Are, We Say, We Never Say, Tone)
- Content pillars
- Founder names and profiles
- Goals and metrics
- Key links

### Brand Skill
Edit `.claude/skills/your-brand/SKILL.md` with your brand guidelines. Rename the folder to match your brand (e.g., `acme-brand/`).

### Visual Brand Skill
Edit `.claude/skills/your-visual-brand/SKILL.md` with your visual identity. Rename the folder to match (e.g., `acme-visual-brand/`).

## Step 2: Set Up Founder Profiles

For each founder or team member who will have content created in their voice:

1. Duplicate `.claude/skills/example-founder/` (e.g., `founder-jane/`)
2. Fill in the voice profile in `SKILL.md`
3. Update references in `.claude/commands/` files:
   - `generate-weekly-content.md` - update founder list and skill references
   - `linkedin-post.md` - update founder options and skill references
   - `process-idea.md` - update founder skill references
   - `blog-post.md` - update founder names

## Step 3: Update Command References

Search all files in `.claude/commands/` for these placeholders and replace with your specifics:
- `[Your Company]` - your company name
- `[Founder 1]`, `[Founder 2]`, `[Founder 3]` - your founder/team names
- `[founder-1]`, `[founder-2]`, `[founder-3]` - folder-safe versions of names
- `[community platform]` - your community platform name
- `[your-domain]` - your domain
- `[Pillar N: Name]` - your content pillars
- `[PATH_TO_WEBSITE_REPO]` - local path to your website repo (for blog publishing)
- `example-founder` skill references - update to your actual founder skill names
- `your-brand` skill references - update to your actual brand skill name

## Step 4: Update the UI

The Marketing UI has placeholder founder names. Update these files:
- `ui/src/lib/types.ts` - Update the `Founder` type with your founder identifiers
- `ui/src/components/calendar/CalendarDay.tsx` - Update founder initials
- `ui/src/components/calendar/CalendarEntryForm.tsx` - Update founder dropdown options
- `ui/src/components/calendar/CalendarView.tsx` - Update founder filter options
- `ui/src/components/activity/ActivityFeed.tsx` - Update founder color assignments

## Step 5: Set Up Newsletter Sending (Optional)

If you want to send newsletters via Gmail API:

1. Create a Google Cloud project and enable the Gmail API
2. Create OAuth 2.0 credentials (Desktop application type)
3. Save the credentials as `credentials.json` in the repo root
4. Update `scripts/send-newsletter.js` with your:
   - Company name (senderName)
   - Reply-to email address
   - Google Sheet ID and range (for subscriber list)
   - Test email address
5. Run the script once to complete OAuth authorization:
   ```bash
   node scripts/send-newsletter.js --preview --newsletter "marketing/templates/weekly-newsletter.html"
   ```
6. Update `marketing/templates/weekly-newsletter.html` with your branding

## Step 6: Set Up Blog Publishing (Optional)

If you want to publish blog posts to a separate website repo via GitHub Actions:

1. Create a Personal Access Token (PAT) with repo access to your website repo
2. Add it as a GitHub secret named `SITE_DEPLOY_TOKEN`
3. Update `.github/workflows/publish-blog-scheduled.yml` with your website repo details
4. Update `.claude/commands/publish-blog.md` with your website repo path and URL

## Step 7: Start Using the System

### Start the Marketing UI
```bash
cd ui && npm install && npm run dev
```
- Frontend: http://localhost:4000
- Backend: http://localhost:4001

### Or use Claude Code directly
```bash
cd /path/to/this/repo
claude
```

Then use slash commands like `/generate-weekly-content`, `/linkedin-post`, `/process-idea`, etc.

## Step 8: Fill in Strategy Docs

The `docs/` folder contains template strategy documents. Fill these in as you develop your marketing strategy:

- `01-brand-strategy.md` - Full brand strategy
- `03-campaign-plan.md` - Campaign planning template
- `04-monitoring-metrics.md` - Metrics framework
- `05-content-calendar.md` - Content calendar structure
- `06-weekly-email-workflow.md` - Newsletter workflow
- `08-big-idea-framework.md` - Big idea development framework

## File Structure Overview

See `CLAUDE.md` for the full file structure documentation. The key directories:

- `marketing/inputs/` - Drop raw inputs here (transcripts, ideas, brainstorming)
- `marketing/to-review/` - Generated content awaiting review
- `marketing/to-post/` - Approved content ready for manual posting
- `marketing/posted/` - Archive of all published content
- `.claude/commands/` - Slash commands for content workflows
- `.claude/skills/` - Brand and voice skills
- `ui/` - Marketing UI (React + Express)
- `scripts/` - Utility scripts

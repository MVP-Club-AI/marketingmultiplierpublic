# [Your Company] Marketing System

This repository powers [Your Company]'s marketing operations using Claude Code as the content engine.

## About [Your Company]

**[Your Company] is a [type of company]** that [describe what your company does and who it serves].

### Core Thesis
- [Core belief #1 about your market/approach]
- [Core belief #2 about your market/approach]
- [Core belief #3 about your market/approach]
- [Core belief #4 about your market/approach]

### Business Model
- **B2B:** [Describe B2B offering, if applicable]
- **B2C:** [Describe B2C offering, platform, and price point, if applicable]
- **Goal:** [Primary growth goal]

### Key Links
- **[Platform/Community]:** [URL]

## How This System Works

```
INPUTS                         CLAUDE CODE                    PIPELINE
─────────────────────────────────────────────────────────────────────────────────
/inputs/transcripts/     →                              →  /to-review/
/inputs/ideas/           →    Brand Skills +               (linkedin/, newsletter/,
/inputs/brainstorming/   →    Commands                      community/, blog/)
/inputs/campaigns/       →                                        ↓
                                                           Human Review
                                                                  ↓
                                                    ┌─────────────┴─────────────┐
                                                    ↓                           ↓
                                              /to-post/                    /posted/
                                           (manual posting)            (automated or
                                                    ↓                   already posted)
                                              Manual Post                      ↓
                                                    ↓                     Archive
                                              /posted/
```

### Content Pipeline

| Stage | Folder | What Happens |
|-------|--------|--------------|
| **Generated** | `/to-review/` | Claude creates content, awaits human review |
| **Approved (manual)** | `/to-post/` | Human approved, needs manual posting |
| **Approved (auto)** | `/posted/` | Goes directly if Zapier handles it |
| **Complete** | `/posted/` | Archive of all published content |

### Blog Publishing Rules

**ALL blog posts MUST go through `/publish-blog` in this repo.** Do not push directly to the website repo.

This ensures:
1. Posts are archived in `/marketing/posted/blog/`
2. Posts are logged in `/marketing/calendar/content-log.csv`
3. We have a single source of truth for what's published

If a post was pushed directly to the website, run `node scripts/check-blog-sync.js` to identify it, then use `/log-post` to add it to the content log retroactively.

## Brand Voice (Quick Reference)

**All content should align with [Your Company]'s big idea.** See `/docs/08-big-idea-framework.md` for the full framework and our evolving articulation of what makes [Your Company] different. The big idea informs all messaging, positioning, and content strategy.

**Core insight:** [One to two sentences that capture your company's central insight. What do most people get wrong, and what does your company understand differently?]

### We Are
- [Brand personality trait #1, e.g., "Peer experts (alongside you, not above you)"]
- [Brand personality trait #2, e.g., "Fun, inviting, supportive, inclusive"]
- [Brand personality trait #3, e.g., "Highly competent [your role]"]
- [Brand personality trait #4, e.g., "Practice-focused, not theory-focused"]

### We Say
- "[Key phrase or tagline #1 that captures your voice]"
- "[Key phrase or tagline #2 that captures your voice]"
- "[Key phrase or tagline #3 that captures your voice]"
- "[Key phrase or tagline #4 that captures your voice]"

### We Never Say
- [Banned word/phrase #1]
- [Banned word/phrase #2]
- [Banned word/phrase #3]
- [Banned word/phrase #4]
- [Banned word/phrase #5]
- [Banned word/phrase #6]

### Tone
- [Tone guideline #1, e.g., "Lead with excitement, not fear"]
- [Tone guideline #2, e.g., "Acknowledge uncertainty as opportunity"]
- [Tone guideline #3, e.g., "Never exploit fear to drive action"]
- [Tone guideline #4, e.g., "Invite, don't lecture"]

### Content Integrity Rules
- **Never invent statistics** about [Your Company]'s work (sessions delivered, people coached, etc.)
- **Never invent facts** about the world (industry statistics, research findings, percentages)
- **When uncertain, ask** - leave claims out or flag them for human review rather than guessing
- Only use numbers and facts that have been explicitly confirmed

### Writing Style Rules
- **Avoid cloying transition phrases** like "Here's what most people don't realize" or "Here's the thing nobody tells you" - just state the point directly
- **Avoid "wise observer" setups** like "I keep having the same conversation" or "People keep asking me about this" - these are humble-brags that position the writer as the one who's figured it out
- Be direct rather than building artificial suspense or surprise
- Get to the actual point without theatrical framing
- **Simple vocabulary** - use plain words ("fun," "wins," "getting better") not fancy alternatives
- **Action first, then feeling** - ground in what you DO, then name how it FEELS
- **Concise but conversational** - tight sentences that still feel like talking, not wordy or repetitive
- **No em dashes** - never use em dashes (—) in any content. Use periods, commas, colons, or parentheses instead
- **No "three musketeers" framing** - don't assign character archetype labels to founders like "the practical one," "the big-picture thinker," "the honest one." Just use their names. Don't reduce founders to a single trait or role

### Visual Content Rules
- **Repurpose familiar visual language** - take something people know (like GitHub's contribution grid) and use it to tell your story
- **Overlay emotion on data** - show the feeling journey on top of concrete information
- **Simple and warm, not corporate** - avoid abstract tech aesthetics
- **Horizontal aspect ratio** for blog embeds (1200x600 works well)
- **Always verify layout in context** - check centering, overflow, etc. after deploying

### Creative Process Rules
- **Don't iterate on broken concepts** - if something isn't working, step back and rethink the core message rather than tweaking the execution
- **Start with what we're trying to communicate** - the message drives the format, not the other way around

## Using This System

### Daily Workflow
1. Drop inputs into `/inputs/` (transcripts, ideas, voice notes)
2. Run appropriate command (e.g., `/process-idea`, `/process-transcript`)
3. Review outputs in `/to-review/`
4. Run `/approve-content` to move approved content to `/to-post/` or `/posted/`
5. Post manually from `/to-post/`, or let Zapier handle automated channels
6. All published content ends up in `/posted/` as archive

### Weekly Workflow
1. **Sunday:** Run `/generate-weekly-content` for all founders' posts
2. **Sunday:** Run `/analyze-week` to review performance
3. **Sunday:** Run `node scripts/check-blog-sync.js` to catch any unlogged posts
4. **Sunday:** Send weekly email (see `/docs/06-weekly-email-workflow.md`)
5. **Ongoing:** Log post performance via Google Form

### Available Commands

**Content Creation:**
- `/generate-weekly-content` - Create week's LinkedIn posts for all founders
- `/linkedin-post` - Quick single post creation
- `/draft-newsletter` - Create weekly newsletter draft
- `/process-idea` - Turn rough idea into polished content

**Content Repurposing:**
- `/process-transcript` - Turn transcript into multi-channel content
- `/repurpose-session` - Full session → complete content package

**Campaigns & Outreach:**
- `/campaign-brief` - Launch a new campaign from a brief
- `/dm-outreach` - Generate personalized DM templates

**Content Management:**
- `/approve-content` - Move reviewed content to `/to-post/` or `/posted/`
- `/publish-blog` - Publish blog posts immediately to website

**Blog Scheduling (GitHub Actions):**
- Blog posts can be scheduled for future publication via GitHub Actions
- Workflow file: `.github/workflows/publish-blog-scheduled.yml`
- To schedule a post:
  1. Place approved markdown in `/marketing/to-post/blog/`
  2. Create/update the workflow with the target date/time (cron format, UTC)
  3. Workflow converts markdown → JSON, pushes to website repo, archives original
- Requires `SITE_DEPLOY_TOKEN` secret (PAT with repo access to [your-website-repo])
- Can trigger manually from GitHub Actions tab for testing

**CRITICAL — Multiple Scheduled Blog Posts:**
- The workflow file is shared across ALL scheduled blog posts. There may be multiple posts scheduled for different dates at the same time.
- **Before modifying the workflow, ALWAYS read the current file first** to check for existing scheduled jobs.
- **NEVER replace the entire workflow.** Add new scheduled posts as additional jobs (e.g., `publish-post-1`, `publish-post-2`) with their own cron triggers.
- Each job should have its own `if` condition scoped to its specific cron schedule.
- When a scheduled post has been published, its job can be removed from the workflow — but leave other pending jobs intact.
- If you are unsure whether a job has already fired, check the post's status in `/marketing/posted/blog/` and the content log before removing it.

**Newsletter Scheduling (Local Cron):**
- Newsletters are scheduled via a local cron job on the user's WSL machine (NOT GitHub Actions)
- Script: `scripts/scheduled-send.sh` — sends the newsletter via Gmail API and moves it to `posted/`
- Send script: `scripts/send-newsletter.js` — reads subscribers from Google Sheets, personalizes greetings
- Credentials: `credentials.json` and `token.json` in repo root (private repo, shared with team)
- Log file: `scripts/newsletter-send.log`
- To schedule a newsletter send:
  1. Draft newsletter HTML in `/marketing/to-review/newsletter/YYYY-MM-DD_weekly-email.html`
  2. Update `scripts/scheduled-send.sh` with the new file path, subject line, and date
  3. Set a cron job with the target date/time: `crontab -e` or pipe to `crontab -`
  4. Cron times are in the WSL system timezone (currently MST/Mountain Time)
  5. After sending, the script auto-moves the HTML to `/marketing/posted/newsletter/`
- **Important:** WSL cron only runs while the WSL instance is active. If the machine is asleep or WSL is closed, the cron job will not fire. Remind the user to keep WSL open if scheduling overnight.
- Example cron entry for 6 AM Eastern (4 AM Mountain) on Feb 16:
  ```
  0 4 16 2 * /path/to/your/repo/scripts/scheduled-send.sh
  ```

**Analysis:**
- `/analyze-week` - Analyze metrics and recommend improvements

## Content Pillars

All content should align with one of these themes:

1. **[Pillar #1 Name]** - [Brief description: the problem you solve]
2. **[Pillar #2 Name]** - [Brief description: your philosophy or approach]
3. **[Pillar #3 Name]** - [Brief description: your core thesis]
4. **[Pillar #4 Name]** - [Brief description: proof of expertise]
5. **[Pillar #5 Name]** - [Brief description: social proof and community]

## Founders

Content is created for founder voices:
- **[Founder Name]** - [Add voice profile]
- **[Founder Name]** - [Add voice profile]
- **[Founder Name]** - [Add voice profile]

Each founder should post 3-5x/week on LinkedIn with their authentic voice while staying on-brand.

## Goals & Metrics

### Primary Goals ([Current Quarter])
- [Goal #1 with specific target]
- [Goal #2 with specific target]
- [Goal #3 with specific target]

### Key Metrics to Track
- [Metric #1, e.g., community member count]
- [Metric #2, e.g., LinkedIn impressions and engagement rate]
- [Metric #3, e.g., email list size and open rates]
- [Metric #4, e.g., discovery calls booked]
- [Metric #5, e.g., conversion rates]

## File Structure

```
/marketing-system
├── CLAUDE.md                    # This file
├── docs/                        # Planning and strategy docs
│   ├── 01-brand-strategy.md
│   ├── 02-system-architecture.md
│   ├── 03-campaign-plan.md
│   ├── 04-monitoring-metrics.md
│   ├── 05-content-calendar.md
│   ├── 06-weekly-email-workflow.md
│   └── 07-changelog.md
├── .claude/
│   ├── skills/                  # Brand and content skills
│   └── commands/                # Slash commands for workflows
├── scripts/                     # Utility scripts
│   └── svg-to-png.js           # Convert SVG visuals to PNG for social media
├── ui/                          # Marketing UI (React + Express)
│   ├── src/                    # Frontend source
│   ├── server/                 # Backend server with Claude SDK
│   └── package.json
├── marketing/
│   ├── inputs/                  # Raw inputs
│   │   ├── transcripts/        # Session transcripts
│   │   ├── ideas/              # Raw ideas
│   │   ├── newsletter/         # Founder reflections for weekly email
│   │   │   └── snippets/        # Reusable content pieces for newsletters
│   │   └── email-lists/        # Email list CSVs and master list
│   ├── to-review/              # Generated content awaiting review
│   ├── to-post/                # Approved content ready to post
│   ├── posted/                 # Archive of published content
│   ├── archive/                # Archived/deprecated materials
│   │   ├── content/            # Old content projects not published
│   │   ├── pipeline-snapshots/ # Historical pipeline states
│   │   └── assets/             # Unused design drafts and visuals
│   ├── assets/                 # Active design assets (images, templates)
│   ├── campaigns/              # Campaign briefs and assets
│   ├── templates/              # Content templates
│   └── calendar/               # Content calendar
└── README.md
```

## Content Calendar (schedule.json)

The team's forward-looking content plan lives in `marketing/calendar/schedule.json`. This file is committed to git and shared across the team. The Marketing UI also reads and writes this file.

### Reading the Calendar
When someone asks "what's going out this week?" or "what's planned for Monday?":
1. Read `marketing/calendar/schedule.json` for planned/in-progress/ready entries
2. Read `marketing/calendar/content-log.csv` for already-posted entries
3. Check `marketing/to-post/` for approved content ready to go

### Writing to the Calendar
When someone says "I'm posting X on Monday" or "plan a LinkedIn post for Tuesday":
1. Read the current `marketing/calendar/schedule.json`
2. Add a new entry with this structure:
   ```json
   {
     "id": "YYYY-MM-DD-founder-type-timestamp",
     "date": "YYYY-MM-DD",
     "founder": "[founder-name]|company",
     "type": "linkedin|newsletter|community|blog|graphics",
     "title": "Description of the content",
     "status": "planned",
     "notes": "",
     "filePath": null,
     "createdAt": "ISO-8601",
     "updatedAt": "ISO-8601"
   }
   ```
3. Write the updated file back

### Status Flow
- `planned` — intent declared, no content yet
- `in-progress` — content is being created
- `ready` — content is approved and ready to post
- `posted` — content has been published (should also be in content-log.csv)

### Linking Content to Calendar
When content is generated for a planned calendar entry, update the entry's `filePath` to point to the file in the pipeline (e.g., `marketing/to-review/linkedin/[founder]/2026-02-17_topic.md`) and set status to `in-progress`.

## Archiving Strategy

All archived materials go in `/marketing/archive/` with the following structure:

| Subfolder | What Goes Here | When to Archive |
|-----------|----------------|-----------------|
| `content/` | Content projects that were created but not published | When a content direction is abandoned or superseded |
| `pipeline-snapshots/` | Point-in-time copies of `/to-review/` or other pipeline folders | When doing major cleanups or resets |
| `assets/` | Design drafts, unused visuals, exploratory brand work | When a design direction is abandoned or finalized elsewhere |

**Naming convention:** Use date prefixes for easy sorting: `YYYY-MM-DD_description`

**Examples:**
- `archive/content/2026-01-06_product-launch-campaign/`
- `archive/assets/2026-01-24-youtube-banner-drafts/`
- `archive/pipeline-snapshots/to-review-2025-01-04/`

**Note:** `/posted/` is NOT an archive — it's the canonical record of published content. Don't confuse "posted" with "archived."

## Scripts

### SVG to PNG Conversion

LinkedIn and most social platforms don't accept SVG files. Use this script to convert:

```bash
node scripts/svg-to-png.js path/to/image.svg [output.png]
```

The script auto-detects SVG dimensions and outputs a clean PNG with no scrollbars or whitespace.

### Merge Email Lists

Combines and deduplicates email lists from multiple sources:

```bash
node scripts/merge-email-lists.js
```

Reads from: `marketing/inputs/email-lists/source-*.csv`
Outputs to: `marketing/inputs/email-lists/[your-company]-master-list.csv`

### Blog Sync Check

Compares blog posts on the live website against `content-log.csv` to find posts that were published but not logged:

```bash
node scripts/check-blog-sync.js
```

Run this weekly (or after any direct website pushes) to catch gaps in tracking.

### Newsletter Sending (Gmail API)

`scripts/send-newsletter.js` — Send newsletters directly via Gmail API.

```bash
node scripts/send-newsletter.js --preview --newsletter "path/to/file.html"
node scripts/send-newsletter.js --send --subject "Subject Line" --newsletter "path/to/file.html"
```

**Team member setup:** Each person must authorize with their own @[your-domain] account:
1. Delete `token.json`
2. Run the script
3. Complete OAuth flow in browser

See `/docs/06-weekly-email-workflow.md` for full instructions.

## Marketing UI

A web-based interface for working with the marketing system. Provides a chat interface to Claude and visual management of the content pipeline.

### Starting the UI

```bash
cd ui && npm run dev
```

This starts:
- **Frontend:** http://localhost:4000 (Vite + React)
- **Backend:** http://localhost:4001 (Express + WebSocket)

### UI Features

**Chat Tab:**
- Conversational interface with Claude
- Command sidebar with hover tooltips explaining each command
- Click a command to prefill it in the input (add your own context before sending)

**Pipeline Tab:**
- Visual view of content in to-review, to-post, and posted stages
- Click into files to see content details

**Newsletter Tab:**
- Newsletter-specific workflow view

### UI Architecture

```
ui/
├── src/
│   ├── App.tsx              # Main app with chat, tabs, commands
│   ├── components/
│   │   ├── chat/            # Chat interface components
│   │   ├── pipeline/        # Pipeline view components
│   │   └── newsletter/      # Newsletter view components
│   ├── hooks/               # React hooks for state and streaming
│   └── lib/                 # Types and utilities
├── server/
│   └── index.ts             # Express server with Claude SDK integration
└── package.json
```

## Getting Started

1. Clone this repo and install dependencies
2. Set up your brand voice in `/docs/01-brand-strategy.md` and the Brand Voice section above
3. Define founder voice profiles in the Founders section above
4. Install brand skills in Claude Desktop for consistent voice
5. Use slash commands for content workflows
6. Set up Zapier for automated distribution (optional)
7. Track metrics weekly in Google Sheets or your preferred tool

See `/docs/` for detailed documentation on each component.

## Claude Code Instructions

When a user first starts a conversation in this directory, ask them:

> Would you like me to start the Marketing UI? It provides a visual interface for chatting and managing the content pipeline at http://localhost:4000

If they say yes, run:
```bash
cd ui && npm run dev
```

Then confirm both servers are running before continuing.

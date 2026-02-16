# Content Review Command

Generate a Friday content review showing blog post distribution and recommendations for next week.

## Configuration

**Current filter:** Blogs only

To expand to all content types (LinkedIn, Newsletter, etc.), change the filter in Step 2 below from "Channel = Blog only" to "all channels" and update the report labels accordingly.

## Usage

Run this command on Fridays to see blog content balance and plan upcoming posts.

## What it does

1. Analyzes the last 30 days of **blog posts only** from the content log
2. Shows all recent blog posts with date, founder, pillar, and topic
3. Identifies pillars with no blog coverage
4. Shows founder breakdown
5. Provides recommendations for next week

## Instructions for Claude

When the user runs `/content-review`:

1. Read `/marketing/calendar/content-log.csv`

2. Filter to:
   - Last 30 days from today's date
   - **Channel = "Blog" only** (ignore LinkedIn, Newsletter, etc.)

3. Generate a report with this structure:

```
CONTENT REVIEW - Last 30 Days ([date range])
════════════════════════════════════════════════

BLOG POSTS:

[Date] • [Founder] • [Pillar Name] - [Topic]
[Date] • [Founder] • [Pillar Name] - [Topic]
[Continue for all blog posts in last 30 days, newest first]

════════════════════════════════════════════════

PILLAR ANALYSIS (Blogs):

⚠️ NOT COVERED:
  • Pillar [#]: [Name] (0 blogs)
  [List all pillars with no blog posts in last 30 days]

✅ COVERED:
  • Pillar [#]: [Name] ([X] blogs)
  [List pillars with 1+ blog posts]

════════════════════════════════════════════════

FOUNDER BREAKDOWN:

  • [Founder]: [X] blogs
  [List each founder with their blog count]

════════════════════════════════════════════════

RECOMMENDATIONS:

[List pillars that need blog coverage]
```

4. Keep recommendations brief and focused on pillar gaps

## Content Pillars Reference

1. [Pillar 1: Name] - [Description]
2. [Pillar 2: Name] - [Description]
3. [Pillar 3: Name] - [Description]
4. [Pillar 4: Name] - [Description]
5. [Pillar 5: Name] - [Description]
6. [Pillar 6: Name] - [Description]
7. [Pillar 7: Name] - [Description]
8. [Pillar 8: Name] - [Description]

Full descriptions: `/marketing/calendar/content-pillars.md`

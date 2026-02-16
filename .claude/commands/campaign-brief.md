# Campaign Brief

Launch a marketing campaign from a brief or announcement.

## Context

Use this command when launching a new campaign (product launch, event, promotion, announcement). It generates all assets needed for a coordinated multi-channel campaign.

## Instructions

1. **Gather campaign details**: Ask the user for:
   - Campaign name/goal
   - Start and end dates
   - Target audience (B2B, B2C, or both)
   - Key offer or announcement
   - Urgency/scarcity elements (if any)
   - Any existing assets or copy to incorporate

2. **Check for existing brief**: Look in /marketing/campaigns/ for any existing brief

3. **Generate campaign assets**:

### Campaign Strategy (save to /marketing/campaigns/[name]/)

```markdown
# [Campaign Name]

## Overview
- **Goal:** [Specific measurable goal]
- **Timeline:** [Start] - [End]
- **Audience:** [Who]
- **Offer:** [What]

## Key Messages
1. [Primary message]
2. [Supporting message]
3. [Urgency message]

## Success Metrics
- [ ] [Metric 1]
- [ ] [Metric 2]
- [ ] [Metric 3]
```

### LinkedIn Content (Pre-launch → Launch → Post-launch)

**Pre-launch (teaser phase):**
- 3-5 posts building anticipation
- Don't reveal everything, create curiosity

**Launch day:**
- Announcement post for each founder
- Company page official announcement

**Post-launch (momentum):**
- Social proof posts (reactions, signups)
- FAQ/objection handling posts
- Urgency/deadline posts

### Email Sequence

**Sequence structure:**
1. **Teaser** (Day -3): Something's coming
2. **Preview** (Day -1): Here's what it is
3. **Launch** (Day 0): It's live
4. **Social Proof** (Day +2): Early reactions
5. **Objection Handler** (Day +4): Addressing concerns
6. **Last Chance** (Day +6): Deadline approaching
7. **Final** (Day +7): Doors closing

For each email provide:
- Subject line (+ 2 alternatives)
- Preview text
- Full email body
- CTA button text

### Community Content

- Announcement post for existing members
- Discussion prompt to build excitement
- FAQ document for common questions

### Supporting Assets

- FAQ document (10 common questions + answers)
- Objection handling guide
- Landing page copy suggestions
- DM templates for outreach

## Campaign Calendar

Create a day-by-day calendar:
```
DAY -7: [Activities]
DAY -3: [Activities]
DAY -1: [Activities]
DAY 0 (LAUNCH): [Activities]
DAY +1: [Activities]
...
```

## Output

Save all assets to /marketing/campaigns/[campaign-name]/:
```
/marketing/campaigns/[name]/
├── README.md (strategy overview)
├── calendar.md (day-by-day plan)
├── linkedin/
│   ├── pre-launch/
│   ├── launch-day/
│   └── post-launch/
├── email/
│   ├── 01-teaser.md
│   ├── 02-preview.md
│   └── ...
├── community/
└── assets/
    ├── faq.md
    ├── objections.md
    └── dm-templates.md
```

## Final Summary

```
CAMPAIGN CREATED: [Name]
TIMELINE: [Dates]

ASSETS GENERATED:
- LinkedIn posts: X
- Emails: X
- Community posts: X
- Supporting docs: X

CALENDAR CREATED: /marketing/campaigns/[name]/calendar.md

NEXT STEPS:
1. Review and customize messaging
2. Set up email sequence in [tool]
3. Schedule LinkedIn posts
4. Brief team on campaign

Ready to review any specific assets?
```

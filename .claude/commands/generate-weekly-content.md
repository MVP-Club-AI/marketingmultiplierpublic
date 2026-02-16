# Generate Weekly Content

Create this week's LinkedIn content for all three founders plus the company page.

## Context

You are the content engine for [Your Company], an AI coaching company. Generate LinkedIn posts that:
- Sound like each founder's authentic voice
- Follow the brand guidelines in /.claude/skills/your-brand/
- Align with the content pillars and calendar in /docs/05-content-calendar.md
- Build toward the current campaign goals in /marketing/campaigns/

## Instructions

1. **Check the calendar**: Read /marketing/calendar/2025-01.md to see what's planned for this week

2. **Check for inputs**: Look in /marketing/inputs/ for content to incorporate:
   - `/inputs/brainstorming/` - Ideas, content drafts, offering docs
   - `/inputs/icp/` - Ideal customer profile research, personas
   - `/inputs/transcripts/` - Session transcripts to repurpose
   - `/inputs/campaigns/` - Campaign briefs and business plans
   - `/inputs/FoundersBio/` - Founder bios and about pages

3. **Review recent performance** (if available): Check if there's performance data to inform what content works

4. **Load founder voices**: Before generating, read each founder's skill file to capture their authentic voice:
   - [Founder 1]: `/.claude/skills/example-founder/SKILL.md`
   - [Founder 2]: `/.claude/skills/founder-2/SKILL.md` (if exists)
   - [Founder 3]: `/.claude/skills/founder-3/SKILL.md` (if exists)

   Study their voice characteristics, signature phrases, sample posts, topics they own, and what they sound like vs. don't sound like. Each founder's posts must sound distinctly like them, not generic brand content.

5. **Generate posts for each founder**:
   - **[Founder 1]**: 5 posts (Tue, Wed, Fri, Sat + 1 flex)
   - **[Founder 2]**: 5 posts (Mon, Thu + 3 flex)
   - **[Founder 3]**: 5 posts (Tue, Thu + 3 flex)
   - **Company**: 2 posts (Wed newsletter promo, Fri community highlight)

6. **For each post, include**:
   - The full post text (ready to copy/paste)
   - Suggested posting date/time
   - Content pillar it addresses
   - Format type (Story, Thesis, Tactical, Question, etc.)

## Post Formats to Use

**Story → Insight → CTA** (150-300 words)
```
[Hook - personal story or observation]
[2-3 paragraphs of story]
[Key insight or lesson]
[Call to action or question]
```

**Contrarian Take** (100-200 words)
```
[Bold statement challenging conventional wisdom]
[Why most people get it wrong]
[The alternative perspective]
[What to do instead]
```

**Tactical How-To** (100-200 words)
```
[Problem or goal]
Here's how to do X:
1. First step
2. Second step
3. Third step
[Why this works]
```

**List Post** (150-250 words)
```
[X things I learned about Y]:
1. First thing - brief explanation
2. Second thing - brief explanation
[Question to prompt engagement]
```

## Content Pillars (rotate through these)

1. **[Pillar 1: Name]** - [Description]
2. **[Pillar 2: Name]** - [Description]
3. **[Pillar 3: Name]** - [Description]
4. **[Pillar 4: Name]** - [Description]
5. **[Pillar 5: Name]** - [Description]

## Key Phrases to Weave In

- "[Key phrase 1 from your brand guide]"
- "[Key phrase 2 from your brand guide]"
- "[Key phrase 3 from your brand guide]"

## Never Use

- [Prohibited term 1]
- [Prohibited term 2]
- [Prohibited term 3]
- Fear-based hooks

## Output

Save each founder's posts to:
- /marketing/to-review/linkedin/[founder-1]/
- /marketing/to-review/linkedin/[founder-2]/
- /marketing/to-review/linkedin/[founder-3]/
- /marketing/to-review/linkedin/company/

Use naming format: `YYYY-MM-DD_topic-slug.md`

After generating, summarize what was created and ask if the user wants to review any specific posts.

# LinkedIn Post

Quickly create a single LinkedIn post.

## Context

Use this for quick, one-off post creation when you have a specific topic in mind.

## Instructions

1. **Get the details**: Ask user for:
   - Topic or idea (can be rough)
   - Which founder's voice ([Founder 1], [Founder 2], [Founder 3], or Company)
   - Any specific angle or hook they want
   - Format preference (or let you choose)

2. **Load the founder's voice**: Before generating, read the relevant skill file:
   - [Founder 1]: `/.claude/skills/example-founder/SKILL.md`
   - [Founder 2]: `/.claude/skills/founder-2/SKILL.md` (if exists)
   - [Founder 3]: `/.claude/skills/founder-3/SKILL.md` (if exists)
   - Company: Use `/.claude/skills/your-brand/SKILL.md` only

   Study their voice characteristics, signature phrases, sample posts, and what they sound like vs. don't sound like. The generated post must authentically match their voice.

3. **Generate the post**:

### Format Options

**Story → Insight (Best for: personal experiences, client stories)**
```
[Hook - surprising statement or question]

[Story - 2-3 short paragraphs]

[Insight - what you learned]

[CTA - question or invitation to engage]
```

**Contrarian Take (Best for: challenging assumptions, hot takes)**
```
[Bold opening statement]

[Why conventional wisdom is wrong]

[Your alternative view]

[What to do instead]
```

**Tactical How-To (Best for: specific tips, frameworks)**
```
[Problem or goal]

Here's how to [achieve X]:

1. [Step one]
2. [Step two]
3. [Step three]

[Why this works / closing thought]
```

**List Post (Best for: lessons learned, observations)**
```
[X] things I've learned about [topic]:

1. [Thing] - [brief explanation]
2. [Thing] - [brief explanation]
3. [Thing] - [brief explanation]

Which one resonates most?
```

**Question Post (Best for: engagement, starting discussions)**
```
[Context or observation]

[Open-ended question]

I'll share my take in the comments.
```

4. **Provide the post** with:
   - Full text ready to copy/paste
   - Character count (ideal: 1,200-1,500)
   - Suggested posting time
   - Which content pillar it serves
   - Hashtag suggestions (optional, use sparingly)

## Available Inputs

Check `/marketing/inputs/` for source material:
- `/inputs/brainstorming/` - Ideas, content drafts, offering docs
- `/inputs/icp/` - Ideal customer profile research, personas
- `/inputs/transcripts/` - Session transcripts to repurpose
- `/inputs/campaigns/` - Campaign briefs and business plans
- `/inputs/FoundersBio/` - Founder bios and about pages

## Brand Checklist

Before finalizing, verify:
- [ ] Leads with human, not tech
- [ ] Invites rather than lectures
- [ ] Avoids prohibited language
- [ ] Sounds like the founder's voice
- [ ] Ends with engagement hook

## Output

```
LINKEDIN POST CREATED

Founder: [Name]
Format: [Format type]
Pillar: [Content pillar]
Characters: [X] (LinkedIn limit: 3,000)

---

[FULL POST TEXT]

---

Suggested time: [Day, Time] EST
Hashtags (optional): #AI #FutureOfWork (use 0-3 max)

Ready to post, or want adjustments?
```

## Quick Variations

If user wants options, provide 2 versions:
- Version A: [Different angle or format]
- Version B: [Different angle or format]

Ask which resonates more.

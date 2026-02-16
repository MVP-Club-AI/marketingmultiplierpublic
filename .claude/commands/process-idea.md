# Process Idea

Turn one rough idea into content for ALL channels: LinkedIn, newsletter, community, and blog.

## Context

Use this when a founder has a rough idea—a voice memo, a few bullet points, a shower thought—that needs to become real content across all channels.

**One input → Four outputs.**

## Instructions

1. **Get the idea**: Ask user for:
   - The raw idea (text, or point to file in /marketing/inputs/)
   - Which founder's voice ([Founder 1], [Founder 2], [Founder 3])
   - Any specific angle or framing they want

2. **Load required skills**: Read before generating:
   - Founder voice: `/.claude/skills/example-founder/SKILL.md` (or relevant founder)
   - Brand: `/.claude/skills/your-brand/SKILL.md`
   - SEO/AEO: `/.claude/skills/seo-aeo-optimization/SKILL.md` (for blog)

3. **Check inputs for context**: Look in `/marketing/inputs/` for supporting material:
   - `/inputs/brainstorming/` - Ideas, content drafts, offering docs
   - `/inputs/icp/` - Ideal customer profile research
   - `/inputs/FoundersBio/` - Founder bios

4. **Analyze the idea**:
   - What's the core insight?
   - Which content pillar does it align with?
   - Is there a story or example to anchor it?
   - What's the transformation or takeaway?
   - What questions would people search for about this topic?

5. **CRITICAL - Examples and authenticity**:
   - **NEVER fabricate examples** - don't invent tasks, projects, or anecdotes the founder didn't actually do
   - Use only real examples from founder's documented background and sample posts
   - If no real example fits, use hypothetical framing ("Imagine you need to...", "Consider a task like...")
   - If the content would benefit from a specific real example, **ASK THE USER** before generating: "This post would be stronger with a real example of [X]. Can you share one?"
   - When in doubt, keep it general rather than inventing specifics

6. **Generate content for ALL FOUR channels**:

---

### LinkedIn Post

**Format:** Story → Insight or Contrarian Take or Tactical How-To
**Length:** 1,200-1,500 characters (ideal for engagement)
**Structure:**
```
[Specific, concrete opening - not a formula hook]

[Story or context - 2-3 short paragraphs]

[Key insight - the transformation or lesson]

[Invitation to engage - genuine, not engagement farming]
```

**Requirements:**
- Sounds like the founder (use their voice, not generic)
- Creates space for the reader (not triumphant)
- Starts with something specific and concrete
- Avoids LinkedIn formula patterns
- No prohibited language

---

### Newsletter Section

**Format:** Insight + Actionable Takeaway
**Length:** 200-300 words
**Structure:**
```
## [Section Headline]

[Opening hook - connect to reader's experience]

[Core insight - the main idea expanded]

[Specific example or story]

**Try this:** [One actionable thing they can do this week]
```

**Requirements:**
- Can stand alone or be part of weekly newsletter
- More depth than LinkedIn (readers opted in)
- Always include actionable takeaway

---

### Community Discussion Prompt

**Format:** Question that sparks conversation
**Length:** 50-150 words
**Structure:**
```
[Brief context or observation]

[Open-ended question that invites sharing]

[Optional: Share your own quick answer to model the response]
```

**Requirements:**
- Designed to generate replies, not just likes
- Makes members feel their experience matters
- Low barrier to respond

---

### Blog Post

**Format:** SEO/AEO optimized long-form
**Length:** 1,200-2,000 words
**Structure:**
```
---
title: [Question-based or problem-focused title]
slug: keyword-rich-slug
meta_description: [150 chars - direct answer + value prop]
author: [Name]
author_bio: [One sentence credentials]
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
pillar: [Content pillar]
schema_types: [Article, FAQ, HowTo as appropriate]
---

# [Title]

**[Direct answer - 40-60 words that answer the core question. This is what AI search will cite.]**

[Opening paragraph connecting to reader's situation]

## [Question-based H2]

**[Direct answer - 40-60 words]**

[Expanded content with examples]

## [Question-based H2]

**[Direct answer - 40-60 words]**

[Expanded content]

## [Comparison table or How-to steps]

[Structured, scannable content]

## Frequently Asked Questions

### [Question]?
**[Direct answer]**

### [Question]?
**[Direct answer]**

---

## [CTA Section]

[Invitation aligned with [Your Company] voice]

---

*Written by [Author], [credentials]. Last updated [Date].*
```

**Requirements:**
- Every H2 starts with 40-60 word direct answer (for AI citation)
- Headings are questions people actually search
- Includes FAQ section
- Includes comparison table OR step-by-step
- Author attribution with credentials
- Scannable structure (lists, tables, short paragraphs)
- Internal link suggestions to related content

---

### Visual Asset (Optional)

If the idea benefits from a visual diagram or infographic for LinkedIn:

**Format:** SVG (1200x630px for LinkedIn)
**Style:** Follow [Your Company] Visual Brand guidelines (your brand palette)
**Structure:**
- Clear title
- Simple visual concept (comparison, flow, diagram)
- Bottom tagline with key insight
- [Your Company] attribution

Save to: `/marketing/to-review/linkedin/[founder]/YYYY-MM-DD_topic-visual.svg`

**Note:** SVG must be converted to PNG before posting to LinkedIn. Use:
```bash
cd scripts && node svg-to-png.js path/to/visual.svg
```

---

## Output

Save all content to `/marketing/to-review/`:

```
/marketing/to-review/
├── linkedin/[founder]/YYYY-MM-DD_topic-slug.md
├── linkedin/[founder]/YYYY-MM-DD_topic-visual.svg  (if visual created)
├── newsletter/YYYY-MM-DD_topic-slug.md
├── community/YYYY-MM-DD_topic-slug.md
└── blog/YYYY-MM-DD_topic-slug.md
```

Each file should include appropriate frontmatter for its channel.

## Final Summary

After generating, provide:

```
IDEA PROCESSED: [Topic]
FOUNDER: [Name]
PILLAR: [Content pillar]

CONTENT CREATED:
- LinkedIn post: /to-review/linkedin/[founder]/[filename]
- LinkedIn visual: /to-review/linkedin/[founder]/[filename].svg (if created)
- Newsletter section: /to-review/newsletter/[filename]
- Community prompt: /to-review/community/[filename]
- Blog post: /to-review/blog/[filename]

VISUAL ASSET:
- Created: [Yes/No]
- Convert before posting: cd scripts && node svg-to-png.js [path]

PREVIEW:
LinkedIn opening: "[First line]"
Newsletter headline: "[Headline]"
Community question: "[Question]"
Blog title: "[Title]"

BLOG STRUCTURE:
- H2: [Question 1]
- H2: [Question 2]
- H2: [Question 3]
- H2: FAQ ([X] questions)
- Schema: [Article, FAQ, HowTo]

Ready to review? I can show any piece in full or make adjustments.
```

## Example

**Input:** "[Your rough idea or topic]"
**Founder:** [Founder 1]

**Output Preview:**

| Channel | Opening/Title |
|---------|---------------|
| LinkedIn | "[Hook from the idea]" |
| Newsletter | "[Headline version of the idea]" |
| Community | "[Discussion question version]" |
| Blog | "[SEO-optimized question-based title]" |

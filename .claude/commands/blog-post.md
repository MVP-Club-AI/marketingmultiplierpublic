# Blog Post

Create a long-form blog post optimized for both traditional SEO and AI search engines (ChatGPT, Perplexity, Gemini).

## Context

Blog posts serve as the "home base" for content—evergreen, searchable, and citable by AI. They should be discoverable via Google AND get cited in AI-generated answers.

**One post should:**
- Rank in traditional search
- Get cited by AI search engines
- Drive traffic to [Your Company]
- Establish authority on the topic
- Connect to the broader topic cluster

## Instructions

1. **Get the details**: Ask user for:
   - Topic or idea
   - Which founder's voice ([Founder 1], [Founder 2], [Founder 3])
   - Target audience for this post
   - Any specific questions to answer
   - Related posts to link to (topic cluster)

2. **Load required skills**: Read before generating:
   - `/.claude/skills/seo-aeo-optimization/SKILL.md` (structure, schema, AEO requirements)
   - `/.claude/skills/example-founder/SKILL.md` (or relevant founder)
   - `/.claude/skills/your-brand/SKILL.md` (voice, prohibited language)

3. **Research phase**:
   - Identify 5-8 questions people actually ask about this topic
   - These become your H2/H3 headings
   - Consider what someone would type into ChatGPT or Google

4. **Generate the blog post** following this structure:

---

### Frontmatter

```yaml
---
title: "[Question or Problem]: [Value Proposition]"
slug: keyword-rich-url-slug
meta_description: "[150 chars max — direct answer + value prop]"
author: [Full Name]
author_bio: "[Credentials + relevant experience in one sentence]"
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
pillar: [Content pillar from [Your Company]]
cluster: [Topic cluster name]
schema_types: [FAQ, HowTo, Article]
word_count: [target 1200-2000]
---
```

### Opening (Critical for AI Citation)

```markdown
# [Title]

**[Direct answer / TL;DR — 40-60 words that answer the core question. This is what AI will cite.]**

[Opening paragraph — connect to reader's situation, establish why this matters to them. 50-100 words. Remember: create space for the reader, don't be triumphant.]
```

### Body Sections

Each H2 section MUST follow this pattern:

```markdown
## [Question-based heading]

**[Direct answer — 40-60 words that fully answers the question]**

[Expanded content — examples, nuance, proof. 100-300 words]
```

### Required Elements

**Include at least one of:**
- Comparison table (X vs Y)
- Step-by-step instructions (with H3s for each step)
- Numbered list of key points

**Include:**
- FAQ section (3-5 questions with direct answers)
- Internal links to related posts (topic cluster)
- CTA aligned with [Your Company] goals

### Closing

```markdown
---

## [CTA — Join community / Subscribe / etc.]

[Invitation that creates space, doesn't pressure. Aligned with [Your Company] voice.]

---

*Written by [Author], [one-line credentials]. Last updated [Date].*
```

### Schema Markup

Generate appropriate schema:
- **Always:** Article schema
- **If Q&A sections:** FAQ schema
- **If step-by-step:** HowTo schema

---

## Quality Checklist

Before finalizing, verify:

### Structure (AEO)
- [ ] Every H2 starts with 40-60 word direct answer
- [ ] Headings are questions people actually ask
- [ ] Content is scannable (lists, tables, short paragraphs)
- [ ] FAQ section included
- [ ] Comparison table or steps included

### SEO
- [ ] Title under 60 characters
- [ ] Meta description under 150 characters
- [ ] Slug is keyword-rich and readable
- [ ] Internal links to related content

### E-E-A-T
- [ ] Author name and credentials
- [ ] Date published and updated
- [ ] First-hand experience referenced
- [ ] Sources cited where needed

### Voice
- [ ] Matches founder's voice (not generic)
- [ ] Creates space for reader (not triumphant)
- [ ] Avoids LinkedIn formula patterns
- [ ] Avoids prohibited language

### Schema
- [ ] Article schema generated
- [ ] FAQ schema if applicable
- [ ] HowTo schema if applicable

---

## Scheduling Note

If the user wants to schedule this post for future publication via GitHub Actions, remind them that the workflow file (`.github/workflows/publish-blog-scheduled.yml`) is shared across all scheduled posts. Always read the existing workflow before modifying it, and add new jobs rather than replacing the file. See the "Multiple Scheduled Blog Posts" section in CLAUDE.md.

## Output

Save the blog post to: `/marketing/to-review/blog/YYYY-MM-DD_slug.md`

The file should include:
1. Complete frontmatter
2. Full blog post content
3. Schema markup (in a separate code block at the end)

---

## Final Summary

After generating, provide:

```
BLOG POST CREATED

Title: [Title]
Slug: /blog/[slug]
Author: [Name]
Word Count: ~[X] words
Pillar: [Content pillar]
Cluster: [Topic cluster]

HEADINGS:
- H2: [Question 1]
- H2: [Question 2]
- H2: [Question 3]
- H2: FAQ
- H2: [CTA]

SCHEMA INCLUDED:
- Article: Yes
- FAQ: [Yes/No]
- HowTo: [Yes/No]

INTERNAL LINKS SUGGESTED:
- [Related post 1]
- [Related post 2]

File: /to-review/blog/[filename]

Ready to review, or want adjustments?
```

---

## Example Output Preview

**Title:** [Example Title: Question or Problem-Based]

**Opening:**
> **[Direct answer in 40-60 words that answers the core question. This is what AI search will cite.]**

**Headings:**
- [Question-based H2 heading 1]
- [Question-based H2 heading 2]
- [Question-based H2 heading 3]
- [Question-based H2 heading 4]
- [Question-based H2 heading 5]
- FAQ
- [CTA heading]

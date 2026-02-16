---
name: seo-aeo-optimization
description: Use when creating blog content optimized for both traditional SEO and AI search engines (ChatGPT, Perplexity, Gemini). Provides structure, formatting, and schema guidelines.
---

# SEO + AEO Optimization Skill

Use this skill when creating blog posts, long-form content, or any content intended to rank in traditional search AND be cited by AI search engines.

---

## The Dual Optimization Challenge

Content now needs to work for two audiences:
1. **Traditional SEO** — Rank in Google, drive clicks
2. **AEO (Answer Engine Optimization)** — Get cited in ChatGPT, Perplexity, Gemini answers

These have different requirements. This skill helps you satisfy both.

---

## Key Principle: Direct Answers First

AI search engines scrape the first clear answer they find. Every section must lead with a direct answer.

**Format:**
```
## [Question-based heading]

**[Direct answer in 40-60 words that fully answers the question]**

[Expanded context, examples, nuance — 100-300 additional words]
```

**Example:**

```
## Do I need technical skills to vibe code?

**No. Vibe coding is a communication and management skill, not a programming skill. You describe what you want in plain English, evaluate AI's output, and iterate until it works. The same skills you'd use managing a capable team member.**

I've coached over 100 people through this, many with zero technical background...
[expansion continues]
```

---

## Content Structure for AI Citation

### Question-Based Headings

Use H2s and H3s that match how people actually ask questions:

**Bad (keyword-stuffed):**
- "[Topic] Methodology Overview"
- "Benefits of AI-Assisted Development"

**Good (question-based):**
- "What is vibe coding?"
- "Do I need to know how to code?"
- "How do I get started with vibe coding?"
- "What tools do I need?"

### Scannable Structure

AI search engines favor structured, scannable content over dense paragraphs:

**Use frequently:**
- Bullet lists
- Numbered steps
- Comparison tables
- FAQ sections
- Definition boxes

**Avoid:**
- Long paragraphs without breaks
- Burying answers deep in content
- Vague headings that don't signal content

### Comparative Content Performs Well

Listicles and comparison content account for ~30% of AI citations:

- "X vs Y" comparisons
- "Best [tools/methods] for [use case]"
- "How [thing] compares to [other thing]"

Include comparison tables where relevant.

### Table Formatting Rules

**Always use proper markdown table structure:**

```markdown
| Aspect | Traditional Coding | Vibe Coding |
|--------|-------------------|-------------|
| Skills needed | Programming languages | Clear communication |
| Time to first output | Weeks/months | Hours/days |
| Learning curve | Steep | Gentle |
```

**Critical formatting requirements:**
1. **Header row required** — First row becomes styled header (dark background, white text)
2. **Separator row required** — The `|---|---|---|` line tells the parser this is a table with a header
3. **Keep cells concise** — 2-5 words per cell ideal; long text breaks layout
4. **No nested formatting** — Avoid bold/italic inside cells when possible
5. **3-4 columns max** — More columns get cramped on mobile

**Good table content:**
- Short, scannable comparisons
- Feature/aspect lists
- Before/after contrasts
- Quick reference data

**Bad table content:**
- Full sentences in cells
- Paragraphs of explanation
- More than 5 columns
- Single-column tables (use a list instead)

---

## Schema Markup (Essential for AEO)

Schema markup contributes ~10% to AI search ranking factors. Include appropriate schema for every blog post.

### FAQ Schema

Use for any post with question/answer sections:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need technical skills to vibe code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Vibe coding is a communication and management skill, not a programming skill. You describe what you want in plain English, evaluate AI's output, and iterate until it works."
      }
    },
    {
      "@type": "Question",
      "name": "What tools do I need to start vibe coding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You need an AI assistant (Claude, ChatGPT), a code editor (VS Code with an AI extension like Cline), and an idea for something you want to build."
      }
    }
  ]
}
</script>
```

### HowTo Schema

Use for step-by-step guides:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Start Vibe Coding",
  "description": "A beginner's guide to building with AI, no technical background required.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Define what you want to build",
      "text": "Start with something small and specific. A simple tool, a personal website, a calculator for something you actually need."
    },
    {
      "@type": "HowToStep",
      "name": "Describe it in plain English",
      "text": "Open Claude or ChatGPT and describe what you want. Be specific about the outcome, not the implementation."
    }
  ]
}
</script>
```

### Article Schema

Include for all blog posts:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Is Vibe Coding? The Non-Technical Person's Guide",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "description": "[Brief author credentials and expertise]"
  },
  "datePublished": "2025-01-02",
  "dateModified": "2025-01-02",
  "publisher": {
    "@type": "Organization",
    "name": "[Your Company]"
  }
}
</script>
```

---

## E-E-A-T Signals

AI search engines weight Experience, Expertise, Authoritativeness, and Trustworthiness heavily.

### Required for Every Blog Post:

**Author Attribution:**
- Full name
- Credentials (PhD, certifications, role)
- Relevant experience ("100+ coaching sessions", "built X projects")
- Link to author bio page

**Dates:**
- Publication date
- Last updated date (critical for freshness signals)

**Sources:**
- Cite sources where making claims
- Link to authoritative references
- Reference first-hand experience

**Example Author Block:**

```markdown
---
author: [Author Name]
author_title: [Title], [Your Company]
author_bio: "[Brief bio highlighting relevant expertise and credentials]"
author_credentials:
  - [Credential 1]
  - [Credential 2]
  - Multiple deployed vibe coding projects
---
```

---

## Content Freshness

AI search visibility decays faster than traditional SEO. Perplexity visibility drops within 2-3 days without updates.

### Freshness Strategy:

**High-priority content:** Update every 2-4 weeks
- Add new examples
- Update statistics
- Incorporate recent developments
- Add new FAQ questions

**Evergreen content:** Update monthly
- Check for accuracy
- Add "Last updated" date
- Refresh examples if stale

**Always show:**
- `datePublished`
- `dateModified` (update this with every refresh)

---

## Topic Clusters

Build interconnected content around topics, not isolated posts.

**Example: Vibe Coding Cluster**

```
PILLAR PAGE:
"What Is Vibe Coding? The Complete Guide"

CLUSTER PAGES (link to/from pillar):
├── "Vibe Coding vs Traditional Coding: Key Differences"
├── "How to Start Vibe Coding With No Technical Background"
├── "Best Tools for Vibe Coding in 2025"
├── "Vibe Coding for [Specific Use Case]: A Walkthrough"
├── "Common Vibe Coding Mistakes and How to Avoid Them"
└── "What Can You Build With Vibe Coding? 10 Real Examples"
```

**Internal Linking Rules:**
- Pillar page links to all cluster pages
- Cluster pages link back to pillar
- Cluster pages link to related cluster pages
- Use descriptive anchor text (not "click here")

---

## Blog Post Template

```markdown
---
title: "[Question or Problem]: [Value Proposition]"
slug: keyword-rich-url-slug
meta_description: "[150 characters max — direct answer + value prop]"
author: [Name]
author_bio: "[Credentials + relevant experience]"
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
pillar: [Content pillar]
cluster: [Topic cluster name]
schema_types: [FAQ, HowTo, Article]
---

# [Title — matches <title> tag]

**[Direct answer / TL;DR in 40-60 words that answers the core question]**

[Opening paragraph — connect to reader's problem/situation, 50-100 words]

## [Question-based H2]

**[Direct answer — 40-60 words]**

[Expanded content — 100-300 words with examples]

## [Question-based H2]

**[Direct answer — 40-60 words]**

[Expanded content]

### [H3 subsection if needed]

[Content]

## [Comparison or "How to" section]

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data | Data | Data |

OR

### Step 1: [Action]
[Content]

### Step 2: [Action]
[Content]

## Frequently Asked Questions

### [Question 1]?
**[Direct answer]**

### [Question 2]?
**[Direct answer]**

### [Question 3]?
**[Direct answer]**

---

## [CTA Section]

[Invitation to join community / subscribe / book call — aligned with your brand voice]

---

*Written by [Author Name], [credentials]. Last updated [Date].*

[Schema markup — FAQ, HowTo, Article as appropriate]
```

---

## Checklist Before Publishing

### Structure
- [ ] Title is question-based or problem-focused
- [ ] Meta description is under 150 characters with direct answer
- [ ] Every H2 section starts with 40-60 word direct answer
- [ ] Headings are questions people actually ask
- [ ] Content is scannable (lists, tables, short paragraphs)
- [ ] Comparison table included if relevant
- [ ] FAQ section with 3-5 questions

### Schema
- [ ] Article schema included
- [ ] FAQ schema for Q&A sections
- [ ] HowTo schema for step-by-step content

### E-E-A-T
- [ ] Author name and bio included
- [ ] Author credentials mentioned
- [ ] Publication date included
- [ ] "Last updated" date included
- [ ] Sources cited where making claims

### Topic Cluster
- [ ] Links to pillar page (if cluster page)
- [ ] Links to related cluster pages
- [ ] Descriptive anchor text used

### Voice
- [ ] Matches founder's voice (if attributed)
- [ ] Follows brand guidelines
- [ ] Not formulaic or generic
- [ ] Creates space for reader, not triumphant

---

## Platform-Specific Notes

### ChatGPT
- Favors established sources with structured data
- Domain authority matters more than page rank
- Wikipedia-style structure performs well

### Perplexity
- More UGC-focused (Reddit, LinkedIn content gets cited)
- Semantic/vector-based approach
- Freshness weighted heavily

### Google AI Overviews
- Featured snippet optimization still matters
- Direct answers in first paragraph
- Question-based headings

---

## What to Avoid

- Long paragraphs without structure
- Burying answers deep in content
- Vague or keyword-stuffed headings
- Missing schema markup
- No author attribution
- Stale "last updated" dates
- Isolated content without internal links
- Generic, formulaic writing

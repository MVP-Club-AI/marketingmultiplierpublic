# [Your Company] Marketing System

A Claude Code-powered content engine for [Your Company]. Generate, review, and publish marketing content across LinkedIn, blog, newsletter, and community.

---

## Quick Start

```bash
# Open this folder in Claude Code CLI
cd /path/to/your-marketing-repo
claude

# Generate content
> /generate-weekly-content [optional theme or notes]

# Review what was created
> Show me the posts in /to-review/linkedin/[founder]/
```

---

## Content Pipeline

```
YOU                        CLAUDE CODE                      DISTRIBUTION
-------------------------------------------------------------------------
"Generate content         Commands +           /to-review/
 about [theme]"      ->   Brand Skills    ->   (human reviews)
                                                     |
                                               /to-post/
                                                     |
                                          +---------+---------+
                                          |                   |
                                    MANUAL POST         AUTO PUBLISH
                                    - LinkedIn          - Blog (via
                                    - Newsletter          /publish-blog)
                                    - Community
                                          |                   |
                                               /posted/
                                            (archive)
```

---

## Key Workflows

### 1. Generate Weekly Content

**When:** Sunday, or whenever you need content for the week

```
> /generate-weekly-content

# Or with a specific theme:
> /generate-weekly-content let's focus on [your topic]
```

**Output:** Posts saved to `/marketing/to-review/linkedin/[founder]/`

**Next steps:**
1. Review the generated posts
2. Edit as needed (ask Claude to revise)
3. Move approved posts to `/marketing/to-post/linkedin/`

---

### 2. Generate Multi-Channel Content

**When:** You have a theme or idea you want across all channels

```
> /generate-weekly-content [theme] - then say "now gen the other channel posts for [date]"
```

**Output:** Content for all channels on the same theme:
- `/to-review/linkedin/` - Social posts
- `/to-review/newsletter/` - Email content
- `/to-review/community/` - Community discussion prompts
- `/to-review/blog/` - SEO-optimized long-form article

---

### 3. Publish Blog Posts (Automated)

**When:** Blog content is approved and ready to go live

```
> publish blog
```

**What happens:**
1. Claude reads approved posts from `/marketing/to-post/blog/`
2. Converts markdown to JSON
3. Pushes to website repo
4. Hosting platform auto-deploys
5. Post is live at `[your-domain]/blog/[slug]`
6. Original moved to `/marketing/posted/blog/`

**Requirements:**
- Blog post must be in `/marketing/to-post/blog/`
- Website repo must be accessible locally

---

### 4. Post to LinkedIn (Manual)

**When:** LinkedIn content is approved

**Steps:**
1. Open the post file from `/marketing/to-post/linkedin/[founder]/`
2. Copy the post text
3. Paste into LinkedIn and post
4. Move file to `/marketing/posted/linkedin/[founder]/`

**Tip:** You can ask Claude to show you the post:
```
> Show me the posts ready to publish in /to-post/linkedin/[founder]/
```

---

### 5. Send Newsletter (Manual)

**When:** [Fill in your newsletter day] (or your newsletter day)

**Steps:**
1. Review content in `/marketing/to-review/newsletter/`
2. Copy content to your email platform
3. Send
4. Move file to `/marketing/posted/newsletter/`

---

### 6. Post to Community (Manual)

**When:** You have community discussion prompts ready

**Steps:**
1. Open post from `/marketing/to-review/community/`
2. Copy to your community platform
3. Move file to `/marketing/posted/community/`

---

## Current Posting Status

| Channel | Method | How It Works |
|---------|--------|--------------|
| **Blog** | Automated | `/publish-blog` pushes to website, hosting deploys |
| **LinkedIn** | Manual | Copy from `/to-post/`, paste to LinkedIn |
| **Newsletter** | Manual | Copy from `/to-review/`, paste to email platform |
| **Community** | Manual | Copy from `/to-review/`, paste to community platform |

**Future automation options:**
- Zapier can watch `/to-post/` folders and create drafts in Buffer/Typefully
- Newsletter could auto-draft via Zapier

---

## Folder Structure

```
/marketing
├── inputs/                 # Drop raw content here
│   ├── transcripts/       # Session transcripts to repurpose
│   ├── ideas/             # Rough ideas, voice notes
│   ├── brainstorming/     # Drafts, docs, content to reference
│   └── campaigns/         # Campaign briefs
│
├── to-review/             # Claude outputs land here
│   ├── linkedin/
│   │   ├── [founder-1]/
│   │   ├── [founder-2]/
│   │   ├── [founder-3]/
│   │   └── company/
│   ├── newsletter/
│   ├── community/
│   └── blog/
│
├── to-post/               # Approved, ready to publish
│   ├── linkedin/
│   │   └── [same structure]
│   ├── newsletter/
│   ├── community/
│   └── blog/              # Blog posts here trigger /publish-blog
│
└── posted/                # Archive of published content
    ├── linkedin/
    ├── newsletter/
    ├── community/
    └── blog/
```

---

## Available Commands

### Content Creation

| Command | What It Does |
|---------|--------------|
| `/generate-weekly-content` | Generate LinkedIn posts for the week |
| `/linkedin-post` | Quick single post |
| `/draft-newsletter` | Create newsletter draft |
| `/process-idea` | Turn rough idea into multi-channel content |

### Content Repurposing

| Command | What It Does |
|---------|--------------|
| `/process-transcript` | Transcript into posts, newsletter, quotes |
| `/repurpose-session` | Full session into complete content package |

### Publishing

| Command | What It Does |
|---------|--------------|
| `/publish-blog` | Push approved blog posts to website |

### Analysis

| Command | What It Does |
|---------|--------------|
| `/analyze-week` | Review metrics, get recommendations |

---

## Brand Quick Reference

### Voice
- [Fill in voice trait 1]
- [Fill in voice trait 2]
- [Fill in voice trait 3]

### Key Phrases
- "[Fill in key phrase 1]"
- "[Fill in key phrase 2]"
- "[Fill in key phrase 3]"

### Never Say
- [Fill in prohibited terms]

### Content Pillars
1. **[Pillar 1]** - [Brief description]
2. **[Pillar 2]** - [Brief description]
3. **[Pillar 3]** - [Brief description]
4. **[Pillar 4]** - [Brief description]
5. **[Pillar 5]** - [Brief description]

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Claude Code CLI | Content generation engine |
| VS Code | Editing and file management |
| GitHub | Website repo |
| [Fill in hosting] | Website hosting + auto-deploy |
| [Fill in community platform] | Community platform |
| LinkedIn | Primary social channel |
| [Fill in email platform] | Newsletter |

---

## Website Integration

Blog posts publish to the [Your Company] website:

- **Website repo:** [Fill in local path to website repo]
- **GitHub:** [Fill in GitHub repo URL]
- **Content folder:** `content/blog/` (JSON files)
- **Generated HTML:** `public/blog/` (static pages)
- **Live URL:** `[your-domain]/blog/`

The `/publish-blog` command handles the full flow from approved markdown to live webpage.

---

## Getting Help

In Claude Code:
```
> /help
> /review-project    # Get Claude to understand the full system
```

Questions about the system? Ask Claude:
```
> How does the blog publishing work?
> Show me what's in /to-review/
> What commands are available?
```

---

*Built with Claude Code to practice what we preach: using AI to augment our work.*

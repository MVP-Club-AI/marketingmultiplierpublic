# Approve Content

Move reviewed content from `/to-review/` to either `/to-post/` (manual posting) or `/posted/` (automated/already posted).

## Context

After content is generated and reviewed, it needs to move through the pipeline:
- **`/to-review/`** → Content waiting for human review
- **`/to-post/`** → Approved content that requires manual posting
- **`/posted/`** → Content that has been posted (or will be auto-posted via Zapier)

## Instructions

1. **List content awaiting review**: Show all files in `/marketing/to-review/` organized by channel

2. **Ask what to approve**: Ask user which files to approve:
   - All files for a topic (e.g., "approve all topic-slug content")
   - Specific channels (e.g., "just the LinkedIn post")
   - Individual files

3. **Ask destination for each channel**:

   | Channel | Destination | Notes |
   |---------|-------------| ------|
   | LinkedIn | `/to-post/` | Manual posting required |
   | Newsletter | `/to-post/` | Manual via email platform |
   | Community | `/to-post/` | Manual posting to [community platform] |
   | Blog | `/to-post/` | **Always** → then run `/publish-blog` to push to website |

   **Important:** Blog posts must go to `/to-post/blog/` first. The `/publish-blog` command reads from there, pushes to the website repo, and moves to `/posted/blog/` automatically.

4. **Move approved files**:
   - Move files to appropriate destination folder
   - Preserve the folder structure (e.g., `linkedin/[founder-1]/` stays together)
   - Keep the same filename

5. **Convert visual assets** (if SVG files present):
   - LinkedIn doesn't accept SVG—convert to PNG before posting
   - Run: `cd scripts && node svg-to-png.js path/to/visual.svg`
   - This creates a PNG file alongside the SVG

6. **Update file metadata** (if applicable):
   - Add `status: approved` or `status: posted` to frontmatter
   - Add `approved_date: YYYY-MM-DD`

## Workflow Examples

### Example 1: Approve all content for a topic
```
User: approve all the [topic name] content
Assistant:
Found 5 files for this topic:
- /to-review/linkedin/[founder-1]/2025-01-02_topic-slug.md
- /to-review/linkedin/[founder-1]/2025-01-02_topic-visual.svg
- /to-review/newsletter/2025-01-02_topic-slug.md
- /to-review/community/2025-01-02_topic-slug.md
- /to-review/blog/2025-01-02_topic-slug.md

Where should each go?
- LinkedIn: to-post (manual) or posted (automated)?
- Newsletter: to-post (manual) or posted (automated)?
- Community: to-post (manual) or posted (automated)?
- Blog: to-post (manual) or posted (automated)?
```

### Example 2: Approve specific file
```
User: move the linkedin post to to-post
Assistant: Moving /to-review/linkedin/[founder-1]/2025-01-02_topic-slug.md
         → /to-post/linkedin/[founder-1]/2025-01-02_topic-slug.md
Done.
```

### Example 3: Mark as already posted
```
User: I already posted the linkedin one manually, move it to posted
Assistant: Moving to /posted/linkedin/[founder-1]/2025-01-02_topic-slug.md
         Updated status to: posted
Done.
```

## Output

After moving files, provide summary:

```
CONTENT APPROVED

Moved to /to-post/ (manual posting needed):
- linkedin/[founder-1]/2025-01-02_topic-slug.md
- linkedin/[founder-1]/2025-01-02_topic-visual.svg
- newsletter/2025-01-02_topic-slug.md
- community/2025-01-02_topic-slug.md

Moved to /posted/ (automated/complete):
- blog/2025-01-02_topic-slug.md

Still in /to-review/:
- [none]
```

## Folder Structure Reference

```
/marketing/
├── to-review/          ← Generated content awaits review here
│   ├── linkedin/
│   │   ├── [founder-1]/
│   │   ├── [founder-2]/
│   │   ├── [founder-3]/
│   │   └── company/
│   ├── newsletter/
│   ├── community/
│   └── blog/
│
├── to-post/            ← Approved, needs manual posting
│   ├── linkedin/
│   │   ├── [founder-1]/
│   │   ├── [founder-2]/
│   │   ├── [founder-3]/
│   │   └── company/
│   ├── newsletter/
│   ├── community/
│   └── blog/
│
└── posted/             ← Posted (manual or automated)
    ├── linkedin/
    │   ├── [founder-1]/
    │   ├── [founder-2]/
    │   ├── [founder-3]/
    │   └── company/
    ├── newsletter/
    ├── community/
    └── blog/
```

## Quick Commands

- `approve all` - Move all content in /to-review/ (will ask destinations)
- `approve [topic]` - Move all content matching a topic slug
- `approve linkedin` - Move just LinkedIn content
- `list to-review` - Show what's waiting for review
- `list to-post` - Show what's ready to post

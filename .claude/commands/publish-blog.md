# Publish Blog

Publish approved blog posts from `/marketing/to-post/blog/` directly to the [Your Company] website.

## Trigger
User says: "publish blog", "push blog to website", "publish to prod", or similar

## Process

### Step 1: Check for approved blog posts
Look in `/marketing/to-post/blog/` for markdown files ready to publish.

If no files found, inform the user:
> "No blog posts found in `/marketing/to-post/blog/`. Move approved posts there first, or create a new blog post."

### Step 2: For each blog post, convert to JSON
Read the markdown file and extract:
- Frontmatter (title, slug, author, date, description, pillar)
- Body content (convert markdown to HTML)

Create JSON in this format:
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "author": "[Founder 1]",
  "date": "2025-01-02",
  "description": "Meta description for SEO",
  "pillar": "Content Pillar",
  "content": "<p>HTML content...</p>"
}
```

### Step 3: Write JSON to website repo
Save each post to:
`[PATH_TO_WEBSITE_REPO]\content\blog\{slug}.json`

### Step 4: Update the blog index
Read all JSON files in `content/blog/` and generate `index.json`:
```json
[
  {"slug": "post-slug", "title": "Title", "date": "2025-01-02", "author": "[Founder 1]", "description": "..."},
  ...
]
```
Sort by date (newest first).

### Step 5: Commit and push to production
Run these commands in the website repo directory:
```bash
cd "[PATH_TO_WEBSITE_REPO]"
git add content/blog/
git commit -m "Publish blog: {post titles}"
git push origin main
```

### Step 6: Move published posts to archive
Move the published markdown files from `/marketing/to-post/blog/` to `/marketing/posted/blog/` to track what's been published.

### Step 7: Log to content calendar
For each published post, append a row to `/marketing/calendar/content-log.csv`:

```
Date,Founder,Pillar,Topic,Channel,URL
```

Map from frontmatter:
- **Date**: `date` from frontmatter (YYYY-MM-DD)
- **Founder**: `author` from frontmatter
- **Pillar**: `pillar` from frontmatter (use the pillar number if available)
- **Topic**: `title` from frontmatter
- **Channel**: "Blog"
- **URL**: `https://www.[your-domain]/blog/{slug}/`

### Step 8: Confirm success
Tell the user:
> "Published {n} blog post(s) to production:
> - {title 1}
> - {title 2}
>
> Your hosting platform will auto-deploy. Posts will be live at [your-domain]/blog/{slug}"

## Markdown to HTML Conversion
When converting markdown body to HTML:
- Paragraphs: wrap in `<p>` tags
- Headers: `## Title` → `<h2>Title</h2>`
- Bold: `**text**` → `<strong>text</strong>`
- Italic: `*text*` → `<em>text</em>`
- Lists: convert to `<ul><li>` or `<ol><li>`
- Links: `[text](url)` → `<a href="url">text</a>`
- Line breaks: double newline = new paragraph

## Scheduling a Blog Post (GitHub Actions)

If the user wants to **schedule** a blog post for future publication instead of publishing immediately:

1. **Read the existing workflow file first:** Always read `.github/workflows/publish-blog-scheduled.yml` before making any changes. There may be other blog posts already scheduled.
2. **Add a new job — never replace the workflow.** Each scheduled post should be its own job (e.g., `publish-post-1`, `publish-post-2`) with its own cron trigger and `if` condition.
3. **Use descriptive job names** so it's clear which post each job publishes.
4. **Do not remove existing jobs** unless you have confirmed the post has already been published (check `/marketing/posted/blog/` and the content log).

## Error Handling
- If git push fails, show the error and suggest checking git credentials
- If no frontmatter found, skip that file and warn the user
- If slug is missing, generate from title (lowercase, hyphens)

## Example Usage

User: "publish the blog posts"

Assistant actions:
1. Reads `/marketing/to-post/blog/2025-01-02_topic-slug.md`
2. Converts to JSON
3. Writes to `[PATH_TO_WEBSITE_REPO]\content\blog\topic-slug.json`
4. Updates `index.json`
5. Commits and pushes
6. Moves original to `/marketing/posted/blog/`
7. Logs to `/marketing/calendar/content-log.csv`
8. Reports success

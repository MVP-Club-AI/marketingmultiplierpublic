#!/usr/bin/env python3
"""
Convert a markdown blog post to JSON and update the blog index.
Used by GitHub Actions for scheduled publishing.
"""

import json
import os
import re
import sys
from pathlib import Path
import markdown

def parse_frontmatter(content):
    """Extract frontmatter and body from markdown content."""
    lines = content.split('\n')
    frontmatter = {}
    body_start = 0

    # Check for YAML frontmatter (starts with ---)
    if lines[0].strip() == '---':
        # Find the closing ---
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == '---':
                body_start = i + 1
                break
            # Parse YAML-style key: value pairs
            if ':' in line:
                key, _, value = line.partition(':')
                key = key.strip().lower()
                value = value.strip().strip('"').strip("'")
                if key in ['title', 'author', 'date', 'description', 'pillar', 'slug', 'image']:
                    frontmatter[key] = value
    else:
        # Fallback: Look for title in first heading
        for i, line in enumerate(lines):
            if line.startswith('# '):
                frontmatter['title'] = line[2:].strip()
                body_start = i + 1
                break

        # Look for metadata patterns (legacy format)
        for i, line in enumerate(lines[body_start:], body_start):
            if line.startswith('**Meta Description:**'):
                frontmatter['description'] = line.replace('**Meta Description:**', '').strip()
            elif line.startswith('**Author:**'):
                frontmatter['author'] = line.replace('**Author:**', '').strip()
            elif line.startswith('**Date:**'):
                frontmatter['date'] = line.replace('**Date:**', '').strip()
            elif line.startswith('**Pillar:**'):
                frontmatter['pillar'] = line.replace('**Pillar:**', '').strip()
            elif line.startswith('---') and i > body_start + 1:
                body_start = i + 1
                break

    # Get body content (everything after frontmatter)
    body = '\n'.join(lines[body_start:]).strip()

    # Remove trailing metadata sections (Key Takeaways, Length, SEO Focus, etc.)
    body = re.sub(r'\n---\n\n\*\*Length:\*\*.*$', '', body, flags=re.DOTALL)
    body = re.sub(r'\n---\n\n## Key Takeaways.*$', '', body, flags=re.DOTALL)

    return frontmatter, body


def markdown_to_html(md_content):
    """Convert markdown to HTML."""
    md = markdown.Markdown(extensions=['extra'])
    return md.convert(md_content)


def generate_slug(title):
    """Generate URL slug from title."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def update_index(blog_dir):
    """Regenerate the blog index.json file."""
    blog_path = Path(blog_dir)
    posts = []

    for json_file in blog_path.glob('*.json'):
        if json_file.name == 'index.json':
            continue

        with open(json_file, 'r') as f:
            post = json.load(f)
            posts.append({
                'slug': json_file.stem,
                'title': post.get('title', ''),
                'date': post.get('date', ''),
                'author': post.get('author', ''),
                'description': post.get('description', '')
            })

    # Sort by date (newest first)
    posts.sort(key=lambda x: x.get('date', ''), reverse=True)

    index_path = blog_path / 'index.json'
    with open(index_path, 'w') as f:
        json.dump(posts, f, indent=2)

    print(f"Updated index with {len(posts)} posts")


def publish_blog(md_path, output_dir):
    """Convert markdown blog post to JSON and publish."""
    md_path = Path(md_path)
    output_dir = Path(output_dir)

    # Read markdown
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse frontmatter and body
    frontmatter, body = parse_frontmatter(content)

    # Get slug from frontmatter or generate from title
    title = frontmatter.get('title', md_path.stem)
    slug = frontmatter.get('slug') or generate_slug(title)

    # Convert body to HTML
    html_content = markdown_to_html(body)

    # Wrap content in centered div for images
    html_content = html_content.replace(
        '<img ',
        '<img style="max-width: 100%; height: auto;" '
    )

    # Create JSON
    post_json = {
        'title': title,
        'slug': slug,
        'author': frontmatter.get('author', '[Your Company]'),
        'date': frontmatter.get('date', ''),
        'description': frontmatter.get('description', ''),
        'pillar': frontmatter.get('pillar', ''),
        'content': html_content
    }

    # Write JSON
    output_path = output_dir / f"{slug}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(post_json, f, indent=2)

    print(f"Published: {output_path}")

    # Update index
    update_index(output_dir)

    return output_path


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: publish-blog.py <markdown_file> <output_dir>")
        sys.exit(1)

    publish_blog(sys.argv[1], sys.argv[2])

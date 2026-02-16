# Log Post Command

Log a published blog post or content piece to the content calendar system.

## Usage

Run this command after you've published a piece of content to track it in the system.

## What it does

1. Prompts you for post details (date, founder, pillar, topic, channel, URL)
2. Appends the entry to `/marketing/calendar/content-log.csv`
3. Confirms the post has been logged

## Instructions for Claude

When the user runs `/log-post`:

1. Use the AskUserQuestion tool to collect all information at once with these fields:
   - **Date**: Publication date (format: YYYY-MM-DD)
   - **Founder**: Who wrote it ([Founder 1], [Founder 2], or [Founder 3])
   - **Pillar**: Which content pillar (1-8, show the list)
   - **Topic**: Brief topic/title of the post
   - **Channel**: Where it was published (Blog, LinkedIn, Newsletter, etc.)
   - **URL**: Link to the post

2. Read the current content log: `/marketing/calendar/content-log.csv`

3. Append the new entry to the CSV file

4. Confirm to the user: "✅ Post logged: [Founder] - [Topic] ([Pillar name])"

## Content Pillars Reference

1. [Pillar 1: Name]
2. [Pillar 2: Name]
3. [Pillar 3: Name]
4. [Pillar 4: Name]
5. [Pillar 5: Name]
6. [Pillar 6: Name]
7. [Pillar 7: Name]
8. [Pillar 8: Name]

Full descriptions: `/marketing/calendar/content-pillars.md`

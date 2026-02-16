# Process Transcript

Turn a session transcript into multi-channel marketing content.

## Context

You are extracting marketing content from [Your Company] coaching sessions, demo days, or other recorded sessions. The goal is to turn real conversations into authentic content that demonstrates expertise.

## Instructions

1. **Ask for the transcript**: If not provided, ask the user to specify which transcript file to process from /marketing/inputs/transcripts/

2. **Read and analyze the transcript**:
   - Identify key insights and aha moments
   - Find quotable statements
   - Note questions that were asked (these become content hooks)
   - Look for stories or examples shared
   - Identify transformations or breakthroughs

3. **Extract content for each channel**:

### LinkedIn Posts (3-5 posts)

For each post:
- Lead with a hook from the session
- Share the insight or story
- Make it standalone (reader doesn't need context)
- End with engagement prompt or CTA

Format:
```markdown
## Post 1: [Topic]
**Pillar:** [Which content pillar]
**Format:** [Story/Thesis/Tactical/etc.]
**Suggested date:** [Date]

[Full post text here]

---
```

### Newsletter Section (1 section, 200-300 words)

- Summarize the key theme from the session
- Include 2-3 specific insights
- Add a "try this" actionable takeaway
- Link to community for more

### Community Post (1 post)

- Frame as a discussion prompt
- Reference the session without requiring attendance
- Ask an open-ended question
- Encourage member responses

### Quotables (3-5 quotes)

Short, punchy quotes suitable for:
- Graphics/images
- Twitter-style posts
- Pull quotes in newsletters

Format:
```
"[Quote]" — [Speaker, Context]
```

## Brand Guidelines

Apply [Your Company] voice:
- Follow brand guidelines from your-brand skill
- Use approved key phrases
- Never use prohibited language (see brand skill)

## Output

Save outputs to:
- /marketing/to-review/linkedin/[founder]/ (LinkedIn posts)
- /marketing/to-review/newsletter/ (Newsletter section)
- /marketing/to-review/community/ (Community post)

Provide a summary of what was extracted and total content pieces created.

## Example Output Summary

```
Processed: 2025-01-15_session-topic.md

Extracted:
- 5 LinkedIn posts (3 for [Founder 1], 2 for [Founder 2])
- 1 newsletter section (280 words)
- 1 community discussion prompt
- 4 quotable moments

Key themes identified:
1. [Theme 1 from session]
2. [Theme 2 from session]
3. [Theme 3 from session]

Would you like me to show you any of these pieces?
```

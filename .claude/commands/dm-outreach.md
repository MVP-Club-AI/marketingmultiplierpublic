# DM Outreach

Generate personalized DM templates for LinkedIn outreach.

## Context

Direct messages are high-converting but time-consuming. This command helps create personalized outreach that doesn't feel spammy.

## Instructions

1. **Understand the context**: Ask user for:
   - Who are you reaching out to? (engaged with post, warm connection, cold prospect)
   - What's the goal? (start conversation, invite to community, book call)
   - Any specific trigger? (they commented on X, we have Y in common)

2. **Generate templates** based on scenario:

### Scenario A: Someone engaged with your post

```
Hey [Name],

Thanks for the thoughtful comment on my post about [topic].

[Reference something specific they said]

Curious—[relevant question based on their comment]?

[Your name]
```

### Scenario B: Warm connection (2nd degree, mutual connections)

```
Hey [Name],

I noticed we're both connected to [mutual connection] and you're working on [their role/company].

[Relevant observation about their work or industry]

I've been thinking a lot about [relevant topic]—would love to hear your take sometime.

[Your name]
```

### Scenario C: Inviting to community

```
Hey [Name],

I've seen your posts about [topic]—really resonates with what we're building at [Your Company].

We're launching a community for [professionals like them] who are figuring out AI adoption through practice, not courses.

Live sessions twice a week, async support, and a group of people going through the same thing.

Thought you might be interested. Want me to send details?

[Your name]
```

### Scenario D: Booking a discovery call (B2B)

```
Hey [Name],

I noticed [company] is [relevant observation—hiring AI roles, talking about AI adoption, etc.].

We help teams like yours build actual AI capability—not through training, but through embedded coaching.

Most of our clients start with a quick pilot: 2-3 workflows, 4 weeks, measurable results.

Worth a 15-min conversation to see if there's a fit?

[Your name]
```

### Scenario E: Following up (no response)

```
Hey [Name],

Just floating this back up—no worries if the timing isn't right.

[Brief reminder of original message]

Let me know if you'd like to chat, or feel free to ignore if it's not relevant right now.

[Your name]
```

## DM Best Practices

**DO:**
- Keep it short (under 100 words ideal)
- Reference something specific about them
- Ask a question (invites response)
- Be genuinely curious, not pitchy
- Offer value before asking for anything

**DON'T:**
- Send walls of text
- Lead with your pitch
- Use generic templates that feel mass-sent
- Ask for too much upfront
- Follow up more than twice

## Personalization Hooks

Help user personalize by identifying:
- Something they posted recently
- A comment they made
- Their role/company changes
- Mutual connections
- Shared interests or experiences

## Output

Provide:
1. 2-3 template options for their scenario
2. Personalization suggestions
3. Follow-up message template
4. Best times to send (Tue-Thu, 9-11am or 2-4pm)

```
DM TEMPLATES CREATED

Scenario: [What they're doing]
Goal: [What they want to achieve]

TEMPLATE OPTIONS:

Option 1 (Casual):
[Template]

Option 2 (Direct):
[Template]

FOLLOW-UP (if no response in 3-5 days):
[Template]

PERSONALIZATION TIPS:
- [Specific suggestion]
- [Specific suggestion]

TIMING:
Best days: Tuesday-Thursday
Best times: 9-11am or 2-4pm their timezone
```

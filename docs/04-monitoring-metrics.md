# Monitoring & Metrics

## Overview

This document outlines how to track the effectiveness of [Your Company]'s marketing efforts and use data to improve content strategy.

---

## Metrics Hierarchy

### Tier 1: Business Outcomes (What Actually Matters)

| Metric | Target | Frequency | Source |
|--------|--------|-----------|--------|
| [Primary business metric] | [Fill in target] | Weekly | [Fill in source] |
| Monthly recurring revenue | [Fill in target] | Monthly | [Fill in source] |
| Discovery calls / demos | [Fill in target] | Weekly | Calendar |
| Contracts / deals closed | [Fill in target] | Monthly | CRM/Manual |

### Tier 2: Leading Indicators (Predicts Outcomes)

| Metric | Why It Matters | Frequency | Source |
|--------|----------------|-----------|--------|
| Email list size | Warm audience to convert | Weekly | Email tool |
| Email open rate | List health/engagement | Per send | Email tool |
| Email click rate | Content relevance | Per send | Email tool |
| Free to paid conversion | Offer effectiveness | Weekly | [Fill in source] |
| Call to close rate | Sales effectiveness | Monthly | Manual |

### Tier 3: Engagement (Content Performance)

| Metric | Why It Matters | Frequency | Source |
|--------|----------------|-----------|--------|
| LinkedIn impressions | Reach/visibility | Per post | LinkedIn |
| LinkedIn engagement rate | Content resonance | Per post | LinkedIn |
| Follower growth | Audience building | Weekly | LinkedIn |
| Post saves/shares | High-intent signals | Per post | LinkedIn |
| DMs received | Direct interest | Daily | LinkedIn |
| Community engagement | Member activation | Weekly | [Fill in platform] |

---

## Data Collection Methods

### LinkedIn Analytics

**Manual Collection (Free, 5 min/week):**
1. Go to LinkedIn -> Me -> Analytics
2. Note total impressions, engagement rate, follower change
3. For each post: impressions, reactions, comments, shares
4. Enter into tracking sheet

**Shield App (~$8/month):**
- Automatic tracking of all posts
- Better analytics than native
- Export to CSV
- Competitor tracking

**What to Track Per Post:**
| Field | Example |
|-------|---------|
| Date | 2025-01-15 |
| Founder | [Founder Name] |
| Topic | [Topic description] |
| Format | Story + insight |
| Hook | "First line of the post..." |
| Impressions | 2,400 |
| Reactions | 89 |
| Comments | 18 |
| Shares | 4 |
| Saves | 12 |
| Engagement Rate | 8.2% |
| DMs Received | 3 |
| Link Clicks | 12 |

### Email Metrics

**Automatic via Zapier:**
```
Trigger: Email campaign sent
Action: Add row to Google Sheet with:
- Campaign name
- Send date
- Recipients
- Open rate
- Click rate
- Unsubscribes
```

**What to Track:**
| Field | Target |
|-------|--------|
| Open rate | >40% |
| Click rate | >5% |
| Unsubscribe rate | <0.5% |
| List growth (weekly) | [Fill in target] |

### Community Platform

**Dashboard Metrics:**
- Total members
- New members (this week/month)
- Active members (DAU, WAU, MAU)
- Posts created
- Comments/reactions

**Collection Method:**
- Weekly screenshot or manual entry
- Zapier for new member tracking

### Attribution

**When someone signs up or books a call, capture:**
- How did you hear about us? (form field)
- UTM parameters on all links
- Which content drove the action (if trackable)

**UTM Structure:**
```
?utm_source=linkedin
&utm_medium=organic
&utm_campaign=[campaign-name]
&utm_content=[founder]-[topic]-post
```

---

## Tracking Infrastructure

### Google Sheet Structure

**Tab 1: Weekly Summary**
| Week | LinkedIn Impr | Eng Rate | New Followers | Email Subs | Open Rate | Community Members | MRR | Calls Booked |
|------|---------------|----------|---------------|------------|-----------|-------------------|-----|--------------|
| [Date] | [#] | [%] | [#] | [#] | [%] | [#] | [$] | [#] |

**Tab 2: Post Performance Log**
(Google Form responses automatically populate this)

| Date | Founder | Topic | Format | Hook | Impressions | Eng Rate | Comments | DMs | Link Clicks |
|------|---------|-------|--------|------|-------------|----------|----------|-----|-------------|

**Tab 3: Email Performance**
| Date | Campaign | Subject | Recipients | Opens | Open Rate | Clicks | Click Rate |
|------|----------|---------|------------|-------|-----------|--------|------------|

**Tab 4: Community Members**
| Date | Name | Email | Source | Status |
|------|------|-------|--------|--------|

**Tab 5: Conversions**
| Date | Name | Type | Source | Value | Notes |
|------|------|------|--------|-------|-------|

### Google Form for Post Logging

**Fields:**
1. Date (auto-filled)
2. Founder (dropdown: [Fill in your founder/author names])
3. Topic/Theme (text)
4. Format (dropdown: Story, Insight, Tactical, Question, List, Contrarian)
5. Hook/First Line (text)
6. Link to post (URL)
7. Impressions (number)
8. Reactions (number)
9. Comments (number)
10. Shares (number)
11. Saves (number)
12. DMs received (number)
13. Link clicks (number)
14. Notes (text)

**Usage:** Fill out 24-48 hours after posting (when metrics stabilize)

---

## Analysis Framework

### Weekly Analysis (via Claude Code)

**Command:** `/analyze-week`

**Inputs:**
- Weekly summary data
- Post performance log
- Previous week's analysis

**Outputs:**
1. **Top Performers:** Which posts worked and why
2. **Underperformers:** Which posts flopped and why
3. **Trends:** Patterns across topics, formats, timing
4. **Recommendations:** What to do more/less of next week
5. **Goal Progress:** How we're tracking toward targets

### Monthly Analysis

**Deeper questions:**
- Which content pillars perform best?
- Which founder's voice resonates most?
- What's our conversion rate from impression to follower to subscriber to member?
- Where are we losing people in the funnel?
- What objections keep coming up?

### Quarterly Review

**Strategic questions:**
- Are we attracting the right audience?
- Is our messaging resonating with ICP?
- Should we adjust our content pillars?
- What new channels should we explore?
- How is the sales pipeline developing?

---

## Benchmarks & Targets

### LinkedIn Benchmarks (B2B)

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Impressions/post | <500 | 500-2K | 2K-10K | 10K+ |
| Engagement rate | <2% | 2-4% | 4-8% | 8%+ |
| Follower growth/week | <10 | 10-50 | 50-100 | 100+ |
| DMs/week | 0 | 1-3 | 3-10 | 10+ |

### Email Benchmarks

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Open rate | <20% | 20-35% | 35-50% | 50%+ |
| Click rate | <1% | 1-3% | 3-7% | 7%+ |
| Unsubscribe rate | >1% | 0.5-1% | 0.2-0.5% | <0.2% |

### Community Benchmarks

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Monthly churn | >10% | 5-10% | 2-5% | <2% |
| DAU/MAU ratio | <5% | 5-15% | 15-30% | 30%+ |
| Member-generated content | <20% | 20-50% | 50-80% | 80%+ |

---

## Reporting Cadence

### Daily (2 min)
- Check LinkedIn notifications
- Note any notable DMs or comments
- No formal tracking needed

### Weekly (25 min)
| Task | Time |
|------|------|
| Update weekly summary sheet | 10 min |
| Log any unlogged posts | 5 min |
| Run `/analyze-week` | 5 min |
| Review recommendations | 5 min |

### Monthly (1 hour)
| Task | Time |
|------|------|
| Full funnel analysis | 30 min |
| Content pillar performance review | 15 min |
| Goal progress assessment | 15 min |

### Quarterly (2 hours)
- Strategic review
- Channel effectiveness
- Audience quality assessment
- Plan adjustments

---

## Zapier Automations

### 1. Email Metrics Tracking
```
Trigger: Email campaign sent (from your email platform)
Action: Wait 48 hours
Action: Get campaign stats
Action: Add row to Google Sheet "Email Performance"
```

### 2. New Community Member
```
Trigger: New member joins community platform
Action: Add row to Google Sheet "Community Members"
Action: (Optional) Send Slack notification
```

### 3. Weekly Reminder
```
Trigger: Every Sunday 6pm
Action: Send email "Time to update marketing metrics"
Action: Include link to tracking sheet
```

### 4. High Engagement Alert
```
Trigger: New row in Post Log sheet
Filter: Engagement rate > 8%
Action: Send Slack/email: "High performing post! Review for patterns."
```

---

## Using Data to Improve

### The Feedback Loop

```
Track Performance
      |
Analyze Patterns
      |
Generate Insights
      |
Adjust Strategy
      |
Create New Content
      |
(Repeat)
```

### What to Look For

**Content that works:**
- High impressions + high engagement = viral potential topic
- Lower impressions + high engagement = strong but niche topic
- High DMs = topic that prompts action
- High saves = valuable reference content

**Content that doesn't:**
- Low impressions + low engagement = wrong topic or format
- High impressions + low engagement = clickbait hook, weak content
- No DMs = not prompting action

### Adjustments to Make

**If impressions are low:**
- Experiment with hooks
- Try different posting times
- Engage more in comments before posting

**If engagement is low:**
- Make content more specific/actionable
- Ask questions to prompt comments
- Share more personal stories

**If conversions are low:**
- Clarify the offer
- Add more CTAs in content
- Improve landing page
- Address objections directly

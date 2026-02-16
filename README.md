# Marketing Multiplier

A complete marketing system that runs on Claude Code. Generate LinkedIn posts, newsletters, blog articles, and community content, all in your brand voice, using simple commands.

**You don't need to know how to code to use this.** You need Claude Code installed and the willingness to talk to it. Claude handles the technical work. You bring the ideas, the voice, and the judgment about what's good.

---

## What This System Does

You talk to Claude Code. Claude knows your brand, your voice, and your content strategy because you've taught it through config files in this repo. When you say `/linkedin-post`, Claude doesn't just generate a generic AI post. It writes in YOUR voice, aligned to YOUR content pillars, following YOUR brand rules.

Here's what a typical week looks like:

1. **Sunday:** You open your terminal, type `/generate-weekly-content`, and Claude drafts LinkedIn posts for the week for each team member
2. **Monday-Friday:** You review the drafts, tweak what needs tweaking (by telling Claude what to change), and post them
3. **When inspiration strikes:** You drop an idea into the `/inputs/` folder and run `/process-idea` to turn it into content across all your channels
4. **When you record something:** Drop the transcript in `/inputs/transcripts/` and run `/process-transcript` to get posts, newsletter content, and blog articles out of it

All content flows through a simple pipeline: **Draft > Review > Approve > Post**. You always have the final say.

---

## What You Need

### Claude Code

Claude Code is Anthropic's command-line tool for working with Claude. It runs in your terminal (the text-based interface on your computer). If you haven't used a terminal before, don't worry. You'll learn the basics fast, and Claude itself can help you when you get stuck.

**Install Claude Code:**

1. **Install Node.js** (version 18 or newer)
   - Go to https://nodejs.org and download the LTS version
   - Run the installer, accept all defaults

2. **Install Claude Code**
   - Open your terminal:
     - **Mac:** Open the app called "Terminal" (search for it in Spotlight)
     - **Windows:** Install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) first, then open the "Ubuntu" app
   - Type this and press Enter:
     ```
     npm install -g @anthropic-ai/claude-code
     ```

3. **Authenticate**
   - In your terminal, type `claude` and press Enter
   - Follow the prompts to log in with your Anthropic account
   - You'll need an Anthropic API key (get one at https://console.anthropic.com)

4. **Verify it works**
   - Type `claude` in your terminal
   - If you see a prompt where you can type to Claude, you're good

### This Repository

Download or clone this repo to your computer:

```
git clone https://github.com/YOUR-ORG/YOUR-REPO.git
cd YOUR-REPO
```

If you're not sure how to do this, open Claude Code and ask:
```
> Help me clone a GitHub repository to my computer
```

---

## Getting Started

### Step 1: Open the system in Claude Code

In your terminal, navigate to this folder and start Claude Code:

```
cd /path/to/this/folder
claude
```

You'll see a prompt where you can type to Claude. Claude can now see all the files in this system and understands how it works because of the `CLAUDE.md` file.

### Step 2: Customize it for your brand

The system comes with placeholder text everywhere it needs your specifics. Tell Claude:

```
> Help me set up this marketing system for my company.
  My company is called [name] and we [what you do].
```

Claude will walk you through filling in:
- Your brand voice and tone
- Your content pillars (the themes you write about)
- Your team members' voice profiles
- Your goals and key links

This updates the config files that teach Claude how to write for you. See `SETUP.md` for the full checklist.

### Step 3: Start creating content

Once your brand is configured, try your first command:

```
> /linkedin-post
```

Claude will ask you what you want to write about, then generate a post in your brand voice.

---

## What It Looks Like in Practice

Here are real examples of how you'd interact with the system:

### Example 1: Generating a LinkedIn post

```
You:  /linkedin-post

Claude: Who is this post for?
        1. [Founder 1]
        2. [Founder 2]
        3. [Founder 3]
        4. Company page

You:  1

Claude: What's the topic or idea for this post?

You:  I had a great conversation today with a client who finally
      got their team using AI daily after months of resistance.
      The breakthrough was making it about small wins, not big transformation.

Claude: [Generates a full LinkedIn post in Founder 1's voice,
        saves it to /marketing/to-review/linkedin/founder-1/]

You:  I like it but the opening is too generic. Make it start with
      the actual moment the client told me about the breakthrough.

Claude: [Revises the post and saves the updated version]

You:  Perfect. Move it to to-post.

Claude: [Moves the file to /marketing/to-post/linkedin/founder-1/]
```

### Example 2: Turning a meeting transcript into content

```
You:  /process-transcript

Claude: I'll look for transcripts in /marketing/inputs/transcripts/.
        I found: 2026-02-20_team-strategy-call.txt
        Should I process this one?

You:  Yes

Claude: [Reads the transcript, identifies key themes, and generates:]
        - 3 LinkedIn posts (one per founder voice)
        - 1 newsletter section
        - 1 blog post outline
        - 2 community discussion prompts

        All saved to /marketing/to-review/ in their respective folders.

        Here's a summary of what I created...

You:  The blog outline looks great. Flesh it out into a full post.

Claude: [Writes the full blog post and saves it]
```

### Example 3: Weekly content generation

```
You:  /generate-weekly-content This week let's focus on
      practical AI tips, we just launched a new feature
      and I want to show people how to use it

Claude: [Generates 3-5 LinkedIn posts per founder for the week,
        each aligned to your content pillars but focused on the
        practical AI tips theme. Saves everything to /to-review/]

        Here's what I created for this week:

        [Founder 1] - 4 posts
        - Monday: [title]
        - Tuesday: [title]
        - Thursday: [title]
        - Friday: [title]

        [Founder 2] - 3 posts
        ...
```

---

## The Content Pipeline

Every piece of content flows through the same stages:

```
 YOUR IDEAS          CLAUDE DRAFTS         YOU REVIEW          YOU PUBLISH
 ──────────    ->    ──────────────   ->   ──────────    ->    ───────────
 /inputs/            /to-review/            /to-post/           /posted/

 Drop ideas,         Claude generates       You approve,        Content is
 transcripts,        content using your     edit, or ask        published and
 brainstorming       brand voice and        Claude to revise    archived here
 docs here           content pillars
```

**You always review before anything goes out.** Claude drafts, you decide.

### The folders

| Folder | What's in it | What you do with it |
|--------|-------------|-------------------|
| `marketing/inputs/` | Your raw material: ideas, transcripts, brainstorming docs | Drop files here whenever you have something |
| `marketing/to-review/` | Claude's drafts, organized by channel | Read, give feedback, ask for revisions |
| `marketing/to-post/` | Approved content ready to publish | Copy-paste to LinkedIn, send newsletter, etc. |
| `marketing/posted/` | Archive of everything published | Reference for what's worked |

---

## Available Commands

These are the slash commands you can use in Claude Code. Type them at the prompt.

### Create Content

| Command | What it does |
|---------|-------------|
| `/generate-weekly-content` | Draft a full week of LinkedIn posts for all team members |
| `/linkedin-post` | Create a single LinkedIn post |
| `/draft-newsletter` | Draft your weekly newsletter |
| `/blog-post` | Write a blog article |
| `/process-idea` | Turn a rough idea into polished multi-channel content |

### Repurpose Content

| Command | What it does |
|---------|-------------|
| `/process-transcript` | Turn a meeting/podcast transcript into posts, articles, and more |
| `/repurpose-session` | Convert a full session recording into a complete content package |

### Manage Content

| Command | What it does |
|---------|-------------|
| `/approve-content` | Move reviewed content from to-review to to-post |
| `/publish-blog` | Push an approved blog post to your website |
| `/log-post` | Log a published post to your content tracking |

### Plan and Analyze

| Command | What it does |
|---------|-------------|
| `/campaign-brief` | Plan a new marketing campaign |
| `/dm-outreach` | Generate personalized outreach messages |
| `/analyze-week` | Review your content performance and get recommendations |
| `/content-review` | Get Claude's feedback on a piece of content |

---

## The Marketing UI (Optional)

This system includes a web-based interface you can run locally. It gives you a visual dashboard for chatting with Claude and seeing your content pipeline at a glance.

**To start it:**
```
> Help me start the Marketing UI
```

Or manually:
```bash
cd ui
npm install
npm run dev
```

Then open http://localhost:4000 in your browser.

The UI includes:
- **Chat tab:** Talk to Claude with all your brand context loaded
- **Pipeline tab:** See all content in to-review, to-post, and posted stages
- **Calendar tab:** Plan and track what's going out when
- **Newsletter tab:** Newsletter-specific workflow

The UI is optional. Everything it does, you can also do directly in Claude Code through the terminal.

---

## Making It Yours

This system is designed to grow with you. Here's how it evolves:

### Week 1: Get it running
- Fill in your brand basics (company name, what you do, your voice)
- Generate your first batch of content
- Get comfortable with the review-and-revise loop

### Week 2-4: Refine your voice
- The first drafts won't be perfect. That's expected.
- Every time you give Claude feedback ("too formal," "I'd never say it that way," "more concrete examples"), it gets better within that session
- Update your founder voice skills (`.claude/skills/`) with what you learn about what sounds right

### Month 2+: Expand and automate
- Add new content pillars as your strategy evolves
- Set up blog publishing to push directly to your website
- Configure newsletter sending via Gmail API
- Add new team members by duplicating the founder skill template
- Create custom commands for workflows specific to your business

### Ongoing: Let Claude help you improve the system

One of the most powerful things about this setup: **you can ask Claude to improve the system itself.** For example:

```
> The LinkedIn posts are too long. Update the linkedin-post command
  to aim for 150 words max.

> Add a new content pillar about customer success stories.
  Update the brand skill and content pillars doc.

> Create a new command that generates a LinkedIn carousel outline
  from a blog post.
```

Claude can edit its own config files, create new commands, and extend the system. You describe what you want, Claude builds it.

---

## How It's Organized

```
your-marketing-repo/
├── CLAUDE.md                    # The brain: tells Claude everything about your brand and system
├── SETUP.md                     # Step-by-step setup checklist
├── README.md                    # This file
│
├── .claude/
│   ├── commands/                # Slash commands (the /things you type)
│   └── skills/                  # Brand voice, visual brand, founder profiles
│
├── marketing/
│   ├── inputs/                  # Your raw material goes here
│   ├── to-review/               # Claude's drafts land here
│   ├── to-post/                 # Approved content ready to publish
│   ├── posted/                  # Archive of published content
│   ├── calendar/                # Content calendar and tracking
│   ├── templates/               # Reusable templates (newsletter HTML, etc.)
│   └── campaigns/               # Campaign planning
│
├── scripts/                     # Utility scripts (newsletter sending, blog publishing, etc.)
├── ui/                          # Optional web interface
└── docs/                        # Strategy docs and reference material
```

The most important file is `CLAUDE.md`. It's the instruction manual that teaches Claude about your brand, your pipeline, your workflow, and your rules. When you want to change how the system works, that's usually where you start.

---

## Tips for Non-Coders

**You don't need to understand the code.** But here are some things that help:

1. **Talk to Claude like a person.** "Make this more casual" works better than trying to use technical language you're not comfortable with.

2. **Ask Claude to explain things.** If you see a file you don't understand, ask: "What does this file do and should I change anything in it?"

3. **Don't be afraid to try things.** Git (the version control system) means you can always undo. If something breaks, tell Claude: "Something went wrong, help me fix it."

4. **The terminal is just a text conversation.** You type, the computer responds. Claude Code makes it a conversation with an AI that can also read and edit files.

5. **Start simple.** Use `/linkedin-post` a few times before trying the full weekly workflow. Get comfortable with the rhythm.

6. **Your feedback makes it better.** Every time you say "that doesn't sound like me" and explain why, you're training the system. Update your voice profiles with what you learn.

7. **Ask Claude to do the technical parts.** Need to set up the newsletter sender? Tell Claude: "Help me set up the newsletter sending script." Claude will walk you through it step by step.

---

## Getting Help

Inside Claude Code, you can always ask:

```
> What commands are available?
> How does the content pipeline work?
> Show me what's ready to post this week
> Help me set up [anything]
```

Claude has full context on this system. It's read the CLAUDE.md, the commands, the skills, and all the docs. Ask it anything about how things work.

For issues with Claude Code itself, see the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code).

---

*Built with Claude Code. The system practices what it preaches: using AI to multiply what you're capable of.*

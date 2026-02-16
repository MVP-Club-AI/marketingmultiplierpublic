# Marketing UI

A local web interface for the marketing system, powered by Claude Code.

## Features

- **Chat Interface**: Full terminal experience with Claude Code for content generation
- **Pipeline Management**: Move content between to-review, to-post, and posted stages
- **Session Tracking**: Group generated content into sessions by date
- **Newsletter Workflow**: Write reflections, add links, and send newsletters

## Quick Start

### Windows
Double-click `start.bat` or run:
```cmd
cd ui
npm install
npm run dev
```

### Mac/Linux
```bash
cd ui
chmod +x start.sh
./start.sh
```

Or manually:
```bash
cd ui
npm install
npm run dev
```

Then open http://localhost:3000

## Prerequisites

- **Node.js 18+** - Required for running the server
- **Claude Code CLI** - Must be installed and authenticated (`npm install -g @anthropic/claude-code` or similar)
- **Windows**: May need Visual Studio Build Tools for `node-pty` compilation

## Architecture

```
Browser (localhost:3000)
    ↕ WebSocket
Express Server (localhost:3001)
    ↕ PTY (node-pty)
Claude Code Process
    ↕ File System
/marketing/ folders
```

## File Structure

```
ui/
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── chat/          # Terminal, input, session list
│   │   ├── pipeline/      # Kanban view, content cards
│   │   └── newsletter/    # Newsletter workflow
│   └── lib/
│       └── types.ts       # TypeScript types
├── server/                 # Backend Express server
│   ├── services/
│   │   ├── claudeCode.ts  # PTY management
│   │   ├── sessions.ts    # Session persistence
│   │   └── fileWatcher.ts # Watch marketing folders
│   └── routes/
│       ├── sessions.ts
│       ├── pipeline.ts
│       └── newsletter.ts
├── data/                   # Local session data (gitignored)
├── start.bat              # Windows launcher
└── start.sh               # Mac/Linux launcher
```

## Configuration

### Sessions

Session data is stored in `data/sessions.json` (gitignored). Each user maintains their own session state.

### Brand Colors

The UI uses brand colors defined in `tailwind.config.js` (customize these for your brand):
- Navy: `#081f3f`
- Slate: `#15465b`
- Amber: `#d97706`
- Stone: `#faf5f0`

## Troubleshooting

### "node-pty" compilation errors

On Windows, you may need:
1. Visual Studio Build Tools
2. Python (for node-gyp)

Install with: `npm install --global windows-build-tools`

### Claude Code not starting

Ensure Claude Code is:
1. Installed globally
2. Authenticated (run `claude` in terminal first to verify)

### WebSocket connection failed

Check that port 3001 is not in use by another process.

## Development

```bash
# Run frontend only
npm run preview

# Run server only
npm run server

# Run both (default)
npm run dev
```

# Gita GraphRAG — Frontend

React + TypeScript + Vite frontend for the Bhagavad Gita GraphRAG AI system.

## Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server & bundler |
| CSS Modules | Scoped styling |
| Axios | HTTP client |
| react-markdown | Render markdown in responses |

## Quick Start

```bash
# Install dependencies
npm install

# Copy env
cp .env.example .env
# Edit VITE_API_BASE_URL to point at your backend

# Start dev server (proxies /api to localhost:8000)
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── Header.tsx            # Top bar with emotion badge + arch toggle
│   ├── ArchitecturePanel.tsx # Collapsible tech stack view
│   ├── WelcomeScreen.tsx     # Shown before first message
│   ├── MessageBubble.tsx     # User + assistant message rendering
│   ├── AgentPipeline.tsx     # Status bar while loading
│   ├── ChatInput.tsx         # Auto-resize textarea + send button
│   └── BackgroundOrbs.tsx    # Decorative ambient background
├── hooks/
│   └── useChat.ts            # All chat state management
├── services/
│   └── api.ts                # Axios client + streaming SSE
├── constants/
│   └── verses.ts             # Verse data + emotion metadata + prompts
├── types/
│   └── index.ts              # All TypeScript interfaces
├── styles/
│   └── global.css            # CSS variables, resets, animations
├── App.tsx                   # Root component
└── main.tsx                  # React entry point
```

## Build for Production

```bash
npm run build
# Output in dist/
```

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Gita GraphRAG
VITE_APP_VERSION=1.0.0
```

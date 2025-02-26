# agentc

A modern, open-source directory of AI agents built with Next.js 15, featuring a searchable and filterable interface to discover AI agents that can perform tasks autonomously.

## 🚀 Key Features

- 🔍 Search agents by name, description, or tags
- 🏷️ Filter agents by categories
- 🎥 Video demonstration support
- 🌓 Dark/Light mode
- 🎨 Modern, responsive UI
- ⚡ Server-side rendering
- 🤖 AI-powered content generation

## 🧠 AI Processing

The directory uses advanced AI services to automatically process and generate high-quality content:

1. **Website Data Extraction** (via Firecrawl)
   - Intelligent web scraping with structured output
   - Extracts name, description, and metadata
   - Identifies pricing model (free/paid/freemium)
   - Captures favicons and icons for avatars

2. **Video Analysis** (via OpenRouter/Gemini)
   - Processes YouTube video transcripts
   - Maps features to specific timestamps
   - Identifies target audience segments
   - Extracts key benefits and capabilities
   - Uses Gemini 2.0 Flash for fast processing

3. **Data Structuring**
   - Validates data through Zod schemas
   - Ensures consistent formatting
   - Maintains type safety
   - Organizes content for optimal search

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (SQLite)
- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod

## 🚦 Quick Start

1. **Prerequisites**
   - Node.js 18+
   - pnpm (recommended)
   - Turso database
   - Required API keys

2. **Setup**
   ```bash
   git clone https://github.com/noelrohi/agentc.git
   cd agentc
   pnpm install
   cp .env.example .env.local
   ```

3. **Run**
   ```bash
   pnpm db push
   pnpm dev
   ```

## 🎛️ Feature Flags

Control features via environment variables:
```env
EDIT_MODE=true  # Enable agent editing
NEW_MODE=true   # Enable new agent creation
```

## 📜 License
[MIT License](LICENSE.md)

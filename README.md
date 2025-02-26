# AI-Powered Directory

A directory of AI tools and agents with AI-powered search capabilities.

## Features

- **AI-Powered Search**: Convert natural language queries into SQL queries
- **Responsive UI**: Built with Next.js, Shadcn UI, and Tailwind CSS
- **Database**: Turso (SQLite) with Drizzle ORM

## AI Search

The application includes an advanced AI search feature that converts natural language queries into SQL queries. This allows users to search for items using everyday language instead of specific keywords.

### Example Queries

- "Show me all free tools"
- "Find new agents for writing"
- "Search for productivity tools with video demos"
- "What are the freemium options for content creation?"

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the required values:
   ```
   DATABASE_URL=libsql://your-turso-database.turso.io
   DATABASE_AUTH_TOKEN=your-turso-auth-token
   OPENROUTER_API_KEY=your-openrouter-api-key
   FIRECRAWL_API_KEY=your-firecrawl-api-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL`: Turso database URL
- `DATABASE_AUTH_TOKEN`: Turso database authentication token
- `OPENROUTER_API_KEY`: OpenRouter API key for AI search functionality
- `FIRECRAWL_API_KEY`: Firecrawl API key for web scraping (optional)
- `EDIT_MODE`: Enable editing mode (boolean)
- `NEW_MODE`: Enable new item creation mode (boolean)

## Tech Stack

- **Framework**: Next.js App Router
- **UI**: React, Shadcn UI, Tailwind CSS
- **Database**: Turso (SQLite)
- **ORM**: Drizzle
- **AI**: OpenRouter (Gemini)
- **TypeScript**: For type safety

## How AI Search Works

1. User enters a natural language query
2. The query is sent to the AI search API endpoint
3. The AI model converts the natural language query into SQL conditions
4. The SQL conditions are used to query the database
5. Results are returned to the user

The AI search feature falls back to client-side filtering if the API request fails.

## 🚀 Key Features

- 🔍 Search agents by name, description, or tags
- 🤖 AI-powered natural language search
- 🌐 Responsive design for all devices
- 🎯 Filter agents by category, pricing model, and more
- 🔄 Real-time updates with server actions
- 🎬 Video demos for agents
- 📊 Detailed agent profiles with features and benefits

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

# agentc.directory

[Website](https://agentc.directory) | [llms.txt](https://agentc.directory/llms.txt) | [Run locally](#getting-started)

agentc.directory is a comprehensive directory of AI tools and agents with AI-powered search capabilities.

## Features

- **AI-Powered Search**: Convert natural language queries into SQL queries.
- **Advanced Filtering**: Find tools by category, pricing, and more.
- **Responsive UI**: Built with Next.js, Shadcn UI, and Tailwind CSS.
- **Database**: Turso (SQLite) with Drizzle ORM for robust data storage.
- **Video Analysis**: Process YouTube video transcripts to extract key information.
- **Website Data Extraction**: Intelligent web scraping with structured output.
- **Real-time Updates**: Stay current with the latest AI tools and agents.
- **Detailed Profiles**: Comprehensive information about each tool.
- **Modern Design**: Clean, accessible interface for all devices.
- **Type Safety**: Built with TypeScript for robust code.
- **Feature Flagging**: Control features via environment variables.
- **Zero Client-side API Keys**: Security-first approach to API usage.
- **Privacy Friendly**: No unnecessary tracking or data collection.

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/agentc.git
   cd agentc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and fill in the required values:
   ```
   DATABASE_URL=libsql://your-turso-database.turso.io
   DATABASE_AUTH_TOKEN=your-turso-auth-token
   OPENROUTER_API_KEY=your-openrouter-api-key
   FIRECRAWL_API_KEY=your-firecrawl-api-key
   ```

4. Set up the database:
   ```bash
   pnpm db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: Shadcn UI, Radix UI
- **Styling**: Tailwind CSS
- **Database**: Turso (SQLite)
- **ORM**: Drizzle ORM
- **Forms**: React Hook Form + Zod
- **AI Integration**: OpenRouter (Gemini)
- **Web Scraping**: Firecrawl
- **Language**: TypeScript

## Environment Variables

- `DATABASE_URL`: Turso database URL
- `DATABASE_AUTH_TOKEN`: Turso database authentication token
- `OPENROUTER_API_KEY`: OpenRouter API key for AI search functionality
- `FIRECRAWL_API_KEY`: Firecrawl API key for web scraping (optional)
- `EDIT_MODE`: Enable editing mode (boolean)
- `NEW_MODE`: Enable new item creation mode (boolean)

## How AI Search Works

1. User enters a natural language query
2. The query is sent to the AI search API endpoint
3. The AI model converts the natural language query into SQL conditions
4. The SQL conditions are used to query the database
5. Results are returned to the user

The AI search feature falls back to client-side filtering if the API request fails.

## License

[MIT License](LICENSE)

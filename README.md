# agentc

A modern, open-source directory of AI agents built with Next.js 15, featuring a searchable and filterable interface to discover AI agents that can perform tasks autonomously.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (SQLite, powered by libSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Package Manager**: pnpm

## Features

- 🔍 Search agents by name, description, or tags
- 🏷️ Filter agents by categories
- 🎥 Video demonstration support
- 🌓 Dark/Light mode
- 🎨 Modern, responsive UI
- ⚡ Server-side rendering for optimal performance
- 🔐 Feature flags for controlled rollouts

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Turso database
- Required API keys (see Environment Variables)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/noelrohi/agentc.git
cd agentc
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the example environment file:
```bash
cp .env.example .env.local
```

4. Set up your environment variables in `.env.local`:
```env
DATABASE_URL=your_turso_database_url
DATABASE_AUTH_TOKEN=your_turso_auth_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Initialize the database:
```bash
pnpm db push
```

6. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Feature Flags

The application uses environment variables to control feature flags:

- `EDIT_MODE`: Enable/disable agent editing functionality
- `NEW_MODE`: Enable/disable creation of new agents

To enable these features, set them to `true` in your `.env.local` file:
```env
EDIT_MODE=true
NEW_MODE=true
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm ui` - Add new shadcn/ui components
- `pnpm fmt` - Format code using Biome
- `pnpm db` - Run Drizzle Kit commands

## License
[MIT License](LICENSE.md)

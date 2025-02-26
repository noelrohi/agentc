# AI Reprocessing Scripts

This directory contains scripts for batch processing data with AI.

## Reprocess Items Script

The `reprocess-items.ts` script allows you to reprocess existing items in the database with AI. It will:

1. Fetch items from the database based on your filters
2. Log each item's details
3. Process each item with AI using the same autofill functionality as the web form
4. Update the database with the new AI-generated data

### Prerequisites

Make sure you have the following installed:
- Node.js (v18+)
- tsx (included in devDependencies)

### Usage

#### Using npm script (recommended)


> **Note:** You must comment out the `import "server-only"` line in `src/lib/process-with-ai.ts` when running these scripts outside of the Next.js server context.

The easiest way to run the script is using the npm script which automatically loads environment variables from `.env.local`:
```bash
# Process all items
pnpm reprocess

# With additional arguments
pnpm reprocess --type=agent
pnpm reprocess --id=123
pnpm reprocess --dry-run
pnpm reprocess --start-id=20

# Multiple arguments
pnpm reprocess --type=agent --dry-run
pnpm reprocess --type=agent --start-id=20
```

#### Using tsx directly

You can also run the script directly with tsx:

```bash
# Process all items
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local

# Process only agents
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local --type=agent

# Process only tools
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local --type=tool

# Process a specific item by ID
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local --id=123

# Process items starting from ID 20
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local --start-id=20

# Dry run (logs items but doesn't process with AI or update database)
npx tsx -r dotenv/config src/scripts/reprocess-items.ts dotenv_config_path=.env.local --dry-run
```

### Options

- `--type=agent|tool`: Filter items by type
- `--id=<number>`: Process only a specific item by ID
- `--start-id=<number>`: Process items with ID greater than or equal to the specified value
- `--dry-run`: Run without making any changes to the database

### Example Output

```
Starting reprocessing with options: { type: 'agent', id: undefined, startId: 20, dryRun: false }
Found 10 items to process

----- Processing item: Claude (ID: 20) -----
URL: https://claude.ai
Video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Processing with AI...
AI processing complete!
Website data: {...}
Video features: 5
Video key benefits: 3
Video who is it for: 2
Updated item 20 in database

----- Processing item: ChatGPT (ID: 21) -----
...
```

### Troubleshooting

If you encounter errors:

1. Make sure your database is running and accessible
2. Check that the AI services are available
3. Verify that you have the necessary permissions to update items
4. Try running with `--dry-run` first to validate the items being processed 

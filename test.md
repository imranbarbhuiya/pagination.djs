
# Testing pagination.djs

This document outlines how to compile and test the pagination.djs library with the included test bot.

## Prerequisites

- Node.js v16.11.0 or higher
- Yarn package manager

## Setup

1. Install dependencies:
```bash
yarn --immutable
```

2. Build the library:
```bash
yarn build
```

## Testing with the Test Bot

1. Navigate to the test-bot directory:
```bash
cd test-bot
```

2. Create a `.env` file with your bot credentials:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

3. Start the test bot:
```bash
node index.js
```

## Testing the Pagination

Once the bot is running, you can test the pagination using the following slash command in your Discord server:

- `/test ephemeral:false` - Creates a public paginated message
- `/test ephemeral:true` - Creates an ephemeral (only visible to you) paginated message

The test command will create a paginated message with 5 pages, allowing you to:
- Navigate between pages using the buttons
- Test both ephemeral and non-ephemeral messages
- Verify that the pagination buttons work correctly

## Expected Behavior

- The pagination should show 5 pages with different content
- Navigation buttons should work properly
- Ephemeral flag should be respected when set
- Message flags should be properly handled

## Troubleshooting

If you encounter any issues:

1. Verify that your bot token and client ID are correct in the `.env` file
2. Ensure the bot has proper permissions in your Discord server
3. Check the console output for any error messages

## Development Testing

When making changes to the library:

1. Make your changes in the library code
2. Rebuild the library:
```bash
yarn build
```
3. Restart the test bot to apply changes
```bash
cd test-bot
node index.js
```

## Notes

- The test bot automatically registers its commands on startup
- Changes to the library require a rebuild and bot restart
- The bot uses the local version of the library from the `dist` directory
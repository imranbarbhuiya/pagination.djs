/* eslint-disable */
import { Client, Intents } from 'discord.js';
import { Pagination } from 'pagination.djs';

const client = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
	// client is ready
});

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand() && interaction.commandName === 'pagination') {
		const descriptions = ['This is a description.', 'This is a second description.'];

		const pagination = new Pagination(interaction);

		await pagination.setDescriptions(descriptions).render();
	}
});

// set your discord token in env with name `DISCORD_TOKEN`. See <https://discord.com/developers/applications> to get the token.
client.login(process.env.DISCORD_TOKEN);

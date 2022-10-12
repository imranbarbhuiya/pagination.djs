import { Client, IntentsBitField } from 'discord.js';
import { Pagination } from 'pagination.djs';

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds]
});

client.on('ready', () => {
	// client is ready
});

client.on('interactionCreate', async (interaction) => {
	if (interaction.isChatInputCommand() && interaction.commandName === 'pagination') {
		const descriptions = ['This is a description.', 'This is a second description.'];

		const pagination = new Pagination(interaction);

		await pagination.setDescriptions(descriptions).render();
	}
});

// use your discord token instead of 'TOKEN'. See <https://discord.com/developers/applications> to get the token.
void client.login('TOKEN');

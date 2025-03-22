require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, Collection, ApplicationCommandOptionType } = require('discord.js');
const { Pagination } = require('../dist');

// Create commands collection
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection();

// Define command data for registration
const commandData = [
	{
		name: 'test',
		description: 'Test pagination with ephemeral/non-ephemeral messages',
		options: [
			{
				name: 'ephemeral',
				description: 'Whether the response should be ephemeral',
				type: ApplicationCommandOptionType.Boolean,
				required: false
			}
		]
	}
];

// Define command execution logic separately
const commands = {
	test: async (interaction) => {
		const embeds = [];
		
		// Create test embeds
		for (let i = 0; i < 5; i++) {
			embeds.push(
				new EmbedBuilder()
					.setTitle(`Page ${i + 1}`)
					.setDescription(`This is test page ${i + 1}`)
			);
		}

		// Test both ephemeral and non-ephemeral responses
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
		
		const pagination = new Pagination(interaction, {
			ephemeral
		});

		pagination.setEmbeds(embeds);
		await pagination.render();
	}
};

// Set commands in collection
for (const command of commandData) {
	client.commands.set(command.name, {
		data: command,
		execute: commands[command.name]
	});
	console.log(`[Command Loaded]: ${command.name}`);
}

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);

	try {
		console.log('Started refreshing application (/) commands.');
		
		// Set the commands using Discord.js built-in method
		await client.application.commands.set(commandData);
		
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error('Error deploying commands:', error);
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error('Error executing command:', error);
		await interaction.reply({ 
			content: 'There was an error executing this command!', 
			ephemeral: true 
		}).catch(console.error);
	}
});

console.log(`PID: ${process.pid}`);
process.traceDeprecation = true;
client.login(process.env.DISCORD_TOKEN); 
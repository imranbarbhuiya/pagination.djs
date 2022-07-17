import type { Interaction, Message } from 'discord.js';

export const authorOrUser = (messageOrInteraction: Message | Interaction) =>
	'user' in messageOrInteraction ? messageOrInteraction.user : messageOrInteraction.author;

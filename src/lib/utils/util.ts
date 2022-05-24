import { Interaction, type Message } from 'discord.js';

export const authorOrUser = (messageOrInteraction: Message | Interaction) =>
	messageOrInteraction instanceof Interaction ? messageOrInteraction.user : messageOrInteraction.author;

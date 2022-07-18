import type { BaseInteraction, Message, User } from 'discord.js';

export const authorOrUser = (messageOrInteraction: Message | BaseInteraction): User =>
	'user' in messageOrInteraction ? messageOrInteraction.user : messageOrInteraction.author;

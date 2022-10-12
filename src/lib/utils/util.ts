import type { BaseInteraction, Message, User } from 'discord.js';

export const authorOrUser = (messageOrInteraction: BaseInteraction | Message): User =>
	'user' in messageOrInteraction ? messageOrInteraction.user : messageOrInteraction.author;

import type { MessageOptions } from 'discord.js';

export interface Payload extends Pick<MessageOptions, 'content' | 'embeds' | 'files' | 'components'> {
	fetchReply: true;
	ephemeral?: boolean;
}

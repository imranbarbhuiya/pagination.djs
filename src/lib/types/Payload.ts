import type { BaseMessageOptions, InteractionReplyOptions } from 'discord.js';

export type Payload = (BaseMessageOptions & InteractionReplyOptions) & {
	ephemeral?: boolean;
};

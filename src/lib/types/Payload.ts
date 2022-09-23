import type { BaseMessageOptions } from 'discord.js';

export type Payload = BaseMessageOptions & {
	ephemeral?: boolean;
};

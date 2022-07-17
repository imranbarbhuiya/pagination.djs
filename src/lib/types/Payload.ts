import type { MessageOptions } from 'discord.js';

export type Payload = Pick<MessageOptions, 'content' | 'embeds' | 'files' | 'components'>;

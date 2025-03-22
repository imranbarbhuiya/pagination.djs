import type { BaseMessageOptions, MessageFlags } from 'discord.js';

export interface Payload extends BaseMessageOptions {
    flags?: MessageFlags | number;
}

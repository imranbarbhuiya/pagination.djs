import { ButtonStyle } from 'discord.js';

import type { Options } from '../types';

/**
 * The default options for the paginator.
 */
export const defaultOptions: Options = {
	firstEmoji: '⏪',
	prevEmoji: '◀️',
	nextEmoji: '▶️',
	lastEmoji: '⏭',
	firstLabel: '',
	prevLabel: '',
	nextLabel: '',
	lastLabel: '',
	limit: 5,
	idle: 5 * 60 * 1_000,
	ephemeral: false,
	prevDescription: '',
	postDescription: '',
	attachments: [],
	contents: [],
	buttonStyle: ButtonStyle.Secondary,
	loop: false
};

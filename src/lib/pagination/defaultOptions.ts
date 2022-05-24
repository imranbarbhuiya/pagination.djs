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
	idle: 5 * 60 * 1000,
	ephemeral: false,
	prevDescription: '',
	postDescription: '',
	attachments: [],
	contents: [],
	buttonStyle: 'SECONDARY',
	loop: false
};

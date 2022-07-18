import type { ComponentEmojiResolvable } from 'discord.js';

/**
 * Emojis of the pagination buttons
 */
export interface EmojiOptions {
	/**
	 * The emoji to use for the first button.
	 * @default "⏮"
	 */
	firstEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the previous button.
	 * @default "◀️"
	 */
	prevEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the next button.
	 * @default "▶️"
	 */
	nextEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the last button.
	 * @default "⏭"
	 */
	lastEmoji: ComponentEmojiResolvable;
}

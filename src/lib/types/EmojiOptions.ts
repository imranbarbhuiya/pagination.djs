import type { ComponentEmojiResolvable } from 'discord.js';

/**
 * Emojis of the pagination buttons
 */
export interface EmojiOptions {
	/**
	 * The emoji to use for the first button.
	 *
	 * @defaultValue "⏮"
	 */
	firstEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the last button.
	 *
	 * @defaultValue "⏭"
	 */
	lastEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the next button.
	 *
	 * @defaultValue "▶️"
	 */
	nextEmoji: ComponentEmojiResolvable;
	/**
	 * The emoji to use for the previous button.
	 *
	 * @defaultValue "◀️"
	 */
	prevEmoji: ComponentEmojiResolvable;
}

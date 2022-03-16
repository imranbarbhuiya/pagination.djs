import { EmojiIdentifierResolvable } from 'discord.js';

/**
 * Emojis of the pagination buttons
 */
export interface EmojiOptions {
  /**
   * The emoji to use for the first button.
   * @default "⏮"
   */
  firstEmoji: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the previous button.
   * @default "◀️"
   */
  prevEmoji: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the next button.
   * @default "▶️"
   */
  nextEmoji: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the last button.
   * @default "⏭"
   */
  lastEmoji: EmojiIdentifierResolvable;
}

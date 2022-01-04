import { EmojiIdentifierResolvable } from "discord.js";

import { ButtonStyle } from "./ButtonStyle";

//TODO: add docs to describe interface

export interface ButtonOptions {
  /**
   * The emoji to use for the button.
   */
  emoji: EmojiIdentifierResolvable;
  /**
   * The text to show on the button.
   * @default ""
   */
  label: string;
  /**
   * The style of the button.
   * @default "SECONDARY"
   */
  style: ButtonStyle;
}

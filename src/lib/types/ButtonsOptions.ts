import { type APIButtonComponentWithCustomId, type ButtonStyle, type ComponentEmojiResolvable } from 'discord.js';

import type { ButtonBuilder } from 'discord.js';

/**
 * The style of the paginator buttons.
 */
export type PButtonStyle = Exclude<ButtonStyle, ButtonStyle.Link>;

/**
 * Pagination Button Options
 */
export interface ButtonOptions {
	/**
	 * The emoji to use for the button.
	 */
	emoji?: ComponentEmojiResolvable;
	/**
	 * The text to show on the button.
	 *
	 * @defaultValue ""
	 */
	label?: string;
	/**
	 * The style of the button.
	 *
	 * @defaultValue `PButtonStyle.Secondary`
	 */
	style: PButtonStyle;
}

/**
 * Pagination Buttons Options
 */
export interface ButtonsOptions {
	/**
	 * The first button of the pagination row
	 */
	first: ButtonOptions;
	/**
	 * The last button of the pagination row
	 */
	last: ButtonOptions;
	/**
	 * The next button of the pagination row
	 */
	next: ButtonOptions;
	/**
	 * The previous button of the pagination row
	 */
	prev: ButtonOptions;
}

export type PButtonBuilder = Omit<ButtonBuilder, 'data'> & {
	data: APIButtonComponentWithCustomId;
};

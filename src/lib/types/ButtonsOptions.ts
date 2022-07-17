import { ButtonBuilder, type APIButtonComponentWithCustomId, type ButtonStyle, type ComponentEmojiResolvable } from 'discord.js';

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
	emoji: ComponentEmojiResolvable;
	/**
	 * The text to show on the button.
	 * @default ""
	 */
	label: string;
	/**
	 * The style of the button.
	 * @default {PButtonStyle.Secondary}
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
	 * The previous button of the pagination row
	 */
	prev: ButtonOptions;
	/**
	 * The next button of the pagination row
	 */
	next: ButtonOptions;
	/**
	 * The last button of the pagination row
	 */
	last: ButtonOptions;
}

export type PButtonBuilder = Omit<ButtonBuilder, 'data'> & {
	data: APIButtonComponentWithCustomId;
};

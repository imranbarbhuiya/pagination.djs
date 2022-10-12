import type { PButtonStyle } from './ButtonsOptions';
import type { EmojiOptions } from './EmojiOptions';
import type { BaseMessageOptions } from 'discord.js';

export type PEmbeds = Required<BaseMessageOptions>['embeds'];
export type PAttachments = Required<BaseMessageOptions>['files'];

export enum ExtraRowPosition {
	Above,
	Below
}

/**
 * The options to customize the pagination.
 */
export interface Options extends EmojiOptions {
	/**
	 * The attachments to show with the paginated messages.
	 *
	 * @defaultValue []
	 */
	attachments: PAttachments;
	/**
	 * The style of the paginator buttons.
	 *
	 * @defaultValue "SECONDARY"
	 */
	buttonStyle: PButtonStyle;
	/**
	 * Contents if changing contents per page.
	 *
	 * @defaultValue []
	 */
	contents: string[];
	/**
	 * Whether the reply should be ephemeral.
	 *
	 * @defaultValue false
	 */
	ephemeral: boolean;
	/**
	 * The label for the first page button.
	 *
	 * @defaultValue ""
	 */
	firstLabel: string;
	/**
	 * The number of seconds before the paginator will close after inactivity.
	 *
	 * @defaultValue 5 minutes
	 */
	idle: number;
	/**
	 * The label for the last page button.
	 *
	 * @defaultValue ""
	 */
	lastLabel: string;
	/**
	 * The number of entries to show per page.
	 *
	 * @defaultValue 5
	 */
	limit: number;
	/**
	 * loop through the pages.
	 *
	 * @defaultValue false
	 */
	loop: boolean;
	/**
	 * The label for the next page button.
	 *
	 * @defaultValue ""
	 */
	nextLabel: string;

	/**
	 * The description to show after the paginated descriptions.
	 *
	 * @defaultValue ""
	 */
	postDescription: string;
	/**
	 * The description to show before the paginated descriptions.
	 *
	 * @defaultValue ""
	 */
	prevDescription: string;
	/**
	 * The label for the previous page button.
	 *
	 * @defaultValue ""
	 */
	prevLabel: string;
}

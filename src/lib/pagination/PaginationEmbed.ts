import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	normalizeArray,
	type APIEmbed,
	type APIEmbedField,
	type ButtonInteraction,
	type ComponentEmojiResolvable,
	type JSONEncodable,
	type MessageActionRowComponentBuilder,
	type RestOrArray
} from 'discord.js';
import {
	ExtraRowPosition,
	type ButtonsOptions,
	type EmojiOptions,
	type LabelOptions,
	type Options,
	type PAttachments,
	type Payload,
	type PButtonBuilder,
	type PButtonStyle,
	type PEmbeds
} from '../types';
import { defaultOptions } from './defaultOptions';

/**
 * The PaginationEmbed class.
 */
export abstract class PaginationEmbed extends EmbedBuilder {
	/**
	 * Pagination button infos.
	 * @readonly
	 * @default {
	 *  first: {
	 *    emoji: "⏮",
	 *    label: "",
	 *    style: ButtonStyle.Secondary,
	 *  },
	 *  prev: {
	 *    emoji: "◀️",
	 *    label: "",
	 *    style: ButtonStyle.Secondary,
	 *  },
	 *  next: {
	 *    emoji: "▶️",
	 *    label: "",
	 *    style: ButtonStyle.Secondary,
	 *  },
	 *  last: {
	 *    emoji: "⏭",
	 *    label: "",
	 *    style: ButtonStyle.Secondary,
	 *  },
	 * }
	 */
	public readonly buttonInfo: ButtonsOptions;

	/**
	 * The images to paginate through.
	 */
	public images: string[];

	/**
	 * The descriptions to paginate through.
	 */
	public descriptions: string[];

	/**
	 * The action rows of the final message.
	 */
	public actionRows: ActionRowBuilder<MessageActionRowComponentBuilder>[];

	/**
	 * The total number of entries.
	 */
	public totalEntry: number;

	/**
	 * The total number of pages.
	 */
	public totalPages: number;

	/**
	 * The current page number.
	 */
	public currentPage!: number;

	/**
	 * The limit of entries per page.
	 * @default 5
	 */
	public limit!: number;

	/**
	 * The idle time before closing.
	 * @default 5 minutes
	 */
	public idle!: number;

	/**
	 * Whether the reply should be ephemeral or not.
	 * @default false
	 */
	public ephemeral!: boolean;

	/**
	 * The description to show before the paginated descriptions.
	 * @default ""
	 */
	public prevDescription!: string;

	/**
	 * The description to show after the paginated descriptions.
	 * @default ""
	 */
	public postDescription!: string;

	/**
	 * Whether to loop through the pages or not.
	 * @default false
	 */
	public loop!: boolean;

	/**
	 * The embeds if paginating through embeds.
	 * @default []
	 */
	public embeds: PEmbeds;

	/**
	 * The attachments to show with the paginated messages.
	 * @default []
	 */
	public attachments!: PAttachments;

	/**
	 * Whether if paginating through embed's fields.
	 * @default false
	 */
	public fieldPaginate!: boolean;

	/**
	 * The pagination buttons.
	 */
	public buttons!: Record<string, PButtonBuilder>;

	/**
	 * Contents if changing contents per page.
	 * @default []
	 */
	private contents!: (string | null)[] | string | null;

	/**
	 * The payload of the final message.
	 * @readonly
	 * @private
	 */
	private readonly payload: Payload;

	/**
	 * Whether the footer is a custom footer or not.
	 * @private
	 */
	private customFooter: boolean;

	/**
	 * The main action row.
	 * @readonly
	 * @private
	 */
	private readonly mainActionRow: ActionRowBuilder<MessageActionRowComponentBuilder>;

	/**
	 * All the fields if paginating through fields.
	 */
	private rawFields: APIEmbedField[];

	/**
	 * The extra action rows to add, if any.
	 * @private
	 * @default []
	 */
	private extraRows: {
		rows: ActionRowBuilder<MessageActionRowComponentBuilder>[];
		position: ExtraRowPosition;
	}[];

	/**
	 * The raw footer text.
	 * @private
	 */
	private rawFooter!: string;

	/**
	 * Changed default buttons
	 * @private
	 */
	private changedButtons?: boolean;

	/**
	 * @param options
	 * @example
	 * ```javascript
	 * const pagination = new PaginationEmbed({
	 *  firstEmoji: "⏮",
	 *  prevEmoji: "◀️",
	 *  nextEmoji: "▶️",
	 *  lastEmoji: "⏭",
	 *  limit: 5,
	 *  idle: 5 * 60 * 1000,
	 *  ephemeral: false,
	 *  prevDescription: "",
	 *  postDescription: "",
	 *  attachments: [],
	 *  buttonStyle: ButtonStyle.Secondary,
	 *  loop: false,
	 * });
	 * ```
	 *
	 */
	public constructor(options: Partial<Options> = {}) {
		super();
		const mergedOptions = Object.assign({}, defaultOptions, options);
		this.buttonInfo = {
			first: {
				emoji: mergedOptions.firstEmoji,
				label: mergedOptions.firstLabel,
				style: mergedOptions.buttonStyle
			},
			prev: {
				emoji: mergedOptions.prevEmoji,
				label: mergedOptions.prevLabel,
				style: mergedOptions.buttonStyle
			},
			next: {
				emoji: mergedOptions.nextEmoji,
				label: mergedOptions.nextLabel,
				style: mergedOptions.buttonStyle
			},
			last: {
				emoji: mergedOptions.lastEmoji,
				label: mergedOptions.lastLabel,
				style: mergedOptions.buttonStyle
			}
		};
		this.images = [];
		this.descriptions = [];
		this.embeds = [];
		this.actionRows = [];
		this.payload = {};
		this.totalEntry = 0;
		this.totalPages = 0;
		this.currentPage = 1;
		this.customFooter = true;
		this.rawFields = [];
		this.mainActionRow = new ActionRowBuilder();
		this.extraRows = [];
		this.setOptions(mergedOptions);
	}

	public override addFields(...fields: RestOrArray<APIEmbedField>): this {
		this.rawFields.push(...normalizeArray(fields));
		return this;
	}

	public spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this {
		if (this.data.fields) this.data.fields.splice(index, deleteCount, ...fields);
		else this.data.fields = fields;
		return this;
	}

	public override setFields(...fields: RestOrArray<APIEmbedField>): this {
		this.rawFields = normalizeArray(fields);
		return this;
	}

	/**
	 * Sets the pagination options.
	 * @param options
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setOptions({
	 *    firstEmoji: "⏮",
	 *    prevEmoji: "◀️",
	 *    nextEmoji: "▶️",
	 *    lastEmoji: "⏭",
	 *    limit: 5,
	 *    idle: 5 * 60 * 1000,
	 *    ephemeral: false,
	 *    prevDescription: "",
	 *    postDescription: "",
	 *    attachments: [],
	 *    buttonStyle: ButtonStyle.Secondary,
	 *    loop: false,
	 *  });
	 * ```
	 *
	 */
	public setOptions(options: Partial<Options>): this {
		this.setEmojis({
			firstEmoji: options.firstEmoji,
			prevEmoji: options.prevEmoji,
			nextEmoji: options.nextEmoji,
			lastEmoji: options.lastEmoji
		});
		if (options.buttonStyle) this.setStyle(options.buttonStyle);
		this.setLabels({
			firstLabel: options.firstLabel,
			prevLabel: options.prevLabel,
			nextLabel: options.nextLabel,
			lastLabel: options.lastLabel
		});
		this.limit = options.limit ?? this.limit;
		this.idle = options.idle ?? this.idle;
		this.ephemeral = options.ephemeral ?? this.ephemeral;
		this.loop = options.loop ?? this.loop;
		this.prevDescription = typeof options.prevDescription === 'string' ? options.prevDescription : this.prevDescription;
		this.postDescription = typeof options.postDescription === 'string' ? options.postDescription : this.postDescription;
		this.attachments = options.attachments ?? this.attachments;
		this.contents = options.contents ?? this.contents;
		this.setButtons();
		return this;
	}

	/**
	 * Sets the pagination images.
	 * @param images
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setImages(["1st image", "2nd image", "3rd image"]);
	 * ```
	 *
	 */
	public setImages(...images: RestOrArray<string>): this {
		this.images = normalizeArray(images);
		return this;
	}

	/**
	 * Adds multiple pagination images.
	 * @param images
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setImages(["1st image", "2nd image", "3rd image"])
	 *  .addImages(["4st image", "5nd image", "6rd image"]);
	 * ```
	 *
	 */
	public addImages(...images: RestOrArray<string>): this {
		this.images.push(...normalizeArray(images));
		return this;
	}

	/**
	 * Sets the pagination descriptions.
	 * @param descriptions
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setDescriptions(["1st description", "2nd description", "3rd description"]);
	 * ```
	 *
	 */
	public setDescriptions(...descriptions: RestOrArray<string>): this {
		this.descriptions = normalizeArray(descriptions);
		return this;
	}

	/**
	 * Adds multiple pagination descriptions.
	 * @param descriptions
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setDescriptions(["1st description", "2nd description", "3rd description"])
	 *  .addDescriptions(["4st description", "5nd description", "6rd description"]);
	 * ```
	 *
	 */
	public addDescriptions(...descriptions: RestOrArray<string>): this {
		this.descriptions.push(...normalizeArray(descriptions));
		return this;
	}

	/**
	 * Sets the pagination embeds.
	 * Note: if you set this then all other pagination methods and embed methods will be ignored
	 * i.e., descriptions, images, fields, also the embed properties like title, footer and all
	 * @param embeds
	 * @param template A template function that will be called for each embed.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setEmbeds([new EmbedBuilder(), new EmbedBuilder(), new EmbedBuilder()]);
	 * ```
	 *
	 */
	public setEmbeds(embeds: PEmbeds, template?: (embed: EmbedBuilder, i: number, array: PEmbeds) => JSONEncodable<APIEmbed>): this {
		if (template) {
			embeds = embeds.map((e, index, array) => template(EmbedBuilder.from(e), index, array));
		}
		this.embeds = embeds;
		this.limit = 1;
		return this;
	}

	/**
	 * Adds multiple pagination embeds.
	 * @param embeds An array of {@link EmbedBuilder} or {@link EmbedBuilderOptions}
	 * @param template A template function that will be called for each embed.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setEmbeds([new EmbedBuilder(), new EmbedBuilder(), new EmbedBuilder()])
	 *  .addEmbeds([new EmbedBuilder(), new EmbedBuilder(), new EmbedBuilder()]);
	 * ```
	 *
	 */
	public addEmbeds(embeds: PEmbeds, template?: (embed: EmbedBuilder) => JSONEncodable<APIEmbed>): this {
		if (template) {
			embeds = embeds.map((e) => template(EmbedBuilder.from(e)));
		}
		this.embeds.push(...embeds);
		return this;
	}

	/**
	 * Paginates through fields.
	 * It will be ignored if you are not paginating through fields.
	 *
	 * @param paginate
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setFields([{
	 *    name: "Field 1",
	 *    value: "Field 1 value",
	 *  },
	 *  {
	 *    name: "Field 2",
	 *    value: "Field 2 value",
	 *  }])
	 *  .paginateFields();
	 * ```
	 *
	 */
	public paginateFields(paginate = true): this {
		this.fieldPaginate = paginate;
		return this;
	}

	/**
	 * Sets the idle time before closing for the pagination.
	 * @param idle
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setIdle(5 * 60 * 1000);
	 * ```
	 *
	 */
	public setIdle(idle: number): this {
		this.idle = idle;
		return this;
	}

	/**
	 * Set whether the pagination reply should be ephemeral or not.
	 * @param ephemeral
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setEphemeral(true);
	 * ```
	 *
	 */
	public setEphemeral(ephemeral = true): this {
		this.ephemeral = ephemeral;
		return this;
	}

	/**
	 * Sets the limit of entries per page for pagination.
	 * @param limit
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setLimit(5);
	 * ```
	 *
	 */
	public setLimit(limit: number): this {
		this.limit = limit;
		return this;
	}

	/**
	 * Sets a fixed prev description which will be shown in all pages before the paginated descriptions.
	 * It will be ignored if you are not paginating through descriptions.
	 * @param prevDescription
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setPrevDescription("role info");
	 * ```
	 *
	 */
	public setPrevDescription(prevDescription: string): this {
		this.prevDescription = prevDescription;
		return this;
	}

	/**
	 * Sets a fixed post description which will be shown in all pages after the paginated descriptions.
	 * It will be ignored if you are not paginating through descriptions.
	 * @param postDescription
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setPostDescription("role id: 123456789");
	 * ```
	 *
	 */
	public setPostDescription(postDescription: string): this {
		this.postDescription = postDescription;
		return this;
	}

	/**
	 * Sets the emojis for the buttons.
	 * @param emojiOptions
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setEmojis({
	 *    firstEmoji: ":first_emoji:",
	 *    prevEmoji: ":prev_emoji:",
	 *    nextEmoji: ":next_emoji:",
	 *    lastEmoji: ":last_emoji:"
	 *  });
	 * ```
	 *
	 */
	public setEmojis(emojiOptions: Partial<EmojiOptions>): this {
		this.buttonInfo.first.emoji = emojiOptions.firstEmoji ?? this.buttonInfo.first.emoji;
		this.buttonInfo.prev.emoji = emojiOptions.prevEmoji ?? this.buttonInfo.prev.emoji;
		this.buttonInfo.next.emoji = emojiOptions.nextEmoji ?? this.buttonInfo.next.emoji;
		this.buttonInfo.last.emoji = emojiOptions.lastEmoji ?? this.buttonInfo.last.emoji;
		return this;
	}

	/**
	 * Sets the labels for the buttons.
	 * @param labelOptions
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setLabels({
	 *    firstLabel: "first",
	 *    prevLabel: "prev",
	 *    nextLabel: "next",
	 *    lastLabel: "last"
	 *  });
	 * ```
	 *
	 */
	public setLabels(labelOptions: Partial<LabelOptions>): this {
		this.buttonInfo.first.label = labelOptions.firstLabel ?? this.buttonInfo.first.label;
		this.buttonInfo.prev.label = labelOptions.prevLabel ?? this.buttonInfo.prev.label;
		this.buttonInfo.next.label = labelOptions.nextLabel ?? this.buttonInfo.next.label;
		this.buttonInfo.last.label = labelOptions.lastLabel ?? this.buttonInfo.last.label;
		return this;
	}

	/**
	 * Sets the buttons' style.
	 * @param style
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setStyle(ButtonStyle.Secondary);
	 * ```
	 *
	 */
	public setStyle(style: PButtonStyle): this {
		this.buttonInfo.first.style = style;
		this.buttonInfo.prev.style = style;
		this.buttonInfo.next.style = style;
		this.buttonInfo.last.style = style;

		return this;
	}

	/**
	 * Customizes the styles of each button.
	 * @param options
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setButtonAppearance({
	 *    first: {
	 *      label: "First",
	 *      emoji: ":first_emoji:",
	 *      style: ButtonStyle.Secondary
	 *    }
	 *  });
	 * ```
	 *
	 */
	public setButtonAppearance(options: ButtonsOptions): this {
		const { first, prev, next, last } = options;
		this.buttonInfo.first.label = first.label ?? this.buttonInfo.first.label;
		this.buttonInfo.prev.label = prev.label ?? this.buttonInfo.prev.label;
		this.buttonInfo.next.label = next.label ?? this.buttonInfo.next.label;
		this.buttonInfo.last.label = last.label ?? this.buttonInfo.last.label;

		this.buttonInfo.first.emoji = first.emoji ?? this.buttonInfo.first.emoji;
		this.buttonInfo.prev.emoji = prev.emoji ?? this.buttonInfo.prev.emoji;
		this.buttonInfo.next.emoji = next.emoji ?? this.buttonInfo.next.emoji;
		this.buttonInfo.last.emoji = last.emoji ?? this.buttonInfo.last.emoji;

		this.buttonInfo.first.style = first.style ?? this.buttonInfo.first.style;
		this.buttonInfo.prev.style = prev.style ?? this.buttonInfo.prev.style;
		this.buttonInfo.next.style = next.style ?? this.buttonInfo.next.style;
		this.buttonInfo.last.style = last.style ?? this.buttonInfo.last.style;

		return this;
	}

	/**
	 * Set pagination buttons
	 * @param buttons
	 */

	public setButtons(buttons?: Record<string, ButtonBuilder>) {
		if (buttons) this.changedButtons = true;
		this.buttons = (buttons ?? {
			first: new ButtonBuilder().setCustomId('paginate-first'),
			prev: new ButtonBuilder().setCustomId('paginate-prev'),
			next: new ButtonBuilder().setCustomId('paginate-next'),
			last: new ButtonBuilder().setCustomId('paginate-last')
		}) as Record<string, PButtonBuilder>;
		return this;
	}

	/**
	 * Adds a custom action row below or above the pagination button action row.
	 * @param actionRows
	 * @param position
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .addActionRows([new ActionRowBuilder()], ExtraRowPosition.Below);
	 * ```
	 *
	 */
	public addActionRows(actionRows: ActionRowBuilder<MessageActionRowComponentBuilder>[], position = ExtraRowPosition.Below): this {
		this.extraRows.push({
			rows: actionRows,
			position
		});
		return this;
	}

	/**
	 * Sends an attachment along with the embed.
	 * @param attachments
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setAttachments([new AttachmentBuilder()]);
	 * ```
	 */
	public setAttachments(attachments: PAttachments): this {
		this.attachments = attachments;
		return this;
	}

	/**
	 * Adds an attachment to the existing attachments.
	 * @param attachment
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setAttachments([new AttachmentBuilder()])
	 *  .addAttachment(new AttachmentBuilder());
	 * ```
	 *
	 */
	public addAttachment(attachment: PAttachments[number]): this {
		this.attachments.push(attachment);
		return this;
	}

	/**
	 * Adds multiple attachments to the existing attachments.
	 * @param attachments
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setAttachments([new AttachmentBuilder()])
	 *  .addAttachments([new AttachmentBuilder(), new AttachmentBuilder()]);
	 * ```
	 *
	 */
	public addAttachments(attachments: PAttachments): this {
		this.attachments.push(...attachments);
		return this;
	}

	/**
	 * Triggers the pagination to go to a specific page.
	 * @param pageNumber
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setLimit(1)
	 *  .setDescriptions(["1st page", "2nd page", "3rd page", "4th page", "5th page"]);
	 * ...
	 * pagination.goToPage(2);
	 * ```
	 *
	 */
	public goToPage(pageNumber: number): this {
		if (pageNumber < 1) pageNumber = this.totalPages;
		if (pageNumber > this.totalPages) pageNumber = 1;
		this.currentPage = pageNumber;
		if (this.embeds.length) {
			const embed = this.embeds[this.currentPage - 1];
			this.payload.embeds = [EmbedBuilder.from(embed)];
			return this;
		}
		if (!this.data.footer) {
			this.customFooter = false;
			this.rawFooter = 'Pages: {pageNumber}/{totalPages}';
		} else if (this.customFooter && !this.rawFooter) {
			this.rawFooter = this.data.footer.text;
		}
		this.setFooter({
			text: this.rawFooter.replace(/{pageNumber}/g, `${pageNumber}`).replace(/{totalPages}/g, `${this.totalPages}`),
			iconURL: this.data.footer?.icon_url
		});
		if (this.images.length) {
			this.setImage(this.images[pageNumber - 1]);
		}
		this.payload.content = Array.isArray(this.contents) ? this.contents[this.currentPage - 1] ?? null : this.contents;
		if (this.descriptions.length) {
			this.setDescription(
				`${this.prevDescription}\n` +
					`${this.descriptions.slice(pageNumber * this.limit - this.limit, pageNumber * this.limit).join('\n')}\n${this.postDescription}`
			);
		}

		if (this.fieldPaginate) {
			super.setFields(this.rawFields.slice(pageNumber * this.limit - this.limit, pageNumber * this.limit));
		}

		this.payload.embeds = [this];

		return this;
	}

	/**
	 * Sends contents along with the embed.
	 * @param contents The contents to send.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setContents(["this is the first page", "this is the second page"]);
	 * ```
	 */
	public setContents(contents: (string | null)[] | string | null): this {
		this.contents = contents;
		return this;
	}

	/**
	 * Prepares the pagination.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.ready();
	 * ```
	 *
	 */
	public ready(): Payload {
		if (!this.fieldPaginate) {
			this.setFields(this.rawFields);
		}
		this.totalEntry =
			this.embeds.length || Math.max(this.descriptions.length, this.images.length, this.fieldPaginate ? this.rawFields.length : 0);
		this.totalPages = Math.ceil(this.totalEntry / this.limit);
		this._readyPayloads();
		this.goToPage(this.currentPage);
		return this.payload;
	}

	/**
	 * Goes to the first page.
	 * @param i
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.goFirst(i);
	 * ```
	 *
	 */
	protected async goFirst(i: ButtonInteraction) {
		this.currentPage = 1;
		if (!this.loop) {
			this.buttons.first.setDisabled();
			this.buttons.prev.setDisabled();
		}
		this.buttons.next.setDisabled(false);
		this.buttons.last.setDisabled(false);

		this.goToPage(1);

		await i.update(this.payload);
	}

	/**
	 * Goes to the previous page.
	 * @param i
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.goPrev(i);
	 * ```
	 *
	 */
	protected async goPrev(i: ButtonInteraction) {
		this.currentPage--;
		if (!this.loop) {
			this.buttons.first.setDisabled(this.currentPage === 1);
			this.buttons.prev.setDisabled(this.currentPage === 1);
		}
		this.buttons.next.setDisabled(false);
		this.buttons.last.setDisabled(false);
		this.goToPage(this.currentPage);
		await i.update(this.payload);
	}

	/**
	 * Goes to the next page.
	 * @param i
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.goNext(i);
	 * ```
	 *
	 */
	protected async goNext(i: ButtonInteraction) {
		this.currentPage++;
		this.buttons.prev.setDisabled(false);
		this.buttons.first.setDisabled(false);
		if (!this.loop) {
			this.buttons.next.setDisabled(this.currentPage === Math.ceil(this.totalEntry / this.limit));
			this.buttons.last.setDisabled(this.currentPage === Math.ceil(this.totalEntry / this.limit));
		}
		this.goToPage(this.currentPage);
		await i.update(this.payload);
	}

	/**
	 * Goes to the last page.
	 * @param i
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.goLast(i);
	 * ```
	 *
	 */
	protected async goLast(i: ButtonInteraction) {
		this.currentPage = Math.ceil(this.totalEntry / this.limit);
		this.buttons.prev.setDisabled(false);
		this.buttons.first.setDisabled(false);
		if (!this.loop) {
			this.buttons.next.setDisabled();
			this.buttons.last.setDisabled();
		}
		this.goToPage(this.currentPage);
		await i.update(this.payload);
	}

	private _readyButton(button: ButtonBuilder, label: string, emoji: ComponentEmojiResolvable, style: PButtonStyle): this {
		if (label) button.setLabel(label);
		if (emoji) button.setEmoji(emoji);
		button.setStyle(style);
		return this;
	}

	/**
	 * Prepare the message's action rows for pagination.
	 * @returns
	 * @private
	 */
	private _readyActionRows(): this {
		if (!this.changedButtons) {
			this._readyButton(this.buttons.first, this.buttonInfo.first.label, this.buttonInfo.first.emoji, this.buttonInfo.first.style);
			this._readyButton(this.buttons.prev, this.buttonInfo.prev.label, this.buttonInfo.prev.emoji, this.buttonInfo.prev.style);
			this._readyButton(this.buttons.next, this.buttonInfo.next.label, this.buttonInfo.next.emoji, this.buttonInfo.next.style);
			this._readyButton(this.buttons.last, this.buttonInfo.last.label, this.buttonInfo.last.emoji, this.buttonInfo.last.style);
		}
		this.buttons.first.setDisabled();
		this.buttons.prev.setDisabled();
		this.buttons.next.setDisabled();
		this.buttons.last.setDisabled();
		if (this.totalEntry > this.limit) {
			this.buttons.last.setDisabled(false);
			this.buttons.next.setDisabled(false);
		}
		if (this.loop && this.totalEntry > this.limit) {
			this.buttons.first.setDisabled(false);
			this.buttons.prev.setDisabled(false);
		}
		this.mainActionRow.setComponents(Object.values(this.buttons));
		this.actionRows = [this.mainActionRow];
		if (this.extraRows.length > 0) {
			this.extraRows.forEach((row) => {
				row.position === ExtraRowPosition.Above ? this.actionRows.unshift(...row.rows) : this.actionRows.push(...row.rows);
			});
		}
		return this;
	}

	/**
	 * Prepare the message's payload.
	 * @returns
	 * @private
	 */
	private _readyPayloads(): Payload {
		this._readyActionRows();
		this.payload.components = this.actionRows;
		this.payload.content = Array.isArray(this.contents) ? this.contents[0] ?? null : this.contents;
		const embed = this.embeds.length ? this.embeds[0] : this;
		this.payload.embeds = [EmbedBuilder.from(embed)];
		this.payload.files = this.attachments;
		return this.payload;
	}
}

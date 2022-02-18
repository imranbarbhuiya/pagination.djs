import {
  type ButtonInteraction,
  type EmbedField,
  type InteractionReplyOptions,
  MessageActionRow,
  type MessageAttachment,
  MessageEmbed,
  type MessageEmbedOptions,
} from "discord.js";
import { defaultOptions } from "./defaultOptions";
import type { Options } from "./Options";

type Embed = MessageEmbed | MessageEmbedOptions;

/**
 * The PaginationEmbed class.
 */
export class PaginationEmbed extends MessageEmbed {
  //#region public fields

  // /**
  //  * Pagination buttons
  //  * @readonly
  //  */
  public buttons!: Options["buttons"];

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
  public actionRows: MessageActionRow[];

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
  public embeds: Embed[];

  /**
   * The attachments to show with the paginated messages.
   * @default []
   */
  public attachments!: MessageAttachment[];

  /**
   * Contents if changing contents per page.
   * @default []
   */
  private contents!: (string | null)[] | string | null;

  /**
   * Whether if paginating through embed's fields.
   * @default false
   */
  public fieldPaginate!: boolean;

  //#end region

  //#region private fields

  /**
   * The payload of the final message.
   * @readonly
   * @private
   */
  private readonly payload: InteractionReplyOptions & { fetchReply: true };

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
  private readonly mainActionRow: MessageActionRow;

  /**
   * All the fields if paginating through fields.
   */
  private rawFields: EmbedField[];

  /**
   * The extra action rows to add, if any.
   * @private
   * @default []
   */
  private extraRows: {
    rows: MessageActionRow[];
    position: "above" | "below";
  }[];

  /**
   * The raw footer text.
   * @private
   */
  private rawFooter!: string;

  //#end region

  /**
   * @param options
   * @example
   * ```javascript
   * const pagination = new PaginationEmbed({
   *  limit: 5,
   *  idle: 5 * 60 * 1000,
   *  ephemeral: false,
   *  prevDescription: "",
   *  postDescription: "",
   *  attachments: [],
   *  loop: false,
   * });
   * ```
   *
   */
  constructor(options: Partial<Options> = {}) {
    super();
    const mergedOptions = Object.assign({}, defaultOptions, options);
    this.images = [];
    this.descriptions = [];
    this.embeds = [];
    this.actionRows = [];
    this.payload = { fetchReply: true };
    this.totalEntry = 0;
    this.totalPages = 0;
    this.currentPage = 1;
    this.customFooter = true;
    this.rawFields = [];
    this.mainActionRow = new MessageActionRow();
    this.extraRows = [];
    this.setOptions(mergedOptions);
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
   *    buttonStyle: "SECONDARY",
   *    loop: false,
   *  });
   * ```
   *
   */
  setOptions(options: Partial<Options>): this {
    this.limit = options.limit ?? this.limit;
    this.idle = options.idle ?? this.idle;
    this.ephemeral = options.ephemeral ?? this.ephemeral;
    this.loop = options.loop ?? this.loop;
    this.prevDescription =
      typeof options.prevDescription === "string"
        ? options.prevDescription
        : this.prevDescription;
    this.postDescription =
      typeof options.postDescription === "string"
        ? options.postDescription
        : this.postDescription;
    this.attachments = options.attachments ?? this.attachments;
    this.contents = options.contents ?? this.contents;
    if (options.buttons) this.setButtons(options.buttons);
    return this;
  }

  // #region buttons related

  /**
   * Sets the pagination buttons.
   * @param buttons
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setButtons({
   * first: new MessageButton().setEmoji("⏮").setCustomId("first"),
   * prev: new MessageButton().setEmoji("◀️").setCustomId("prev"),
   * next: new MessageButton().setEmoji("▶️").setCustomId("next"),
   * last: new MessageButton().setEmoji("⏭").setCustomId("last"),
   * });
   */

  public setButtons(buttons: Options["buttons"]) {
    this.buttons = buttons;
    return this;
  }

  // #region end buttons related

  //#region images related

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
  setImages(images: string[]): this {
    this.images = images;
    return this;
  }

  /**
   * Adds a pagination image.
   * @param image
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setImages(["1st image", "2nd image", "3rd image"])
   *  .addImage("4st image");
   * ```
   *
   */
  addImage(image: string): this {
    this.images.push(image);
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
  addImages(images: string[]): this {
    this.images.push(...images);
    return this;
  }

  //#end region

  //#region descriptions related

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
  setDescriptions(descriptions: string[]): this {
    this.descriptions = descriptions;
    return this;
  }

  /**
   * Adds a pagination description.
   * @param description
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setDescriptions(["1st description", "2nd description", "3rd description"])
   *  .addDescription("4st description");
   * ```
   *
   */
  addDescription(description: string): this {
    this.descriptions.push(description);
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
  addDescriptions(descriptions: string[]): this {
    this.descriptions.push(...descriptions);
    return this;
  }

  //#end region

  //#region embeds related

  /**
   * Sets the pagination embeds.
   * Note: if you set this then all other pagination methods and embed methods will be ignored
   * i.e., descriptions, images, fields, also the embed properties like title, footer and all
   * @param embeds An array of {@link MessageEmbed} or {@link MessageEmbedField}
   * @param template A template function that will be called for each embed.
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()]);
   * ```
   *
   */
  setEmbeds(
    embeds: Embed[],
    template?: (embed: MessageEmbed) => MessageEmbed
  ): this {
    if (template) {
      embeds = embeds.map((e) =>
        e instanceof MessageEmbed ? template(e) : template(new MessageEmbed(e))
      );
    }
    this.embeds = embeds;
    this.limit = 1;
    return this;
  }

  /**
   * Adds a pagination embed.
   * @param embed A {@link MessageEmbed} or {@link MessageEmbedField}
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()])
   *  .addEmbed(new MessageEmbed);
   * ```
   *
   */
  addEmbed(embed: Embed): this {
    this.embeds.push(embed);
    return this;
  }

  /**
   * Adds multiple pagination embeds.
   * @param embeds An array of {@link MessageEmbed} or {@link MessageEmbedOptions}
   * @param template A template function that will be called for each embed.
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()])
   *  .addEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()]);
   * ```
   *
   */
  addEmbeds(
    embeds: Embed[],
    template?: (embed: MessageEmbed) => MessageEmbed
  ): this {
    if (template) {
      embeds = embeds.map((e) =>
        e instanceof MessageEmbed ? template(e) : template(new MessageEmbed(e))
      );
    }
    this.embeds.push(...embeds);
    return this;
  }

  //#end region

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
  paginateFields(paginate = true): this {
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
  setIdle(idle: number): this {
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
  setEphemeral(ephemeral: boolean): this {
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
  setLimit(limit: number): this {
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
  setPrevDescription(prevDescription: string): this {
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
  setPostDescription(postDescription: string): this {
    this.postDescription = postDescription;
    return this;
  }

  //#end region

  /**
   * Adds a custom action row below or above the pagination button action row.
   * @param actionRows
   * @param position
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .addActionRows([new MessageActionRow()], "above");
   * ```
   *
   */
  addActionRows(
    actionRows: MessageActionRow[],
    position: "below" | "above" = "below"
  ): this {
    this.extraRows.push({
      rows: actionRows,
      position,
    });
    return this;
  }

  //#region attachments related

  /**
   * Sends an attachment along with the embed.
   * @param attachments
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setAttachments([new MessageAttachment()]);
   * ```
   */
  setAttachments(attachments: MessageAttachment[]): this {
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
   *  .setAttachments([new MessageAttachment()])
   *  .addAttachment(new MessageAttachment());
   * ```
   *
   */
  addAttachment(attachment: MessageAttachment): this {
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
   *  .setAttachments([new MessageAttachment()])
   *  .addAttachments([new MessageAttachment(), new MessageAttachment()]);
   * ```
   *
   */
  addAttachments(attachments: MessageAttachment[]): this {
    this.attachments.push(...attachments);
    return this;
  }
  // #end region

  //#region contents related

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
  setContents(contents: (string | null)[] | string | null): this {
    this.contents = contents;
    return this;
  }

  //#end region

  /**
   * Prepare the message's action rows for pagination.
   * @returns
   * @private
   */
  private _readyActionRows(): this {
    if (this.totalEntry <= this.limit) {
      this.buttons.first?.setDisabled(true);
      this.buttons.prev?.setDisabled(true);
      this.buttons.next?.setDisabled(true);
      this.buttons.last?.setDisabled(true);
    } else if (!this.loop) {
      this.buttons.first?.setDisabled(true);
      this.buttons.prev?.setDisabled(true);
    }
    this.mainActionRow.setComponents(...this.buttons);
    this.actionRows = [this.mainActionRow];
    if (this.extraRows.length > 0) {
      this.extraRows.forEach((row) => {
        row.position === "above"
          ? this.actionRows.unshift(...row.rows)
          : this.actionRows.push(...row.rows);
      });
    }
    return this;
  }

  /**
   * Prepare the message's payload.
   * @returns
   * @private
   */
  private _readyPayloads(): InteractionReplyOptions & { fetchReply: true } {
    this._readyActionRows();
    this.payload.components = this.actionRows;
    this.payload.content = Array.isArray(this.contents)
      ? this.contents[0] ?? null
      : this.contents;
    this.payload.embeds = [this.embeds.length ? this.embeds[0] : this];
    this.payload.files = this.attachments;
    return this.payload;
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
  goToPage(pageNumber: number): this {
    if (pageNumber < 1) pageNumber = this.totalPages;
    if (pageNumber > this.totalPages) pageNumber = 1;
    this.currentPage = pageNumber;
    if (this.embeds.length) {
      this.payload.embeds = [this.embeds[this.currentPage - 1]];
      return this;
    }
    if (!this.footer) {
      this.customFooter = false;
      this.rawFooter = "Pages: {pageNumber}/{totalPages}";
    } else if (this.customFooter && !this.rawFooter) {
      this.rawFooter = this.footer.text;
    }
    this.setFooter({
      text: this.rawFooter
        .replace(/{pageNumber}/g, `${pageNumber}`)
        .replace(/{totalPages}/g, `${this.totalPages}`),
      iconURL: this.footer?.iconURL,
    });
    if (this.images.length) {
      this.setImage(this.images[pageNumber - 1]);
    }
    this.payload.content = Array.isArray(this.contents)
      ? this.contents[this.currentPage - 1] ?? null
      : this.contents;
    if (this.descriptions.length) {
      this.setDescription(
        `${this.prevDescription}\n` +
          `${this.descriptions
            .slice(
              pageNumber * this.limit - this.limit,
              pageNumber * this.limit
            )
            .join("\n")}\n${this.postDescription}`
      );
    }

    if (this.fieldPaginate) {
      this.setFields(
        this.rawFields.slice(
          pageNumber * this.limit - this.limit,
          pageNumber * this.limit
        )
      );
    }
    return this;
  }

  /**
   * Goes to the first page.
   * @protected
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
  protected goFirst(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = 1;
    if (!this.loop) {
      this.buttons.first?.setDisabled(true);
      this.buttons.prev?.setDisabled(true);
    }
    this.buttons.next?.setDisabled(false);
    this.buttons.last?.setDisabled(false);

    this.goToPage(1);

    i.update(this.payload);
    return i;
  }

  /**
   * Goes to the previous page.
   * @protected
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
  protected goPrev(i: ButtonInteraction): ButtonInteraction {
    this.currentPage--;
    if (!this.loop) {
      this.buttons.first.setDisabled(this.currentPage === 1);
      this.buttons.prev.setDisabled(this.currentPage === 1);
    }
    this.buttons.next.setDisabled(false);
    this.buttons.last.setDisabled(false);
    this.goToPage(this.currentPage);
    i.update(this.payload);
    return i;
  }

  /**
   * Goes to the next page.
   * @protected
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
  protected goNext(i: ButtonInteraction): ButtonInteraction {
    this.currentPage++;
    this.buttons.prev.setDisabled(false);
    this.buttons.first.setDisabled(false);
    if (!this.loop) {
      this.buttons.next.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
      this.buttons.last.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
    }
    this.goToPage(this.currentPage);
    i.update(this.payload);
    return i;
  }

  /**
   * Goes to the last page.
   * @protected
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
  protected goLast(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = Math.ceil(this.totalEntry / this.limit);
    this.buttons.prev.setDisabled(false);
    this.buttons.first.setDisabled(false);
    if (!this.loop) {
      this.buttons.next.setDisabled(true);
      this.buttons.last.setDisabled(true);
    }
    this.goToPage(this.currentPage);
    i.update(this.payload);
    return i;
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
  ready(): InteractionReplyOptions & { fetchReply: true } {
    if (this.fieldPaginate) {
      this.rawFields = [];
      this.rawFields.push(...this.fields);
    }
    this.totalEntry =
      this.embeds.length ||
      Math.max(
        this.descriptions.length,
        this.images.length,
        this.fieldPaginate ? this.rawFields.length : 0
      );
    this.totalPages = Math.ceil(this.totalEntry / this.limit);
    const payloads = this._readyPayloads();
    this.goToPage(this.currentPage);
    return payloads;
  }
}

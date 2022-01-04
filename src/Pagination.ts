import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  EmbedField,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";

import {
  ButtonsOptions,
  ButtonStyle,
  EmojiOptions,
  LabelOptions,
  Options,
} from "./types";

export const defaultOptions = {
  firstEmoji: "⏪",
  prevEmoji: "◀️",
  nextEmoji: "▶️",
  lastEmoji: "⏭",
  firstLabel: "",
  prevLabel: "",
  nextLabel: "",
  lastLabel: "",
  limit: 5,
  idle: 5 * 60 * 1000,
  ephemeral: false,
  prevDescription: "",
  postDescription: "",
  attachments: [],
  buttonStyle: "SECONDARY",
  loop: false,
} as Options;

//TODO: add docs to describe class

export class Pagination extends MessageEmbed {
  /**
   * The interaction that the paginator is for.
   * @readonly
   */
  public readonly interaction:
    | CommandInteraction
    | MessageComponentInteraction
    | ContextMenuInteraction
    | Message;
  /**
   * pagination button infos
   * @readonly
   * @default {
   *  first: {
   *    emoji: "⏮",
   *    label: "",
   *    style: "SECONDARY",
   *  },
   *  prev: {
   *    emoji: "◀️",
   *    label: "",
   *    style: "SECONDARY",
   *  },
   *  next: {
   *    emoji: "▶️",
   *    label: "",
   *    style: "SECONDARY",
   *  },
   *  last: {
   *    emoji: "⏭",
   *    label: "",
   *    style: "SECONDARY",
   *  },
   * }
   */
  public readonly buttonInfo: ButtonsOptions;
  /**
   * the images to paginate through
   */
  public images: string[];
  /**
   * the descriptions to paginate through
   */
  public descriptions: string[];
  /**
   * the action rows of the final message
   */
  public actionRows: MessageActionRow[];
  /**
   * the payloads of the final message
   * @readonly
   * @private
   */
  private readonly payloads: InteractionReplyOptions & { fetchReply: true };
  /**
   * the total number of entries
   */
  public totalEntry: number;
  /**
   * total number of pages
   */
  public totalPages: number;
  /**
   * footer is a custom footer
   * @private
   */
  private customFooter: boolean;
  /**
   * main action row
   * @readonly
   * @private
   */
  private readonly mainActionRow: MessageActionRow;
  /**
   * per page entry limit
   * @default 5
   */
  public limit!: number;
  /**
   * idle time before closing
   * @default 5 minutes
   */
  public idle!: number;
  /**
   * whether the reply should be ephemeral
   * @default false
   */
  public ephemeral!: boolean;
  /**
   * the description to show before the paginated descriptions
   * @default ""
   */
  public prevDescription!: string;
  /**
   * the description to show after the paginated descriptions
   * @default ""
   */
  public postDescription!: string;
  /**
   * the attachments to show with the paginated messages
   * @default []
   */
  /**
   * loop through the pages
   * @default false
   */
  public loop!: boolean;
  /**
   * embeds if paginating through embeds
   * @default []
   */
  public embeds: MessageEmbed[];
  /**
   * send attachment with the message
   * @default []
   */
  public attachments!: MessageAttachment[];
  /**
   * current page number
   */
  public currentPage!: number;
  /**
   * paginate through fields
   * @default false
   */
  public fieldPaginate!: boolean;
  /**
   * all the fields if paginating through fields
   */
  private rawFields: EmbedField[];
  /**
   * All the authorized users who can use the pagination buttons
   */
  public authorizedUsers: string[];
  /**
   * pagination buttons
   * @private
   */
  private buttons!: {
    first: MessageButton;
    prev: MessageButton;
    next: MessageButton;
    last: MessageButton;
  };
  /**
   * Extra action rows
   * @private
   * @default []
   */
  private extraRows: {
    rows: MessageActionRow[];
    position: "above" | "below";
  }[];
  /**
   * raw footer text
   * @private
   */
  private rawFooter!: string;

  /**
   *
   * @param interaction
   * @param options
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction, {
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
   *  buttonStyle: "SECONDARY",
   *  loop: false,
   * });
   * ```
   *
   */
  constructor(
    interaction:
      | CommandInteraction
      | ContextMenuInteraction
      | MessageComponentInteraction
      | Message,
    options: Partial<Options> = {}
  ) {
    super();
    const mergedOptions = Object.assign({}, defaultOptions, options);
    this.interaction = interaction;
    this.buttonInfo = {
      first: {
        emoji: mergedOptions.firstEmoji,
        label: mergedOptions.firstLabel,
        style: mergedOptions.buttonStyle,
      },
      prev: {
        emoji: mergedOptions.prevEmoji,
        label: mergedOptions.prevLabel,
        style: mergedOptions.buttonStyle,
      },
      next: {
        emoji: mergedOptions.nextEmoji,
        label: mergedOptions.nextLabel,
        style: mergedOptions.buttonStyle,
      },
      last: {
        emoji: mergedOptions.lastEmoji,
        label: mergedOptions.lastLabel,
        style: mergedOptions.buttonStyle,
      },
    };
    this.images = [];
    this.descriptions = [];
    this.embeds = [];
    this.actionRows = [];
    this.payloads = { fetchReply: true };
    this.totalEntry = 0;
    this.totalPages = 0;
    this.customFooter = true;
    this.rawFields = [];
    this.authorizedUsers = [
      (interaction as CommandInteraction).user?.id ??
        (interaction as Message).author?.id,
    ];
    this.mainActionRow = new MessageActionRow();
    this.extraRows = [];
    this.setOptions(mergedOptions);
  }
  /**
   *
   * set pagination options
   * @param options
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   *  .setOptions({
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
   *  buttonStyle: "SECONDARY",
   *  loop: false,
   * });
   * ```
   *
   */
  setOptions(options: Partial<Options>): this {
    this.setEmojis({
      firstEmoji: options.firstEmoji,
      prevEmoji: options.prevEmoji,
      nextEmoji: options.nextEmoji,
      lastEmoji: options.lastEmoji,
    });
    if (options.buttonStyle) this.setStyle(options.buttonStyle);
    this.setLabels({
      firstLabel: options.firstLabel,
      prevLabel: options.prevLabel,
      nextLabel: options.nextLabel,
      lastLabel: options.lastLabel,
    });
    this.limit = options.limit || this.limit;
    this.idle = options.idle || this.idle;
    this.ephemeral = options.ephemeral || this.ephemeral;
    this.loop = options.loop || this.loop;
    this.prevDescription =
      typeof options.prevDescription === "string"
        ? options.prevDescription
        : this.prevDescription;
    this.postDescription =
      typeof options.postDescription === "string"
        ? options.postDescription
        : this.postDescription;
    this.attachments = options.attachments || this.attachments;
    this.currentPage = 1;
    return this;
  }
  /**
   *
   * set pagination images
   * @param images
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"]);
   * ```
   *
   */
  setImages(images: string[]): this {
    this.images = images;
    return this;
  }
  /**
   *
   * add a pagination images
   * @param image
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"])
   * .addImage("4st image");
   * ```
   *
   */
  addImage(image: string): this {
    this.images.push(image);
    return this;
  }
  /**
   *
   * add multiple pagination images
   * @param images
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"])
   * .addImages(["4st image", "5nd image", "6rd image"]);
   * ```
   *
   */
  addImages(images: string[]): this {
    this.images.push(...images);
    return this;
  }
  /**
   *
   * set pagination descriptions
   * @param descriptions
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"]);
   * ```
   *
   */
  setDescriptions(descriptions: string[]): this {
    this.descriptions = descriptions;
    return this;
  }
  /**
   *
   * add a pagination description
   * @param description
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"])
   * .addDescription("4st description");
   * ```
   *
   */
  addDescription(description: string): this {
    this.descriptions.push(description);
    return this;
  }
  /**
   *
   * add multiple pagination descriptions
   * @param descriptions
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"])
   * .addDescriptions(["4st description", "5nd description", "6rd description"]);
   * ```
   *
   */
  addDescriptions(descriptions: string[]): this {
    this.descriptions.push(...descriptions);
    return this;
  }
  /**
   *
   * set pagination embeds
   * Note: if you set this then all other pagination methods and embed methods will be ignored
   * i.e., descriptions, images, fields, also the embed properties like title, footer and all
   * @param embeds
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()]);
   * ```
   *
   */
  setEmbeds(embeds: MessageEmbed[]): this {
    this.embeds = embeds;
    this.limit = 1;
    return this;
  }
  /**
   *
   * add a pagination embed
   * @param embed
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()])
   * .addEmbed(new MessageEmbed);
   * ```
   *
   */
  addEmbed(embed: MessageEmbed): this {
    this.embeds.push(embed);
    return this;
  }
  /**
   *
   * add multiple pagination embeds
   * @param embeds
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()])
   * .addEmbeds([new MessageEmbed(), new MessageEmbed(), new MessageEmbed()])
   * ```
   *
   */
  addEmbeds(embeds: MessageEmbed[]): this {
    this.embeds.push(...embeds);
    return this;
  }
  /**
   *
   * paginate through fields
   * It will be ignored if you are not paginating through fields
   * @param paginate
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setFields([{
   * name: "Field 1",
   * value: "Field 1 value",
   * },
   * {
   * name: "Field 2",
   * value: "Field 2 value",
   * }])
   * .paginateFields(true);
   * ```
   *
   */
  paginateFields(paginate: boolean): this {
    this.fieldPaginate = paginate;
    return this;
  }
  /**
   *
   * set idle time for pagination
   * @param idle
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setIdle(5 * 60 * 1000)
   * ```
   *
   */
  setIdle(idle: number): this {
    this.idle = idle;
    return this;
  }
  /**
   *
   * set ephemeral for pagination
   * @param ephemeral
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setEphemeral(true)
   * ```
   *
   */
  setEphemeral(ephemeral: boolean): this {
    this.ephemeral = ephemeral;
    return this;
  }
  /**
   *
   * set per page limit for pagination
   * @param limit
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setLimit(5)
   * ```
   *
   */
  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }
  /**
   *
   * set a fixed prev descriptions which will be shown in all pages before the paginated descriptions
   * It will be ignored if you are not paginating through descriptions
   * @param prevDescription
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setPrevDescription("role info")
   * ```
   *
   */
  setPrevDescription(prevDescription: string): this {
    this.prevDescription = prevDescription;
    return this;
  }
  /**
   *
   * set a fixed post descriptions which will be shown in all pages after the paginated descriptions
   * It will be ignored if you are not paginating through descriptions
   * @param postDescription
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setPostDescription("role id: 123456789")
   * ```
   *
   */
  setPostDescription(postDescription: string): this {
    this.postDescription = postDescription;
    return this;
  }
  /**
   * Set authorized users who can use this pagination buttons.
   * Leave it a empty array to allow everyone to use this pagination.
   * @param authorizedUsers
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setAuthorizedUsers([userId1, userId2, userId3])
   * ```
   *
   */
  setAuthorizedUsers(authorizedUsers: string[]): this {
    this.authorizedUsers = authorizedUsers;
    return this;
  }
  /**
   * Add a authorized user who can use this pagination buttons.
   * @param authorizedUser
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .addAuthorizedUser(userId1)
   * ```
   *
   */
  addAuthorizedUser(authorizedUser: string): this {
    this.authorizedUsers.push(authorizedUser);
    return this;
  }
  /**
   * Add multiple authorized users who can use this pagination buttons.
   * @param authorizedUsers
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .addAuthorizedUsers([userId1, userId2, userId3])
   * ```
   *
   */
  addAuthorizedUsers(authorizedUsers: string[]): this {
    this.authorizedUsers.push(...authorizedUsers);
    return this;
  }
  /**
   *
   * change emoji for buttons
   * @param emojiOptions
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setEmojis({
   * firstEmoji: ":first_emoji:",
   * prevEmoji: ":prev_emoji:",
   * nextEmoji: ":next_emoji:",
   * lastEmoji: ":last_emoji:"
   * })
   * ```
   *
   */
  setEmojis(emojiOptions: Partial<EmojiOptions>): this {
    this.buttonInfo.first.emoji =
      emojiOptions.firstEmoji || this.buttonInfo.first.emoji;
    this.buttonInfo.prev.emoji =
      emojiOptions.prevEmoji || this.buttonInfo.prev.emoji;
    this.buttonInfo.next.emoji =
      emojiOptions.nextEmoji || this.buttonInfo.next.emoji;
    this.buttonInfo.last.emoji =
      emojiOptions.lastEmoji || this.buttonInfo.last.emoji;
    return this;
  }
  /**
   *
   * change label for buttons
   * @param labelOptions
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setLabels({
   * firstLabel: "first",
   * prevLabel: "prev",
   * nextLabel: "next",
   * lastLabel: "last"
   * })
   * ```
   *
   */
  setLabels(labelOptions: Partial<LabelOptions>): this {
    this.buttonInfo.first.label =
      labelOptions.firstLabel || this.buttonInfo.first.label;
    this.buttonInfo.prev.label =
      labelOptions.prevLabel || this.buttonInfo.prev.label;
    this.buttonInfo.next.label =
      labelOptions.nextLabel || this.buttonInfo.next.label;
    this.buttonInfo.last.label =
      labelOptions.lastLabel || this.buttonInfo.last.label;
    return this;
  }
  /**
   *
   * set button style
   * @param style
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setStyle("SECONDARY")
   * ```
   *
   */
  setStyle(style: ButtonStyle): this {
    this.buttonInfo.first.style = style;
    this.buttonInfo.prev.style = style;
    this.buttonInfo.next.style = style;
    this.buttonInfo.last.style = style;

    return this;
  }
  /**
   * customize button styles
   * @param buttonOptions
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setButtonAppearance({
   * first: {
   * label: "First",
   * emoji: ":first_emoji:",
   * style: "SECONDARY"
   * }})
   * ```
   *
   */
  setButtonAppearance(options: ButtonsOptions): this {
    const { first, prev, next, last } = options;
    this.buttonInfo.first.label = first?.label || this.buttonInfo.first.label;
    this.buttonInfo.prev.label = prev?.label || this.buttonInfo.prev.label;
    this.buttonInfo.next.label = next?.label || this.buttonInfo.next.label;
    this.buttonInfo.last.label = last?.label || this.buttonInfo.last.label;

    this.buttonInfo.first.emoji = first?.emoji || this.buttonInfo.first.emoji;
    this.buttonInfo.prev.emoji = prev?.emoji || this.buttonInfo.prev.emoji;
    this.buttonInfo.next.emoji = next?.emoji || this.buttonInfo.next.emoji;
    this.buttonInfo.last.emoji = last?.emoji || this.buttonInfo.last.emoji;

    this.buttonInfo.first.style = first?.style || this.buttonInfo.first.style;
    this.buttonInfo.prev.style = prev?.style || this.buttonInfo.prev.style;
    this.buttonInfo.next.style = next?.style || this.buttonInfo.next.style;
    this.buttonInfo.last.style = last?.style || this.buttonInfo.last.style;

    return this;
  }
  /**
   *
   * add a custom action row below or above the pagination button action row
   * @param actionRows
   * @param position
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .addActionRows([new MessageActionRow()], "above")
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
  /**
   *
   * send a attachment along with the embed
   * @param attachments
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
   * ```
   */
  setAttachments(attachments: MessageAttachment[]): this {
    this.attachments = attachments;
    return this;
  }
  /**
   *
   * add a attachment to the existing attachments
   * @param attachment
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
   * .addAttachment(new MessageAttachment())
   * ```
   *
   */
  addAttachment(attachment: MessageAttachment): this {
    this.attachments.push(attachment);
    return this;
  }
  /**
   *
   * add multiple attachments to the existing attachments
   * @param attachments
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
   * .addAttachments([new MessageAttachment(), new MessageAttachment()])
   * ```
   *
   */
  addAttachments(attachments: MessageAttachment[]): this {
    this.attachments.push(...attachments);
    return this;
  }
  /**
   * make the pagination action rows
   * @returns
   * @private
   */
  _readyActionRows(): this {
    this.buttons = {
      first: new MessageButton()
        .setCustomId("paginate-first")
        .setEmoji(this.buttonInfo.first.emoji)
        .setLabel(this.buttonInfo.first.label)
        .setStyle(this.buttonInfo.first.style),
      prev: new MessageButton()
        .setCustomId("paginate-prev")
        .setEmoji(this.buttonInfo.prev.emoji)
        .setLabel(this.buttonInfo.prev.label)
        .setStyle(this.buttonInfo.prev.style),
      next: new MessageButton()
        .setCustomId("paginate-next")
        .setEmoji(this.buttonInfo.next.emoji)
        .setLabel(this.buttonInfo.next.label)
        .setStyle(this.buttonInfo.next.style),
      last: new MessageButton()
        .setCustomId("paginate-last")
        .setEmoji(this.buttonInfo.last.emoji)
        .setLabel(this.buttonInfo.last.label)
        .setStyle(this.buttonInfo.last.style),
    };
    if (this.totalEntry <= this.limit) {
      this.buttons.first.setDisabled(true);
      this.buttons.prev.setDisabled(true);
      this.buttons.last.setDisabled(true);
      this.buttons.next.setDisabled(true);
    } else if (!this.loop) {
      this.buttons.first.setDisabled(true);
      this.buttons.prev.setDisabled(true);
    }
    this.mainActionRow.setComponents(
      this.buttons.first,
      this.buttons.prev,
      this.buttons.next,
      this.buttons.last
    );
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
   * ready message payloads
   * @returns
   * @private
   */
  _readyPayloads(): InteractionReplyOptions & { fetchReply: true } {
    this._readyActionRows();
    this.payloads.components = this.actionRows;
    this.payloads.files = this.attachments;
    this.payloads.embeds = [this.embeds.length ? this.embeds[0] : this];
    return this.payloads;
  }
  /**
   * go to a specific page
   * @param pageNumber
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * .setLimit(1)
   * .setDescriptions(["1st page", "2nd page", "3rd page", "4th page", "5th page"])
   * ...
   * pagination.goToPage(2)
   * ```
   *
   */
  goToPage(pageNumber: number): this {
    if (pageNumber < 1) pageNumber = this.totalPages;
    if (pageNumber > this.totalPages) pageNumber = 1;
    this.currentPage = pageNumber;
    if (this.embeds.length) {
      this.payloads.embeds = [this.embeds[this.currentPage - 1]];
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
    if (this.descriptions.length) {
      this.setDescription(
        `${this.prevDescription}\n
            ${this.descriptions
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
   *
   * go to the first page
   * @param i
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goFirst(i)
   * ```
   *
   */
  goFirst(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = 1;
    if (!this.loop) {
      this.buttons.first.setDisabled(true);
      this.buttons.prev.setDisabled(true);
    }
    this.buttons.next.setDisabled(false);
    this.buttons.last.setDisabled(false);

    this.goToPage(1);

    i.update(this.payloads);
    return i;
  }
  /**
   *
   * go to the previous page
   * @param i
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goPrev(i)
   * ```
   *
   */
  goPrev(i: ButtonInteraction): ButtonInteraction {
    this.currentPage--;
    if (!this.loop) {
      this.buttons.first.setDisabled(this.currentPage === 1);
      this.buttons.prev.setDisabled(this.currentPage === 1);
    }
    this.buttons.next.setDisabled(false);
    this.buttons.last.setDisabled(false);
    this.goToPage(this.currentPage);
    i.update(this.payloads);
    return i;
  }
  /**
   *
   * go to the next page
   * @param i
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goNext(i)
   * ```
   *
   */
  goNext(i: ButtonInteraction): ButtonInteraction {
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
    i.update(this.payloads);
    return i;
  }
  /**
   *
   * go to the last page
   * @param i
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goLast(i)
   * ```
   *
   */
  goLast(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = Math.ceil(this.totalEntry / this.limit);
    this.buttons.prev.setDisabled(false);
    this.buttons.first.setDisabled(false);
    if (!this.loop) {
      this.buttons.next.setDisabled(true);
      this.buttons.last.setDisabled(true);
    }
    this.goToPage(this.currentPage);
    i.update(this.payloads);
    return i;
  }
  /**
   *
   * make the pagination interactive
   * @param message
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.paginate(message)
   * ```
   *
   */
  paginate(message: Message): this {
    const collector = message.createMessageComponentCollector({
      idle: this.idle,
    });

    collector.on("collect", async (i) => {
      if (
        this.authorizedUsers.length &&
        !this.authorizedUsers.includes(i.user.id)
      )
        return i.deferUpdate();
      // here filter isn't used just to avoid the `interaction failed` error
      if (!i.isButton()) return;
      if (i.customId === "paginate-first") {
        this.goFirst(i);
      }
      if (i.customId === "paginate-prev") {
        this.goPrev(i);
      }
      if (i.customId === "paginate-next") {
        this.goNext(i);
      }
      if (i.customId === "paginate-last") {
        this.goLast(i);
      }
    });
    return this;
  }
  /**
   *
   * ready the pagination
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.ready()
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
  /**
   *
   * send the final message
   * by default it'll send as a reply to the message
   * but if the interaction is already replied or deferred then it'll editReply
   * if you want to send followup the use {@link followUp} instead
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.render()
   * ```
   *
   */
  async render(): Promise<Message> {
    if (
      (this.interaction as CommandInteraction).replied ||
      (this.interaction as CommandInteraction).deferred
    ) {
      return this.editReply();
    }
    return await this.reply();
  }
  /**
   *
   * reply the final message
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.reply()
   * ```
   *
   */
  async reply(): Promise<Message> {
    const payloads = this.ready();
    const message = (await (
      this.interaction as
        | CommandInteraction
        | MessageComponentInteraction
        | ContextMenuInteraction
    ).reply(payloads)) as Message;
    this.paginate(message);
    return message;
  }
  /**
   *
   * send reply as a followUp
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.followUp()
   * ```
   *
   */
  async followUp(): Promise<Message> {
    const payloads = this.ready();
    const message = (await (
      this.interaction as
        | CommandInteraction
        | MessageComponentInteraction
        | ContextMenuInteraction
    ).followUp(payloads)) as Message;
    this.paginate(message);
    return message;
  }
  /**
   *
   * edit the original reply with the final message
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.editReply()
   * ```
   *
   */
  async editReply(): Promise<Message> {
    const payloads = this.ready();
    const message = (await (
      this.interaction as
        | CommandInteraction
        | MessageComponentInteraction
        | ContextMenuInteraction
    ).editReply(payloads)) as Message;
    this.paginate(message);
    return message;
  }
  /**
   *
   * update to button interaction
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.update()
   * ```
   *
   */
  async update(): Promise<Message> {
    const payloads = this.ready();
    const message = (await (
      this.interaction as MessageComponentInteraction
    ).update(payloads)) as Message;
    this.paginate(message);
    return message;
  }
  /**
   *
   * send the final message in the interaction channel
   * @returns
   * @example
   * ```javascript
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.send()
   * ```
   *
   */
  async send(): Promise<Message> {
    const payloads = this.ready();
    const message = (await this.interaction.channel?.send(payloads)) ?? null;
    if (message) this.paginate(message);
    else {
      throw new Error("Channel is not cached");
    }
    return message;
  }
}

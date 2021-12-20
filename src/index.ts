import {
  ButtonInteraction,
  CommandInteraction,
  EmojiIdentifierResolvable,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";

const defaultOptions = {
  firstEmoji: "⏮",
  prevEmoji: "⬅️",
  nextEmoji: "➡️",
  lastEmoji: "⏭",
  limit: 5,
  idle: 5 * 60 * 1000,
  ephemeral: false,
  prevDescription: "",
  postDescription: "",
  attachments: [],
  buttonStyle: "SECONDARY",
} as Options;

export interface Options extends EmojiOptions {
  /**
   * The number of entries to show per page.
   * @default 5
   */
  limit?: number;
  /**
   * The number of seconds before the paginator will close after inactivity.
   * @default 5 minutes
   */
  idle?: number;
  /**
   * Whether the reply should be ephemeral.
   * @default false
   */
  ephemeral?: boolean;
  /**
   * The description to show before the paginated descriptions.
   * @default ""
   */
  prevDescription?: string;
  /**
   * The description to show after the paginated descriptions.
   * @default ""
   */
  postDescription?: string;
  /**
   * The attachments to show with the paginated messages.
   * @default []
   */
  attachments?: MessageAttachment[];
  /**
   * The style of the paginator buttons.
   * @default "SECONDARY"
   */
  buttonStyle?: ButtonStyle;
}

export interface EmojiOptions {
  /**
   * The emoji to use for the first button.
   * @default "⏮"
   */
  firstEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the previous button.
   * @default "⬅️"
   */
  prevEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the next button.
   * @default "➡️"
   */
  nextEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the last button.
   * @default "⏭"
   */
  lastEmoji?: EmojiIdentifierResolvable;
}

export interface ButtonOptions {
  emoji?: EmojiIdentifierResolvable;
  label?: string;
  style?: ButtonStyle;
}

export interface ButtonOptionsRequired {
  emoji: EmojiIdentifierResolvable;
  label: string;
  style: ButtonStyle;
}

export interface ButtonsOptions {
  first?: ButtonOptions;
  prev?: ButtonOptions;
  next?: ButtonOptions;
  last?: ButtonOptions;
}

export interface ButtonsOptionsRequired {
  first: ButtonOptionsRequired;
  prev: ButtonOptionsRequired;
  next: ButtonOptionsRequired;
  last: ButtonOptionsRequired;
}

export type ButtonStyle = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCESS";
class Pagination extends MessageEmbed {
  public readonly interaction: CommandInteraction | ButtonInteraction | Message;
  public images: string[];
  public descriptions: string[];
  public actionRows: MessageActionRow[];
  private readonly payloads: InteractionReplyOptions & { fetchReply: true };
  public totalEntry: number;
  public readonly buttonInfo: ButtonsOptionsRequired;
  public limit!: number;
  public idle!: number;
  public ephemeral!: boolean;
  public prevDescription!: string;
  public postDescription!: string;
  public attachments!: MessageAttachment[];
  public currentPage!: number;
  private customFooter: boolean;
  public fieldPaginate!: boolean;
  public buttons!: {
    first: MessageButton;
    prev: MessageButton;
    next: MessageButton;
    last: MessageButton;
  };
  private readonly mainActionRow: MessageActionRow;
  public rawFooter!: string;

  /**
   *
   * @param interaction
   * @param options
   * @example
   * const pagination = new Pagination(interaction, {
   *  firstEmoji: "⏮",
   * prevEmoji: "⬅️",
   * nextEmoji: "➡️",
   * lastEmoji: "⏭",
   * limit: 5,
   * idle: 5 * 60 * 1000,
   * ephemeral: false,
   * prevDescription: "",
   * postDescription: "",
   * attachments: [],
   * buttonStyle: "SECONDARY",
   * });
   */

  constructor(
    interaction: CommandInteraction | ButtonInteraction | Message,
    options: Options = {}
  ) {
    super();
    options = Object.assign({}, defaultOptions, options);
    /**
     * The interaction that the paginator is for.
     * @readonly
     */
    this.interaction = interaction;
    /**
     * pagination button infos
     * @readonly
     */
    this.buttonInfo = {
      first: {
        emoji: options.firstEmoji || "⏮",
        label: "",
        style: "SECONDARY",
      },
      prev: {
        emoji: options.prevEmoji || "⬅️",
        label: "",
        style: "SECONDARY",
      },
      next: {
        emoji: options.nextEmoji || "➡️",
        label: "",
        style: "SECONDARY",
      },
      last: {
        emoji: options.lastEmoji || "⏭",
        label: "",
        style: "SECONDARY",
      },
    };
    /**
     * the images to paginate through
     */
    this.images = [];
    /**
     * the descriptions to paginate through
     */
    this.descriptions = [];
    /**
     * the action rows of the final message
     */
    this.actionRows = [];
    /**
     * the payloads of the final message
     * @readonly
     * @private
     */
    this.payloads = { fetchReply: true };
    /**
     * the total number of entries
     */
    this.totalEntry = 0;
    /**
     * footer is a custom footer
     * @private
     */
    this.customFooter = true;
    /**
     * main action row
     * @readonly
     * @private
     */
    this.mainActionRow = new MessageActionRow();
    this.setOptions(options);
  }
  /**
   *
   * set pagination options
   * @param options
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   *  .setOptions({
   * firstEmoji: "⏮",
   * prevEmoji: "⬅️",
   * nextEmoji: "➡️",
   * lastEmoji: "⏭",
   * limit: 5,
   * idle: 5 * 60 * 1000,
   * ephemeral: false,
   * prevDescription: "",
   * postDescription: "",
   * attachments: [],
   * buttonStyle: "SECONDARY",
   * });
   */
  setOptions(options: Options): this {
    this.setEmojis({
      firstEmoji: options.firstEmoji,
      prevEmoji: options.prevEmoji,
      nextEmoji: options.nextEmoji,
      lastEmoji: options.lastEmoji,
    });
    this.setButtonAppearance(options.buttonStyle);
    this.limit = options.limit || this.limit;
    this.idle = options.idle || this.idle;
    this.ephemeral = options.ephemeral || this.ephemeral;
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
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"]);
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
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"])
   * .addImage("4st image");
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
   * const pagination = new Pagination(interaction)
   * .setImages(["1st image", "2nd image", "3rd image"])
   * .addImages(["4st image", "5nd image", "6rd image"]);
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
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"]);
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
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"])
   * .addDescription("4st description");
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
   * const pagination = new Pagination(interaction)
   * .setDescriptions(["1st description", "2nd description", "3rd description"])
   * .addDescriptions(["4st description", "5nd description", "6rd description"]);
   */
  addDescriptions(descriptions: string[]): this {
    this.descriptions.push(...descriptions);
    return this;
  }
  /**
   *
   * paginate through fields
   * @param paginate
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setFields([{
   * name: "Field 1",
   * value: "Field 1 value",
   * },
   * {
   * name: "Field 2",
   * value: "Field 2 value",
   * }])
   *.paginateFields(true);
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
   * const pagination = new Pagination(interaction)
   * .setIdle(5 * 60 * 1000)
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
   * const pagination = new Pagination(interaction)
   * .setEphemeral(true)
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
   * const pagination = new Pagination(interaction)
   * .setLimit(5)
   */
  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }
  /**
   *
   * set a fixed prev descriptions which will be shown in all pages before the paginated descriptions
   * @param prevDescription
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setPrevDescription("role info")
   */
  setPrevDescription(prevDescription: string): this {
    this.prevDescription = prevDescription;
    return this;
  }
  /**
   *
   * set a fixed post descriptions which will be shown in all pages after the paginated descriptions
   * @param postDescription
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setPostDescription("role id: 123456789")
   */
  setPostDescription(postDescription: string): this {
    this.postDescription = postDescription;
    return this;
  }
  /**
   *
   * change default emoji for buttons
   * @param emojiOptions
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setEmojis({
   * firstEmoji: ":first_emoji:",
   * prevEmoji: ":prev_emoji:",
   * nextEmoji: ":next_emoji:",
   * lastEmoji: ":last_emoji:"
   * })
   */
  setEmojis(emojiOptions: EmojiOptions): this {
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
   * @param style
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setStyle("SECONDARY")
   *
   */
  setButtonAppearance(style?: ButtonStyle): this {
    this.buttonInfo.first.style = style || this.buttonInfo.first.style;
    this.buttonInfo.prev.style = style || this.buttonInfo.prev.style;
    this.buttonInfo.next.style = style || this.buttonInfo.next.style;
    this.buttonInfo.last.style = style || this.buttonInfo.last.style;

    return this;
  }
  /**
   * customize button styles
   * @param buttonOptions
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setButtons({
   * first: {
   * label: "First",
   * emoji: ":first_emoji:",
   * style: "SECONDARY"
   * }})
   *
   */
  setButtons(options: ButtonsOptions): this {
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
   * const pagination = new Pagination(interaction)
   * .addActionRows([new MessageActionRow()], "above")
   *
   */
  addActionRows(
    actionRows: MessageActionRow[],
    position: "below" | "above" = "below"
  ): this {
    if (position === "above") {
      this.actionRows.unshift(...actionRows);
    } else {
      this.actionRows.push(...actionRows);
    }
    return this;
  }
  /**
   *
   * send a attachment along with the embed
   * @param attachments
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
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
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
   * .addAttachment(new MessageAttachment())
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
   * const pagination = new Pagination(interaction)
   * .setAttachments([new MessageAttachment()])
   * .addAttachments([new MessageAttachment(), new MessageAttachment()])
   */
  addAttachments(attachments: MessageAttachment[]): this {
    this.attachments.push(...attachments);
    return this;
  }
  readyActionRows(): this {
    this.buttons = {
      first: new MessageButton()
        .setCustomId("first")
        .setEmoji(this.buttonInfo.first.emoji)
        .setLabel(this.buttonInfo.first.label)
        .setStyle(this.buttonInfo.first.style)
        .setDisabled(true),
      prev: new MessageButton()
        .setCustomId("prev")
        .setEmoji(this.buttonInfo.prev.emoji)
        .setLabel(this.buttonInfo.prev.label)
        .setStyle(this.buttonInfo.prev.style)
        .setDisabled(true),
      next: new MessageButton()
        .setCustomId("next")
        .setEmoji(this.buttonInfo.next.emoji)
        .setLabel(this.buttonInfo.next.label)
        .setStyle(this.buttonInfo.next.style)
        .setDisabled(true),
      last: new MessageButton()
        .setCustomId("last")
        .setEmoji(this.buttonInfo.last.emoji)
        .setLabel(this.buttonInfo.last.label)
        .setStyle(this.buttonInfo.last.style)
        .setDisabled(true),
    };
    if (this.totalEntry > this.limit) {
      this.buttons.next.setDisabled(false);
      this.buttons.last.setDisabled(false);
    }
    this.mainActionRow.addComponents(
      this.buttons.first,
      this.buttons.prev,
      this.buttons.next,
      this.buttons.last
    );
    this.actionRows.push(this.mainActionRow);
    return this;
  }
  readyPayloads(): InteractionReplyOptions & { fetchReply: true } {
    this.readyActionRows();
    this.payloads.components = this.actionRows;
    this.payloads.files = this.attachments;
    this.payloads.embeds = [this];
    return this.payloads;
  }
  /**
   * go to a specific page
   * @param pageNumber
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * .setLimit(1)
   * .setDescriptions(["1st page", "2nd page", "3rd page", "4th page", "5th page"])
   * ...
   * pagination.goToPage(2)
   */
  goToPage(pageNumber: number): this {
    this.currentPage = pageNumber;
    if (!this.footer) {
      this.customFooter = false;
      this.rawFooter = `Pages: {pageNumber}/{totalPages}`;
    } else if (this.customFooter && !this.rawFooter) {
      this.rawFooter = this.footer.text;
    }
    this.setFooter(
      this.rawFooter
        .replace(/{pageNumber}/g, `${pageNumber}`)
        .replace(/{totalPages}/g, `${Math.ceil(this.totalEntry / this.limit)}`),
      this.footer?.iconURL
    );
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
        this.fields.slice(
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
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goFirst(i)
   */
  goFirst(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = 1;
    this.buttons?.prev.setDisabled(true);
    this.buttons?.first.setDisabled(true);
    this.buttons?.next.setDisabled(false);
    this.buttons?.last.setDisabled(false);
    this.mainActionRow?.setComponents(
      this.buttons.first,
      this.buttons.prev,
      this.buttons.next,
      this.buttons.last
    );

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
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goPrev(i)
   */
  goPrev(i: ButtonInteraction): ButtonInteraction {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buttons?.prev.setDisabled(this.currentPage === 1);
      this.buttons?.first.setDisabled(this.currentPage === 1);
      this.buttons?.next.setDisabled(false);
      this.buttons?.last.setDisabled(false);
      this.mainActionRow.setComponents(
        this.buttons.first,
        this.buttons.prev,
        this.buttons.next,
        this.buttons.last
      );
      this.goToPage(this.currentPage);
      i.update(this.payloads);
    }
    return i;
  }
  /**
   *
   * go to the next page
   * @param i
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goNext(i)
   */
  goNext(i: ButtonInteraction): ButtonInteraction {
    if (this.currentPage < Math.ceil(this.totalEntry / this.limit)) {
      this.currentPage++;
      this.buttons?.prev.setDisabled(false);
      this.buttons?.first.setDisabled(false);
      this.buttons?.next.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
      this.buttons?.last.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
      this.mainActionRow.setComponents(
        this.buttons.first,
        this.buttons.prev,
        this.buttons.next,
        this.buttons.last
      );
      this.goToPage(this.currentPage);
      i.update(this.payloads);
    }
    return i;
  }
  /**
   *
   * go to the last page
   * @param i
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.goLast(i)
   */
  goLast(i: ButtonInteraction): ButtonInteraction {
    this.currentPage = Math.ceil(this.totalEntry / this.limit);
    this.buttons?.prev.setDisabled(false);
    this.buttons?.first.setDisabled(false);
    this.buttons?.next.setDisabled(true);
    this.buttons?.last.setDisabled(true);
    this.mainActionRow.setComponents(
      this.buttons.first,
      this.buttons.prev,
      this.buttons.next,
      this.buttons.last
    );
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
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.paginate(message)
   */
  paginate(message: Message): this {
    const collector = message.createMessageComponentCollector({
      idle: this.idle,
    });

    collector.on("collect", async (i: ButtonInteraction) => {
      if (
        (i.member as GuildMember).id !=
        (this.interaction.member as GuildMember).id
      )
        return i.deferUpdate();
      if (i.customId === "first") {
        this.goFirst(i);
      }
      if (i.customId === "prev") {
        this.goPrev(i);
      }
      if (i.customId === "next") {
        this.goNext(i);
      }
      if (i.customId === "last") {
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
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.ready()
   */
  ready(): InteractionReplyOptions & { fetchReply: true } {
    this.totalEntry = Math.max(this.descriptions.length, this.images.length);
    if (this.fieldPaginate) {
      this.totalEntry = Math.max(this.totalEntry, this.fields.length);
    }
    const payloads = this.readyPayloads();
    this.goToPage(this.currentPage);
    return payloads;
  }
  /**
   *
   * send the final message
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.render()
   */
  async render(): Promise<Message> {
    return await this.reply();
  }
  /**
   *
   * reply the final message
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.reply()
   */
  async reply(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | MessageComponentInteraction
    ).reply(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  /**
   *
   * send reply as a followUp
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.followUp()
   */
  async followUp(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | ButtonInteraction
    ).followUp(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  /**
   *
   * edit the original reply with the final message
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.editReply()
   */
  async editReply(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | ButtonInteraction
    ).editReply(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  /**
   *
   * update to button interaction
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.update()
   */
  async update(): Promise<Message> {
    const payloads = this.ready();
    const message = await (this.interaction as ButtonInteraction).update(
      payloads
    );
    this.paginate(message as Message);
    return message as Message;
  }
  /**
   *
   * send the final message in the interaction channel
   * @returns
   * @example
   * const pagination = new Pagination(interaction)
   * ...
   * pagination.send()
   */
  async send(): Promise<Message> {
    const payloads = this.ready();
    const message = await this.interaction.channel?.send(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
}

export { Pagination };

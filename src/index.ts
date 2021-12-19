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
} as Options;

interface Options extends EmojiOptions {
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
}

interface EmojiOptions {
  /**
   * The emoji to use for the first button.
   * @default "⏮"
   */
  firstEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the previous button.
   * @default "⬅️"
   */
  lastEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the next button.
   * @default "➡️"
   */
  prevEmoji?: EmojiIdentifierResolvable;
  /**
   * The emoji to use for the last button.
   * @default "⏭"
   */
  nextEmoji?: EmojiIdentifierResolvable;
}

class Pagination extends MessageEmbed {
  /**
   * Pagination Class
   */
  public readonly interaction: CommandInteraction | ButtonInteraction | Message;
  public images: string[];
  public descriptions: string[];
  public actionRows: MessageActionRow[];
  public payloads: InteractionReplyOptions & { fetchReply: true };
  public totalEntry: number;
  public firstEmoji!: EmojiIdentifierResolvable;
  public lastEmoji!: EmojiIdentifierResolvable;
  public prevEmoji!: EmojiIdentifierResolvable;
  public nextEmoji!: EmojiIdentifierResolvable;
  public limit!: number;
  public idle!: number;
  public ephemeral!: boolean;
  public prevDescription!: string;
  public postDescription!: string;
  public attachments!: MessageAttachment[];
  public currentPage!: number;
  public customFooter: boolean;
  public fieldPaginate!: boolean;
  public buttons!: {
    first: MessageButton;
    prev: MessageButton;
    next: MessageButton;
    last: MessageButton;
  };
  public mainActionRow!: MessageActionRow;
  public rawFooter!: string;

  constructor(
    interaction: CommandInteraction | ButtonInteraction | Message,
    options: Options = {}
  ) {
    super();
    options = Object.assign({}, defaultOptions, options);
    this.interaction = interaction;
    this.setOptions(options);
    this.images = [];
    this.descriptions = [];
    this.actionRows = [];
    this.payloads = { fetchReply: true };
    this.totalEntry = 0;
    this.customFooter = true;
  }
  setOptions(options: Options): this {
    this.setEmojis({
      firstEmoji: options.firstEmoji,
      prevEmoji: options.prevEmoji,
      nextEmoji: options.nextEmoji,
      lastEmoji: options.lastEmoji,
    });
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
  setImages(images: string[]): this {
    this.images = images;
    return this;
  }
  addImage(image: string): this {
    this.images.push(image);
    return this;
  }
  addImages(images: string[]): this {
    this.images.push(...images);
    return this;
  }
  setDescriptions(descriptions: string[]): this {
    this.descriptions = descriptions;
    return this;
  }
  addDescription(description: string): this {
    this.descriptions.push(description);
    return this;
  }
  addDescriptions(descriptions: string[]): this {
    this.descriptions.push(...descriptions);
    return this;
  }
  paginateFields(paginate: boolean): this {
    this.fieldPaginate = paginate;
    return this;
  }
  setIdle(idle: number): this {
    this.idle = idle;
    return this;
  }
  setEphemeral(ephemeral: boolean): this {
    this.ephemeral = ephemeral;
    return this;
  }
  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }
  setPrevDescription(prevDescription: string): this {
    this.prevDescription = prevDescription;
    return this;
  }
  setPostDescription(postDescription: string): this {
    this.postDescription = postDescription;
    return this;
  }
  setEmojis(emojiOptions: EmojiOptions): this {
    this.firstEmoji = emojiOptions.firstEmoji || this.firstEmoji;
    this.prevEmoji = emojiOptions.prevEmoji || this.prevEmoji;
    this.nextEmoji = emojiOptions.nextEmoji || this.nextEmoji;
    this.lastEmoji = emojiOptions.lastEmoji || this.lastEmoji;
    return this;
  }
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
  readyActionRows(): this {
    this.buttons = {
      first: new MessageButton()
        .setCustomId("first")
        .setEmoji(this.firstEmoji)
        .setStyle("SECONDARY")
        .setDisabled(true),
      prev: new MessageButton()
        .setCustomId("prev")
        .setEmoji(this.prevEmoji)
        .setStyle("SECONDARY")
        .setDisabled(true),
      next: new MessageButton()
        .setCustomId("next")
        .setEmoji(this.nextEmoji)
        .setStyle("SECONDARY")
        .setDisabled(true),
      last: new MessageButton()
        .setCustomId("last")
        .setEmoji(this.lastEmoji)
        .setStyle("SECONDARY")
        .setDisabled(true),
    };
    if (this.totalEntry > this.limit) {
      this.buttons.next.setDisabled(false);
      this.buttons.last.setDisabled(false);
    }
    this.mainActionRow = new MessageActionRow().addComponents(
      this.buttons.first,
      this.buttons.prev,
      this.buttons.next,
      this.buttons.last
    );
    this.actionRows.push(this.mainActionRow);
    return this;
  }
  setAttachments(attachments: MessageAttachment[]): this {
    this.attachments = attachments;
    return this;
  }
  addAttachment(attachment: MessageAttachment): this {
    this.attachments.push(attachment);
    return this;
  }
  addAttachments(attachments: MessageAttachment[]): this {
    this.attachments.push(...attachments);
    return this;
  }
  readyPayloads(): InteractionReplyOptions & { fetchReply: true } {
    this.readyActionRows();
    this.payloads.components = this.actionRows;
    this.payloads.files = this.attachments;
    this.payloads.embeds = [this];
    return this.payloads;
  }
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
   * @returns {MessagePayload}
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
  async reply(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | MessageComponentInteraction
    ).reply(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  async followUp(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | ButtonInteraction
    ).followUp(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  async editReply(): Promise<Message> {
    const payloads = this.ready();
    const message = await (
      this.interaction as CommandInteraction | ButtonInteraction
    ).editReply(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
  async update(): Promise<Message> {
    const payloads = this.ready();
    const message = await (this.interaction as ButtonInteraction).update(
      payloads
    );
    this.paginate(message as Message);
    return message as Message;
  }
  async send(): Promise<Message> {
    const payloads = this.ready();
    const message = await this.interaction.channel?.send(payloads);
    this.paginate(message as Message);
    return message as Message;
  }
}

export { Pagination };
export type { EmojiOptions, Options };

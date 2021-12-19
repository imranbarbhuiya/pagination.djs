import type {
  ButtonInteraction,
  Interaction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessagePayload,
} from "discord.js";

export type EmojiOptions = {
  firstEmoji?: string;
  lastEmoji?: string;
  prevEmoji?: string;
  nextEmoji?: string;
};

export interface PaginationOptions extends EmojiOptions {
  limit?: number;
  idle?: number;
  ephemeral?: boolean;
  prevDescription?: string;
  postDescription?: string;
  attachments?: MessageAttachment[];
}

export class Pagination extends MessageEmbed {
  public interaction: Interaction;
  public images: string[];
  public descriptions: string[];
  public actionsRows: MessageActionRow[];
  public payloads: MessagePayload;
  private totalEntry: number;
  public firstEmoji: string;
  public lastEmoji: string;
  public prevEmoji: string;
  public nextEmoji: string;
  public limit: number;
  public idle: number;
  public ephemeral: boolean;
  public prevDescription: string;
  public postDescription: string;
  public attachments: string[];
  private currentPage: number;
  constructor(interaction: Interaction, options: PaginationOptions);

  public setOptions(options: PaginationOptions): this;

  public setImages(images: string[]): this;
  public addImage(image: string): this;
  public addImages(images: string[]): this;

  public setDescriptions(descriptions: string[]): this;
  public addDescription(description: string): this;
  public addDescriptions(descriptions: string[]): this;

  public paginateFields(paginate: boolean): this;

  public setIdle(idle: number): this;
  public setEphemeral(ephemeral: boolean): this;
  public setLimit(limit: number): this;

  public setPrevDescription(description: string): this;
  public setPostDescription(description: string): this;

  public setEmojis(emojiOptions: EmojiOptions): this;

  public addActionsRows(
    actionsRows: MessageActionRow[],
    position: "top" | "bottom"
  ): this;

  readyActionRows(): this;

  public setAttachments(attachments: MessageAttachment[]): this;
  public addAttachment(attachment: MessageAttachment): this;
  public addAttachments(attachments: MessageAttachment[]): this;

  public readyPayload(): MessagePayload;

  public goToPage(page: number): this;

  public goFirst(i: ButtonInteraction): this;
  public goLast(i: ButtonInteraction): this;
  public goPrev(i: ButtonInteraction): this;
  public goNext(i: ButtonInteraction): this;

  private paginate(): this;

  sendMessage(): Promise<Message>;
}

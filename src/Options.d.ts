import type { MessageAttachment, MessageButton } from "discord.js";

/**
 * The options to customize the pagination.
 */
export interface Options {
  /**
   * The number of entries to show per page.
   * @default 5
   */
  limit: number;
  /**
   * The number of seconds before the paginator will close after inactivity.
   * @default 5 minutes
   */
  idle: number;
  /**
   * Whether the reply should be ephemeral.
   * @default false
   */
  ephemeral: boolean;
  /**
   * The description to show before the paginated descriptions.
   * @default ""
   */
  prevDescription: string;
  /**
   * The description to show after the paginated descriptions.
   * @default ""
   */
  postDescription: string;
  /**
   * The attachments to show with the paginated messages.
   * @default []
   */
  attachments: MessageAttachment[];

  /**
   * Contents if changing contents per page.
   * @default []
   */
  contents: string[];
  /**
   * loop through the pages.
   * @default false
   */
  loop: boolean;

  buttons: {
    first: MessageButton;
    prev: MessageButton;
    next: MessageButton;
    last: MessageButton;
    [key: string]: MessageButton;
  };
}

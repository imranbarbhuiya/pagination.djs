import { MessageButton } from "discord.js";
import { Options } from "./Options";

/**
 * The default options for the paginator.
 */
export const defaultOptions: Options = {
  limit: 5,
  idle: 5 * 60 * 1000,
  ephemeral: false,
  prevDescription: "",
  postDescription: "",
  attachments: [],
  contents: [],
  loop: false,
  buttons: {
    first: new MessageButton()
      .setEmoji("⏮")
      .setCustomId("paginate-first")
      .setStyle("SECONDARY"),
    prev: new MessageButton()
      .setEmoji("◀️")
      .setCustomId("paginate-prev")
      .setStyle("SECONDARY"),
    next: new MessageButton()
      .setEmoji("▶️")
      .setCustomId("paginate-next")
      .setStyle("SECONDARY"),
    last: new MessageButton()
      .setEmoji("⏭")
      .setCustomId("paginate-last")
      .setStyle("SECONDARY"),
  },
};

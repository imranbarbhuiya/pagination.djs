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
    first: new MessageButton().setEmoji("⏮").setCustomId("paginate-first"),
    prev: new MessageButton().setEmoji("◀️").setCustomId("paginate-prev"),
    next: new MessageButton().setEmoji("▶️").setCustomId("paginate-next"),
    last: new MessageButton().setEmoji("⏭").setCustomId("paginate-last"),
  },
};

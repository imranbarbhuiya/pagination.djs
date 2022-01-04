import { Options } from "./types";

//TODO: describe this "global" variable

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

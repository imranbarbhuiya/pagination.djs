import { Client, Intents } from "discord.js";
import { Pagination } from "../dist";

const client = new Client({
  intents: [Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => console.log("Connected"));

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "pagination") {
    const descriptions = [
      "This is a description.",
      "This is a second description.",
    ];

    const pagination = new Pagination(interaction);

    pagination.setDescriptions(descriptions).render();
  }
});

// change TOKEN by your own token from <https://discord.com/developers/applications>
client.login("TOKEN");

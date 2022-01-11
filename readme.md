![npm](https://img.shields.io/npm/v/pagination.djs?label=Npm&logo=npm&style=for-the-badge)
![npm](https://img.shields.io/npm/dw/pagination.djs?label=Downloads&logo=npm&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/imranbarbhuiya/pagination.djs?style=for-the-badge)
![Lint Status](https://img.shields.io/github/workflow/status/imranbarbhuiya/duration/Lint/main?label=Lint&logo=eslint&style=for-the-badge)
![Build Status](https://img.shields.io/github/workflow/status/imranbarbhuiya/duration/Build/main?label=Build&style=for-the-badge&logo=TypeScript)

# Pagination.djs

A discord.js compatible pagination module.
It's a simple and lightweight module to paginate discord embeds.

- download using npm: [pagination.djs](https://www.npmjs.com/package/pagination.djs)
- read docs here: [pagination.djs](https://pagination-djs.js.org/)

## Installation

### Using npm

```bash
npm install pagination.djs
```

### Using yarn

```bash
yarn add pagination.djs
```

This package needs [discord.js](https://discord.js.org) version 13.5.0 or above.

## Uses

Example shows how to use it with any application command but it's valid for message commands as well. You just need to pass the message in place of interaction.

### Basic examples

#### Paginate through descriptions

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

const descriptions = [
  "This is a description.",
  "This is a second description.",
];
pagination.setDescriptions(descriptions);
pagination.render();
```

#### Paginate through images

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

const images = ["1st image link", "2nd image link"];
pagination.setImages(images);
pagination.render();
```

#### Paginate through Fields

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

pagination.setFields([
  {
    name: "First",
    value: "First",
  },
  {
    name: "Second",
    value: "Second",
  },
  {
    name: "Third",
    value: "Third",
  },
]);
pagination.paginateFields(true);
pagination.render();
```

Note: You need to add `paginateFields(true)` in order to paginate through fields

#### Paginate through all

You can paginate through descriptions, images, fields all at the same time

```js
const { Pagination } = require("pagination.djs");

const descriptions = [
  "This is a description.",
  "This is a second description.",
];
const images = ["1st image link", "2nd image link"];
const pagination = new Pagination(interaction)
  .setDescriptions(descriptions)
  .setImages(images)
  .setFields([
    {
      name: "First",
      value: "First",
    },
    {
      name: "Second",
      value: "Second",
    },
    {
      name: "Third",
      value: "Third",
    },
  ])
  .paginateFields(true);
pagination.render();
```

#### Paginate through multiple embeds

Note: If you use this then all the embed methods (`setTitle()`, ...) and other pagination methods (`setImages()`, ...) will be ignored

Paginate through multiple embeds

```js
const { Pagination } = require("pagination.djs");
const { MessageEmbed } = require("discord.js");
const pagination = new Pagination(interaction);

const embeds = [];

for (let i = 0; i <= 5; i++) {
  const newEmbed = new MessageEmbed().setTitle(`Embed ${i + 1}`);
  embeds.push(newEmbed);
}

pagination.setEmbeds(embeds);
pagination.render();
```

### Customize embed

The pagination class extends the [discord.js MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) class. So you can directly use the embed methods.

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

pagination.setTitle("Pagination");
pagination.setDescription("This is a description.");

pagination.setColor("#00ff00");
pagination.setFooter("Pagination");
pagination.setTimestamp();

pagination.addFields([
  {
    name: "First",
    value: "First",
  },
  {
    name: "Second",
    value: "Second",
  },
  {
    name: "Third",
    value: "Third",
  },
]);
pagination.paginateFields(true);
pagination.render();
```

### Customization

You can customize the behavior of the pagination by passing the following options:

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction, {
  firstEmoji: "⏮", // First button emoji
  prevEmoji: "◀️", // Previous button emoji
  nextEmoji: "▶️", // Next button emoji
  lastEmoji: "⏭", // Last button emoji
  limit: 5, // number of entries per page
  idle: 30000, // idle time in ms before the pagination closes
  ephemeral: false, // ephemeral reply
  prevDescription: "",
  postDescription: "",
  attachments: [new MessageAttachment()], // attachments you want to pass with the embed
  buttonStyle: "SECONDARY",
  loop: false, // loop through the pages
});
```

Note: All the options are optional

You can set the options with `setOptions()` method also

```js
pagination.setOptions(option);
```

By default embed will show page number and total pages in footer as

`Pages: pageNumber/totalPages`

You can change it by setting `pagination.setFooter("my footer")` and you can pass `{pageNumber}` and `{totalPages}` which will be replaced with the respective value.

#### Set emojis

set button emojis with `setEmojis()` method. You can set any custom or default emojis.

```js
pagination.setEmojis({
  firstEmoji: "⏮",
  prevEmoji: "◀️",
  nextEmoji: "▶️",
  lastEmoji: "⏭",
});
```

#### Customize button

Customize label, emoji or style of button using `setButtonAppearance()` method

```js
pagination.setButtonAppearance({
  first: {
    label: "First",
    emoji: "⏮",
    style: "PRIMARY",
  },
  prev: {
    label: "Prev",
    emoji: "◀️",
    style: "SECONDARY",
  },
  next: {
    label: "Next",
    emoji: "▶️",
    style: "SUCCESS",
  },
  last: {
    label: "Last",
    emoji: "⏭",
    style: "DANGER",
  },
});
```

#### Change button styles

Change all the button style

```js
pagination.setButtonStyle("SECONDARY");
```

#### Add Action row

Add some action rows above or below the pagination button row

```js
pagination.addActionRow(new MessageActionRow(), "above");
```

#### prevDescription and postDescription

Add a fixed prev descriptions or a post descriptions
This can only be used when pagination through descriptions else it'll be ignored

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction)
  .setPrevDescription("Previous")
  .setPostDescription("Post")
  .descriptions(["Array of descriptions"]);

pagination.render();
```

#### Add multiple authorized users

```js
pagination.setAuthorizedUsers(["user1", "user2"]);
```

```js
pagination.addAuthorizedUser("user1");
```

```js
pagination.addAuthorizedUsers(["user3", "user4"]);
```

#### Send attachments

Send attachments along with the message
You can pass attachments in the `setOptions` or using `setAttachments()`, `addAttachment()` or `addAttachments()`

```js
pagination.setAttachments([new MessageAttachment()]);
```

### Other send options

By default [render()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#render) will [reply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#reply) to the interaction. But if the interaction is already replied or deferred then it'll [editReply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#editReply) instead. You can change the behavior farther more with the other send methods available. Available built-in methods are:

- [reply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#reply) reply to the interaction
- [followUp()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#followUp) send followUp reply to the interaction
- [editReply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#editReply) edit interaction reply
- [send()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#send) send message in the interaction channel

If you want to send it by yourself or send in a different channel then you can follow these steps:

```js
const payloads = pagination.ready();
const message = await interaction.reply(payloads);
pagination.paginate(message);
```

### Preview

<p align="center">
  <a href="#image1">
    <img alt="image1" id="image1" src="https://user-images.githubusercontent.com/74945038/146672128-dcd1251f-194b-48b6-9091-9dffb4a39399.png">
  </a>
  <a href="#image2">
    <img alt="image2" id="image2" src="https://user-images.githubusercontent.com/74945038/146672133-faf40f4b-5c0c-4988-8044-fbf174231fb6.png"> </a>
  <a href="#image3">
    <img alt="image3" id="image3" src="https://user-images.githubusercontent.com/74945038/146672134-69c492b4-0c25-4d06-b3a0-326c0b2ee743.png"> </a>
</P>

## Migration guide

If you are migrating from other lib where you use to set multiple embeds at the same time,
then we also have a similar method called [Pagination#setEmbeds](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#setEmbeds), where you can pass your embeds and use [render()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#render) method and pagination will take care of the rest.

## Note

- If you have a global Button Interaction handler then you can ignore the interactions with customId starting with `paginate-`.
- When adding an additional action row or button, don't set the custom id to any of the following: `paginate-first`, `paginate-prev`, `paginate-next`, `paginate-last`.

## License

MIT

## Author

[@imranbarbhuiya](https://github.com/imranbarbhuiya)

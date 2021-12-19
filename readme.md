# Pagination.js

A discord.js compatible pagination module.
It's a simple and lightweight module to paginate discord embeds

## Installation

```bash
npm install pagination.js
```

This package uses buttons so [discord.js](https://discord.js.org) v13+ is required.

## Uses

Example shows how to use it with any application command but it's valid for message commands as well. You just need to pass the message in place of interaction.

### Paginate through descriptions

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

const descriptions = [
  "This is a description.",
  "This is a second description.",
];
pagination.setDescriptions(descriptions);
pagination.reply();
```

### Paginate through images

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);

const images = ["1st image link", "2nd image link"];
pagination.setImages(images);
pagination.reply();
```

### Paginate through Fields

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
pagination.reply();
```

Note: You need to add `paginateFields(true)` in order to paginate through fields

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
pagination.reply();
```

### Add fixed prev descriptions and post descriptions

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction);
pagination.setPrevDescription("Previous");
pagination.setPostDescription("Post");
pagination.descriptions(["Array of descriptions"]);
pagination.reply();
```

### Customization

You can customize the behavior of the pagination by passing the following options:

```js
const { Pagination } = require("pagination.djs");
const pagination = new Pagination(interaction, {
  firstEmoji: "⏮", // First button emoji
  prevEmoji: "⬅️", // Previous button emoji
  nextEmoji: "➡️", // Next button emoji
  lastEmoji: "⏭", // Last button emoji
  limit: 5, // number of entries per page
  idle: 30000, // idle time in ms before the pagination closes
  ephemeral: false, // ephemeral reply
  prevDescription: "",
  postDescription: "",
  attachments: [new MessageAttachment()], // attachments you want to pass with the embed
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

### Custom reply

By default `reply()` will reply to the interaction. If you want to send the reply as a followUp or edit then you need to get the MessagePayload from `ready()` method and send it manually. Then call `paginate(message)` by passing the message

```js
const payloads = pagination.ready();
const message = await interaction.followUp(payloads);
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

## License

MIT

## Author

[@imranbarbhuiya](https://github.com/imranbarbhuiya)

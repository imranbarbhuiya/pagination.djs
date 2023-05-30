<div align="center">

# pagination.djs

A simple and lightweight module to paginate discord embeds.

[![GitHub](https://img.shields.io/github/license/imranbarbhuiya/pagination.djs)](https://github.com/imranbarbhuiya/pagination.djs/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/pagination.djs?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/pagination.djs)
[![npm](https://img.shields.io/npm/dw/pagination.djs)](https://www.npmjs.com/package/pagination.djs)

</div>

Read docs here: [pagination.djs](https://pagination-djs.js.org/)

## Features

-   Written In Typescript
-   Offers CJS and ESM builds
-   Full TypeScript & JavaScript support
-   Simple and easy to use

## Installation

> **Note**
> V4 is for discord.js v14.x. For discord.js v13.x, Use [v3](https://github.com/imranbarbhuiya/pagination.djs/tree/v3).

`pagination.djs` depends on the following packages. Be sure to install these along with this package!

-   [discord.js](https://www.npmjs.com/package/discord.js)

You can use the following command to install this package, or replace npm install with your package manager of choice.

```bash
npm install pagination.djs discord.js
```

## Uses

Example shows how to use it with any application command but it's valid for message commands as well. You just need to pass the message in place of interaction.

### Basic examples

#### Paginate through descriptions

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction);

const descriptions = ['This is a description.', 'This is a second description.'];
pagination.setDescriptions(descriptions);
pagination.render();
```

#### Paginate through images

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction);

const images = ['1st image link', '2nd image link'];
pagination.setImages(images);
pagination.render();
```

#### Paginate through Fields

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction);

pagination.setFields([
	{
		name: 'First',
		value: 'First'
	},
	{
		name: 'Second',
		value: 'Second'
	},
	{
		name: 'Third',
		value: 'Third'
	}
]);
pagination.paginateFields();
pagination.render();
```

> **Warning**
> You need to add `paginateFields()` in order to paginate through fields

#### Paginate through all

You can paginate through descriptions, images, fields all at the same time

```js
const { Pagination } = require('pagination.djs');

const descriptions = ['This is a description.', 'This is a second description.'];
const images = ['1st image link', '2nd image link'];
const pagination = new Pagination(interaction)
	.setDescriptions(descriptions)
	.setImages(images)
	.setFields([
		{
			name: 'First',
			value: 'First'
		},
		{
			name: 'Second',
			value: 'Second'
		},
		{
			name: 'Third',
			value: 'Third'
		}
	])
	.paginateFields(true);
pagination.render();
```

#### Paginate through multiple embeds

> **Warning**
> If you use this then all the embed methods (`setTitle()`, ...) and other pagination methods (`setImages()`, ...) will be ignored

Paginate through multiple embeds

```js
const { Pagination } = require('pagination.djs');
const { EmbedBuilder } = require('discord.js');
const pagination = new Pagination(interaction);

const embeds = [];

for (let i = 0; i <= 5; i++) {
	const newEmbed = new EmbedBuilder().setTitle(`Embed ${i + 1}`);
	embeds.push(newEmbed);
}

pagination.setEmbeds(embeds);
// or if you want to set a common change in all embeds, you can do it by adding a cb.
pagination.setEmbeds(embeds, (embed, index, array) => {
	return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
});
pagination.render();
```

### Customize embed

The pagination class extends the [discord.js EmbedBuilder](https://discord.js.org/#/docs/discord.js/main/class/EmbedBuilder) class. So you can directly use the embed methods.

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction);

pagination.setTitle('Pagination');
pagination.setDescription('This is a description.');

pagination.setColor('#00ff00');
pagination.setFooter('Pagination');
pagination.setTimestamp();

pagination.addFields([
	{
		name: 'First',
		value: 'First'
	},
	{
		name: 'Second',
		value: 'Second'
	},
	{
		name: 'Third',
		value: 'Third'
	}
]);
pagination.paginateFields(true);
pagination.render();
```

### Customization

You can customize the behavior of the pagination by passing the following options:

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction, {
	firstEmoji: '⏮', // First button emoji
	prevEmoji: '◀️', // Previous button emoji
	nextEmoji: '▶️', // Next button emoji
	lastEmoji: '⏭', // Last button emoji
	limit: 5, // number of entries per page
	idle: 30000, // idle time in ms before the pagination closes
	ephemeral: false, // ephemeral reply
	prevDescription: '',
	postDescription: '',
	attachments: [new AttachmentBuilder()], // attachments you want to pass with the embed
	buttonStyle: ButtonStyle.Secondary, // button style
	loop: false // loop through the pages
});
```

> **Note:**
> All the options are optional. If you don't pass any option, the default values will be used.

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
	firstEmoji: '⏮',
	prevEmoji: '◀️',
	nextEmoji: '▶️',
	lastEmoji: '⏭'
});
```

#### Customize button

Customize label, emoji or style of button using `setButtonAppearance()` method

```js
pagination.setButtonAppearance({
	first: {
		label: 'First',
		emoji: '⏮',
		style: ButtonStyle.PRIMARY
	},
	prev: {
		label: 'Prev',
		emoji: '◀️',
		style: ButtonStyle.SECONDARY
	},
	next: {
		label: 'Next',
		emoji: '▶️',
		style: ButtonStyle.SUCCESS
	},
	last: {
		label: 'Last',
		emoji: '⏭',
		style: ButtonStyle.DANGER
	}
});
```

#### Change button styles

Change all the button style

```js
pagination.setButtonStyle(ButtonStyle.Secondary);
```

#### Add or remove buttons

`Pagination` class have a property `buttons` which stores all the buttons with keys `first`, `prev`, `next` and `last`. If you want to add one more you can add it with any key.

```js
pagination.buttons = { ...pagination.buttons, extra: new ButtonBuilder() };
```

If you want to remove some button then you can set the buttons to only these buttons.

```js
pagination.buttons = { prev: new ButtonBuilder(), next: new ButtonBuilder() };
```

If you are adding an extra button then make sure it's key isn't `first`, `prev`, `next`, or `last` or it'll be used to paginate between different pages.

#### Add Action row

Add some action rows above or below the pagination button row

```js
pagination.addActionRows([new ActionRowBuilder()], ExtraRowPosition.Below);
```

#### prevDescription and postDescription

Add a fixed prev descriptions or a post descriptions
This can only be used when pagination through descriptions else it'll be ignored

```js
const { Pagination } = require('pagination.djs');
const pagination = new Pagination(interaction).setPrevDescription('Previous').setPostDescription('Post').descriptions(['Array of descriptions']);

pagination.render();
```

#### Add multiple authorized users

By default `interaction.user` or `member.author` is the only authorized user. But you can set multiple authorized users with `setAuthorizedUsers()` method.

> **Note**
> If you pass an empty array in `setAuthorizedUsers()` then `everyone` can use the buttons.

```js
pagination.setAuthorizedUsers(['user1', 'user2']);
```

```js
pagination.addAuthorizedUser('user1');
```

```js
pagination.addAuthorizedUsers(['user3', 'user4']);
```

#### Send attachments

Send attachments along with the message
You can pass attachments in the `setOptions` or using `setAttachments()`, `addAttachmentBuilder()` or `addAttachments()`

```js
pagination.setAttachments([new AttachmentBuilder()]);
```

### Other send options

By default [render()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#render) will [reply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#reply) to the interaction. But if the interaction is already replied or deferred then it'll [editReply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#editReply) instead. You can change the behavior farther more with the other send methods available. Available built-in methods are:

-   [reply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#reply) reply to the interaction
-   [followUp()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#followUp) send followUp reply to the interaction
-   [editReply()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#editReply) edit interaction reply
-   [send()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#send) send message in the interaction channel

If you want to send it by yourself or send in a different channel then you can follow these steps:

```js
const payloads = pagination.ready();
const message = await interaction.reply(payloads);
pagination.paginate(message);
```

## Migration guide

If you are migrating from other lib where you use to set multiple embeds at the same time,
then we also have a similar method called [Pagination#setEmbeds](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#setEmbeds), where you can pass your embeds and use [render()](https://imranbarbhuiya.github.io/pagination.djs/classes/Pagination.html#render) method and pagination will take care of the rest.

## Contributors ✨

Thanks goes to these wonderful people:

<a href="https://github.com/imranbarbhuiya/TagScript/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=imranbarbhuiya/TagScript" />
</a>

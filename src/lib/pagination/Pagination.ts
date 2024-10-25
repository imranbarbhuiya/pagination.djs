import {
	BaseInteraction,
	ComponentType,
	Message,
	MessageComponentInteraction,
	type ButtonInteraction,
	type CommandInteraction,
	type InteractionCollector,
	type InteractionType,
	type Snowflake,
	type Interaction,
	type InteractionResponse,
	type GuildTextBasedChannel,
	type DMChannel
} from 'discord.js';

import { PaginationEmbed } from './PaginationEmbed.js';

import { authorOrUser } from '../utils/index.js';

import type { Options } from '../types';

/**
 * The pagination class.
 */
export class Pagination extends PaginationEmbed {
	// #region public fields

	/**
	 * The interaction that the paginator is for.
	 *
	 * @readonly
	 */
	public readonly interaction: Exclude<Interaction<'cached'>, { type: InteractionType.ApplicationCommandAutocomplete }> | Message;

	/**
	 * All the authorized users who can use the pagination buttons
	 */
	public authorizedUsers: Snowflake[];

	/**
	 * The collector of the pagination.
	 */
	public collector?: InteractionCollector<ButtonInteraction<'cached'>> | InteractionCollector<ButtonInteraction>;

	// #end region

	/**
	 * @param messageOrInteraction - The message or interaction to reply with the pagination message
	 * @param options - The pagination options
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction, {
	 *  firstEmoji: "⏮",
	 *  prevEmoji: "◀️",
	 *  nextEmoji: "▶️",
	 *  lastEmoji: "⏭",
	 *  limit: 5,
	 *  idle: 5 * 60 * 1000,
	 *  ephemeral: false,
	 *  prevDescription: "",
	 *  postDescription: "",
	 *  attachments: [],
	 *  buttonStyle: "SECONDARY",
	 *  loop: false,
	 * });
	 * ```
	 */
	public constructor(
		messageOrInteraction: Exclude<Interaction, { type: InteractionType.ApplicationCommandAutocomplete }> | Message,
		options: Partial<Options> = {}
	) {
		super(options);
		if (!(messageOrInteraction instanceof BaseInteraction) && !(messageOrInteraction instanceof Message)) {
			console.warn(
				`[pagination.djs] warn - The interaction must be an instance of Interaction or Message, received + ${
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					messageOrInteraction
						? ((messageOrInteraction as any).construction?.name ?? (messageOrInteraction as any).name ?? typeof messageOrInteraction)
						: typeof messageOrInteraction
				}\nFor more information, see: https://github.com/imranbarbhuiya/pagination.djs/issues/68 or https://github.com/imranbarbhuiya/pagination.djs/issues/88`
			);
		}

		// This is done to avoid confusion for end users. Also interaction mostly comes from cached guilds so it's safe to cast it.
		this.interaction = messageOrInteraction as Exclude<Interaction<'cached'>, { type: InteractionType.ApplicationCommandAutocomplete }>;
		this.authorizedUsers = [authorOrUser(messageOrInteraction).id];
	}

	// #region authorized users related

	/**
	 * Sets authorized users who can use these pagination buttons.
	 * Leave it a empty array to allow everyone to use the pagination.
	 *
	 * @param authorizedUsers - The users to set
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setAuthorizedUsers([userId1, userId2, userId3]);
	 * ```
	 */
	public setAuthorizedUsers(authorizedUsers: Snowflake[]): this {
		this.authorizedUsers = authorizedUsers;
		return this;
	}

	/**
	 * Adds a authorized user who can use these pagination buttons.
	 *
	 * @param authorizedUser - The user to add
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .addAuthorizedUser(userId1);
	 * ```
	 */
	public addAuthorizedUser(authorizedUser: Snowflake): this {
		this.authorizedUsers.push(authorizedUser);
		return this;
	}

	/**
	 * Adds multiple authorized users who can use these pagination buttons.
	 *
	 * @param authorizedUsers - The users to add
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .addAuthorizedUsers([userId1, userId2, userId3]);
	 * ```
	 */
	public addAuthorizedUsers(authorizedUsers: Snowflake[]): this {
		this.authorizedUsers.push(...authorizedUsers);
		return this;
	}

	// #end region

	/**
	 * Makes the pagination interactive.
	 *
	 * @param message - The message to listen for interactions
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.paginate(message);
	 * ```
	 */
	public paginate(message: InteractionResponse<true> | Message): this {
		this.collector = message.createMessageComponentCollector({
			filter: ({ customId, user }) =>
				['first', 'prev', 'next', 'last'].some((position) => this.buttons[position]?.data.custom_id === customId) &&
				(this.authorizedUsers.length ? this.authorizedUsers.includes(user.id) : true),
			idle: this.idle,
			componentType: ComponentType.Button
		});

		this.collector.on('collect', async (interaction) => {
			if (interaction.customId === this.buttons.first?.data.custom_id) {
				await this.goFirst(interaction);
				return;
			}

			if (interaction.customId === this.buttons.prev?.data.custom_id) {
				await this.goPrev(interaction);
				return;
			}

			if (interaction.customId === this.buttons.next?.data.custom_id) {
				await this.goNext(interaction);
				return;
			}

			if (interaction.customId === this.buttons.last?.data.custom_id) await this.goLast(interaction);
		});
		return this;
	}

	/**
	 * Sends the final message.
	 * By default, it will send as a reply to the message
	 * but if the interaction is already replied or deferred then it will `editReply`.
	 * If you want to send follow-up or update the interaction, then use {@link Pagination.followUp} or {@link Pagination.update} instead.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.render();
	 * ```
	 */
	public async render(): Promise<InteractionResponse<true> | Message> {
		if (this.interaction instanceof BaseInteraction && (this.interaction.replied || this.interaction.deferred)) return this.editReply();

		return this.reply();
	}

	/**
	 * Replies the final message.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.reply();
	 * ```
	 */
	public async reply(): Promise<InteractionResponse<true> | Message> {
		const payload = this.ready();
		const message = await (this.interaction as unknown as CommandInteraction<'cached'>).reply(payload);
		this.paginate(message);
		return message;
	}

	/**
	 * Sends the reply as a `followUp`.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.followUp();
	 * ```
	 */
	public async followUp(): Promise<Message> {
		const payload = this.ready();
		if (!(this.interaction instanceof BaseInteraction)) throw new TypeError('The interaction is not an instance of Interaction');
		const message = await this.interaction.followUp(payload);
		this.paginate(message);
		return message;
	}

	/**
	 * Edits the original reply with the final message.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.editReply();
	 * ```
	 */
	public async editReply(): Promise<Message> {
		const payload = this.ready();
		if (!(this.interaction instanceof BaseInteraction)) throw new TypeError('The interaction is not an instance of Interaction');
		const message = await this.interaction.editReply(payload);
		this.paginate(message);
		return message;
	}

	/**
	 * Updates the interaction's pagination.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.update();
	 * ```
	 */
	public async update(): Promise<InteractionResponse<true> | Message> {
		const payload = this.ready();
		if (!(this.interaction instanceof MessageComponentInteraction))
			throw new TypeError('The interaction is not an instance of MessageComponentInteraction');
		const message = await this.interaction.update(payload);
		this.paginate(message);
		return message;
	}

	/**
	 * Sends the final message in the interaction's channel.
	 *
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.send();
	 * ```
	 */
	public async send(): Promise<Message> {
		const payload = this.ready();
		if (!this.interaction.channel) throw new Error("The interaction or message don't have a channel");
		if (this.interaction.channel.partial) await this.interaction.channel.fetch();
		if (this.interaction.channel.partial) throw new Error('The interaction or message has a partial channel');
		const message = await (this.interaction.channel as DMChannel | GuildTextBasedChannel).send(payload);
		this.paginate(message);
		return message;
	}
}

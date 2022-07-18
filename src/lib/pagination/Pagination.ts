import {
	BaseInteraction,
	ComponentType,
	Interaction,
	InteractionResponse,
	Message,
	MessageComponentInteraction,
	type ButtonInteraction,
	type CommandInteraction,
	type InteractionCollector,
	type InteractionType,
	type Snowflake
} from 'discord.js';
import type { Options } from '../types';
import { authorOrUser } from '../utils';
import { PaginationEmbed } from './PaginationEmbed';

/**
 * The pagination class.
 */
export class Pagination extends PaginationEmbed {
	// #region public fields

	/**
	 * The interaction that the paginator is for.
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
	public collector?: InteractionCollector<ButtonInteraction> | InteractionCollector<ButtonInteraction<'cached'>>;

	// #end region

	/**
	 * @param messageOrInteraction
	 * @param options
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
	 *
	 */
	public constructor(
		messageOrInteraction: Exclude<Interaction<'cached'>, { type: InteractionType.ApplicationCommandAutocomplete }> | Message,
		options: Partial<Options> = {}
	) {
		super(options);
		if (!(messageOrInteraction instanceof BaseInteraction) && !(messageOrInteraction instanceof Message)) {
			throw new Error('The interaction must be an instance of Interaction or Message');
		}
		this.interaction = messageOrInteraction;
		this.authorizedUsers = [authorOrUser(messageOrInteraction).id];
	}

	// #region authorized users related

	/**
	 * Sets authorized users who can use these pagination buttons.
	 * Leave it a empty array to allow everyone to use the pagination.
	 * @param authorizedUsers
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .setAuthorizedUsers([userId1, userId2, userId3]);
	 * ```
	 *
	 */
	public setAuthorizedUsers(authorizedUsers: Snowflake[]): this {
		this.authorizedUsers = authorizedUsers;
		return this;
	}

	/**
	 * Adds a authorized user who can use these pagination buttons.
	 * @param authorizedUser
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .addAuthorizedUser(userId1);
	 * ```
	 *
	 */
	public addAuthorizedUser(authorizedUser: Snowflake): this {
		this.authorizedUsers.push(authorizedUser);
		return this;
	}

	/**
	 * Adds multiple authorized users who can use these pagination buttons.
	 * @param authorizedUsers
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction)
	 *  .addAuthorizedUsers([userId1, userId2, userId3]);
	 * ```
	 *
	 */
	public addAuthorizedUsers(authorizedUsers: Snowflake[]): this {
		this.authorizedUsers.push(...authorizedUsers);
		return this;
	}

	// #end region

	/**
	 * Makes the pagination interactive.
	 * @param message
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.paginate(message);
	 * ```
	 *
	 */
	public paginate(message: InteractionResponse<true> | Message): this {
		this.collector = message.createMessageComponentCollector({
			filter: ({ customId, user }) =>
				Object.values(this.buttons).some((b) => b.data.custom_id === customId) &&
				(this.authorizedUsers.length ? this.authorizedUsers.includes(user.id) : true),
			idle: this.idle,
			componentType: ComponentType.Button
		});

		this.collector.on('collect', (i) => {
			if (i.customId === this.buttons.first.data.custom_id) {
				return this.goFirst(i);
			}
			if (i.customId === this.buttons.prev.data.custom_id) {
				return this.goPrev(i);
			}
			if (i.customId === this.buttons.next.data.custom_id) {
				return this.goNext(i);
			}
			if (i.customId === this.buttons.last.data.custom_id) {
				return this.goLast(i);
			}
			// eslint-disable-next-line no-useless-return
			return;
		});
		return this;
	}

	/**
	 * Sends the final message.
	 * By default, it will send as a reply to the message
	 * but if the interaction is already replied or deferred then it will `editReply`.
	 * If you want to send follow-up or update the interaction, then use {@link followUp} or {@link update} instead.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.render();
	 * ```
	 *
	 */
	public async render(): Promise<Message | InteractionResponse<true>> {
		if (this.interaction instanceof BaseInteraction && (this.interaction.replied || this.interaction.deferred)) {
			return this.editReply();
		}
		return this.reply();
	}

	/**
	 * Replies the final message.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.reply();
	 * ```
	 *
	 */
	public async reply(): Promise<InteractionResponse<true> | Message> {
		const payloads = this.ready();
		const message = await (this.interaction as unknown as CommandInteraction<'cached'>).reply(payloads);
		this.paginate(message);
		return message;
	}

	/**
	 * Sends the reply as a `followUp`.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.followUp();
	 * ```
	 *
	 */
	public async followUp(): Promise<Message> {
		const payloads = this.ready();
		if (!(this.interaction instanceof BaseInteraction)) throw new Error('The interaction is not an instance of Interaction');
		const message = await this.interaction.followUp(payloads);
		this.paginate(message);
		return message;
	}

	/**
	 * Edits the original reply with the final message.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.editReply();
	 * ```
	 *
	 */
	public async editReply(): Promise<Message> {
		const payloads = this.ready();
		if (!(this.interaction instanceof BaseInteraction)) throw new Error('The interaction is not an instance of Interaction');
		const message = await this.interaction.editReply(payloads);
		this.paginate(message);
		return message;
	}

	/**
	 * Updates the interaction's pagination.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.update();
	 * ```
	 *
	 */
	public async update(): Promise<Message | InteractionResponse<true>> {
		const payloads = this.ready();
		if (!(this.interaction instanceof MessageComponentInteraction))
			throw new Error('The interaction is not an instance of MessageComponentInteraction');
		const message = await this.interaction.update(payloads);
		this.paginate(message);
		return message;
	}

	/**
	 * Sends the final message in the interaction's channel.
	 * @returns
	 * @example
	 * ```javascript
	 * const pagination = new Pagination(interaction);
	 * ...
	 * pagination.send();
	 * ```
	 *
	 */
	public async send(): Promise<Message> {
		const payloads = this.ready();
		if (!this.interaction.channel) throw new Error("The interaction or message don't have a channel");
		const message = await this.interaction.channel.send(payloads);
		this.paginate(message);
		return message;
	}
}

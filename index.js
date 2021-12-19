const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  Message,
  MessageAttachment,
  MessagePayload,
} = require("discord.js");
const { defaultOptions } = require("./constants");
class Pagination extends MessageEmbed {
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Options} options
   */
  constructor(interaction, options = {}) {
    super();
    options = Object.assign({}, defaultOptions, options);
    this.interaction = interaction;
    this.setOptions(options);
    this.images = [];
    this.descriptions = [];
    this.actionRows = [];
    this.payloads = { fetchReply: true };
    this.totalEntry = 0;
  }
  /**
   *
   * @param {Options} options
   * @returns
   */
  /**
   *@typedef Options
   * @property {String} [firstEmoji]
   * @property {String} [prevEmoji]
   * @property {String} [nextEmoji]
   * @property {String} [lastEmoji]
   * @property {Number} limit
   * @property {number} idle
   * @property {boolean} ephemeral
   * @property {String} prevDescription
   * @property {String} postDescription
   * @property {MessageAttachment[]} attachments
   *
   *
   */
  setOptions(options) {
    this.firstEmoji = options.firstEmoji || this.firstEmoji;
    this.prevEmoji = options.prevEmoji || this.prevEmoji;
    this.nextEmoji = options.nextEmoji || this.nextEmoji;
    this.lastEmoji = options.lastEmoji || this.lastEmoji;
    this.limit = options.limit || this.limit;
    this.idle = options.idle || this.idle;
    this.ephemeral = options.ephemeral || this.ephemeral;
    this.prevDescription =
      typeof options.prevDescription === "string"
        ? options.prevDescription
        : this.prevDescription;
    this.postDescription =
      typeof options.postDescription === "string"
        ? options.postDescription
        : this.postDescription;
    this.attachments = options.attachments || this.attachments;
    this.currentPage = 1;
    return this;
  }
  /**
   *
   * @param {String[]} images
   * @returns {this}
   */
  setImages(images) {
    this.images = images;
    return this;
  }
  /**
   *
   * @param {String} image
   * @returns {this}
   */
  addImage(image) {
    this.images.push(image);
    return this;
  }
  /**
   *
   * @param {String[]} images
   * @returns {this}
   */
  addImages(images) {
    this.images.push(...images);
    return this;
  }
  /**
   *
   * @param {String[]} descriptions
   * @returns {this}
   */
  setDescriptions(descriptions) {
    this.descriptions = descriptions;
    return this;
  }
  /**
   *
   * @param {String} description
   * @returns {this}
   */
  addDescription(description) {
    this.descriptions.push(description);
    return this;
  }
  /**
   *
   * @param {String[]} descriptions
   * @returns {this}
   */
  addDescriptions(descriptions) {
    this.descriptions.push(...descriptions);
    return this;
  }
  /**
   *
   * @param {boolean} paginate
   */
  paginateFields(paginate) {
    this.fieldPaginate = paginate;
  }
  /**
   *
   * @param {number} idle
   * @returns {this}
   */
  setIdle(idle) {
    this.idle = idle;
    return this;
  }
  /**
   *
   * @param {boolean} ephemeral
   * @returns {this}
   */
  setEphemeral(ephemeral) {
    this.ephemeral = ephemeral;
    return this;
  }
  /**
   *
   * @param {number} limit
   * @returns {this}
   */
  setLimit(limit) {
    this.limit = limit;
    return this;
  }
  /**
   *
   * @param {String} prevDescription
   * @returns {this}
   */
  setPrevDescription(prevDescription) {
    this.prevDescription = prevDescription;
    return this;
  }
  /**
   *
   * @param {string} postDescription
   * @returns {this}
   */
  setPostDescription(postDescription) {
    this.postDescription = postDescription;
    return this;
  }
  /**
   *
   * @param {EmojiOptions} emojiOptions
   * @returns {this}
   */
  setEmojis(emojiOptions) {
    this.firstEmoji = emojiOptions.firstEmoji || this.firstEmoji;
    this.prevEmoji = emojiOptions.prevEmoji || this.prevEmoji;
    this.nextEmoji = emojiOptions.nextEmoji || this.nextEmoji;
    this.lastEmoji = emojiOptions.lastEmoji || this.lastEmoji;
    return this;
  }
  /**
   *
   * @param {MessageActionRow[]} actionRows
   * @param {string} position
   * @returns
   */
  addActionRows(actionRows, position = "below") {
    if (position === "above") {
      this.actionRows.unshift(...actionRows);
    } else {
      this.actionRows.push(...actionRows);
    }
    return this;
  }
  /**
   *
   * @returns {this}
   */
  readyActionRows() {
    const first = new MessageButton()
      .setCustomId("first")
      .setEmoji(this.firstEmoji)
      .setStyle("SECONDARY")
      .setDisabled(true);
    const prev = new MessageButton()
      .setCustomId("prev")
      .setEmoji(this.prevEmoji)
      .setStyle("SECONDARY")
      .setDisabled(true);
    const next = new MessageButton()
      .setCustomId("next")
      .setEmoji(this.nextEmoji)
      .setStyle("SECONDARY")
      .setDisabled(true);
    const last = new MessageButton()
      .setCustomId("last")
      .setEmoji(this.lastEmoji)
      .setStyle("SECONDARY")
      .setDisabled(true);
    if (this.totalEntry > this.limit) {
      next.setDisabled(false);
      last.setDisabled(false);
    }
    this.first = first;
    this.prev = prev;
    this.next = next;
    this.last = last;
    this.mainActionRow = new MessageActionRow().addComponents(
      first,
      prev,
      next,
      last
    );
    this.actionRows.push(this.mainActionRow);
    return this;
  }
  /**
   *
   * @param {MessageAttachment[]} attachments
   * @returns {this}
   */
  setAttachments(attachments) {
    this.attachments = attachments;
    return this;
  }
  /**
   *
   * @param {MessageAttachment} attachment
   * @returns {this}
   */
  addAttachment(attachment) {
    this.attachments.push(attachment);
    return this;
  }
  /**
   *
   * @param {MessageAttachment[]} attachments
   * @returns {this}
   */
  addAttachments(attachments) {
    this.attachments.push(...attachments);
    return this;
  }
  /**
   *
   * @returns {MessagePayload}
   */
  readyPayloads() {
    this.readyActionRows();
    this.payloads.components = this.actionRows;
    this.payloads.files = this.attachments;
    this.payloads.embeds = [this];
    return this.payloads;
  }
  /**
   *
   * @param {number} pageNumber
   * @returns {this}
   */
  goToPage(pageNumber) {
    this.currentPage = pageNumber;
    this.setDescription(
      `${this.prevDescription}\n
        ${this.descriptions
          .slice(pageNumber * this.limit - this.limit, pageNumber * this.limit)
          .join("\n")}\n${this.postDescription}`
    )
      .setImage(this.images[pageNumber - 1])
      .setFooter(
        `Pages: ${pageNumber}/${Math.ceil(this.totalEntry / this.limit)}`
      );
    if (this.fieldPaginate) {
      this.setFields(
        this.fields.slice(
          pageNumber * this.limit - this.limit,
          pageNumber * this.limit
        )
      );
    }

    return this;
  }
  goFirst(i) {
    this.currentPage = 1;
    this.prev.setDisabled(true);
    this.first.setDisabled(true);
    this.next.setDisabled(false);
    this.last.setDisabled(false);
    this.mainActionRow.setComponents(
      this.first,
      this.prev,
      this.next,
      this.last
    );

    this.goToPage(1);

    i.update(this.payloads);
    return i;
  }
  goPrev(i) {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.prev.setDisabled(this.currentPage === 1);
      this.first.setDisabled(this.currentPage === 1);
      this.next.setDisabled(false);
      this.last.setDisabled(false);
      this.mainActionRow.setComponents(
        this.first,
        this.prev,
        this.next,
        this.last
      );
      this.goToPage(this.currentPage);
      i.update(this.payloads);
    }
    return i;
  }
  goNext(i) {
    if (this.currentPage < Math.ceil(this.totalEntry / this.limit)) {
      this.currentPage++;
      this.prev.setDisabled(false);
      this.first.setDisabled(false);
      this.next.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
      this.last.setDisabled(
        this.currentPage === Math.ceil(this.totalEntry / this.limit)
      );
      this.mainActionRow.setComponents(
        this.first,
        this.prev,
        this.next,
        this.last
      );
      this.goToPage(this.currentPage);
      i.update(this.payloads);
    }
    return i;
  }
  goLast(i) {
    this.currentPage = Math.ceil(this.totalEntry / this.limit);
    this.prev.setDisabled(false);
    this.first.setDisabled(false);
    this.next.setDisabled(true);
    this.last.setDisabled(true);
    this.mainActionRow.setComponents(
      this.first,
      this.prev,
      this.next,
      this.last
    );
    this.goToPage(this.currentPage);
    i.update(this.payloads);
    return i;
  }
  paginate() {
    const collector = this.message.createMessageComponentCollector({
      idle: this.idle,
    });

    collector.on("collect", async (i) => {
      if (i.member.id != this.interaction.member.id) return i.deferUpdate();
      if (i.customId === "first") {
        return this.goFirst(i);
      }
      if (i.customId === "prev") {
        return this.goPrev(i);
      }
      if (i.customId === "next") {
        return this.goNext(i);
      }
      if (i.customId === "last") {
        return this.goLast(i);
      }
      return this;
    });
  }
  /**
   *
   * @returns {Promise<Message}
   */
  async sendMessage() {
    this.totalEntry = Math.max(this.descriptions.length, this.images.length);
    if (this.fieldPaginate) {
      this.totalEntry = Math.max(this.totalEntry, this.fields.length);
    }
    const payloads = this.readyPayloads();
    this.goToPage(this.currentPage);
    const message = await this.interaction.reply(payloads);
    this.message = message;
    this.paginate();
    return message;
  }
}

module.exports = { Pagination };

const { RichEmbed } = require('discord.js');

const sendMessage = (channel, entry) => {
  const MAX_EMBED_LEN = 5500;
  const MAX_TITLE_LEN = 250;
  const MAX_FIELD_LEN = 1000;

  const message = 
    entry.title + " " + entry.url;

  channel.send(message);
}

module.exports = sendMessage;
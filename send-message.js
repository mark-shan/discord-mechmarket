const { RichEmbed } = require('discord.js');

const sendMessage = (channel, entry) => {
  const MAX_EMBED_LEN = 5500;
  const MAX_FIELD_LEN = 1000;

  const message = new RichEmbed()
    .setTitle(entry.title)
    .setAuthor(entry.author)
    .setDescription(entry.url)
    .setTimestamp(new Date(entry.created_utc * 1000));

  const strlen = entry.selftext.trim().substring(0, MAX_EMBED_LEN).length;
  for (let i = 0; i < strlen; i += MAX_FIELD_LEN) {
    message.addField(".", entry.selftext.substring(i, i + MAX_FIELD_LEN), true);
  }
  channel.send(message);
}

module.exports = sendMessage;
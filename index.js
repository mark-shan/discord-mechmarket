const { Client, RichEmbed } = require('discord.js');
const Parser = require('rss-parser');
const schedule = require('node-schedule');

const bot_token = process.env.BOT_TOKEN;
const channel_id = process.env.CHANNEL_ID;

const client = new Client();
const rss_parser = new Parser();

let last_updated = '';

const fetch_and_update_feed = async () => {
  let feed = await rss_parser.parseURL('https://www.reddit.com/r/mechmarket/new/.rss');
  console.log(Date.now(), 'Updating-', feed.title);
  const entries = feed.items
    .map((entry) => ({
      title: entry.title,
      time: Date.parse(entry.isoDate),
      link: entry.link,
    }))
    .filter((entry) => entry.time > last_updated)
    .reverse();

  console.log('Entries: ', entries.length);
  console.log(entries)

  for (entry of entries) {
    const message = entry.title + ' ' + entry.link
    client.channels.get(channel_id).send(message);
    last_updated = entry.time;
  }
};

client.on('ready', () => {
  schedule.scheduleJob('*/30 * * * * *', () => {
    fetch_and_update_feed()
  });
});

client.on('message', message => {
  if ('!update' == message.content) {
    fetch_and_update_feed();
  }
});

client.login(bot_token);
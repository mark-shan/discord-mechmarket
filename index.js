const { Client, RichEmbed } = require('discord.js');
const Parser = require('rss-parser');
const schedule = require('node-schedule');

const bot_token = process.env.BOT_TOKEN;
const channel_id = process.env.CHANNEL_ID;

const discord_client = new Client();
const rss_parser = new Parser();

let last_updated = new Date().toISOString();

const fetch_and_update_feed = async () => {
  let feed = await rss_parser.parseURL('https://www.reddit.com/r/mechmarket/new/.rss');
  console.log(Date.now(), 'Updating-', feed.title);
  const entries = feed.items
    .filter((entry) => entry.isoDate > last_updated)
    .reverse();

  console.log('Entries: ', entries.length);
  console.log(entries)

  for (entry of entries) {
    const message = entry.title + ' ' + entry.link
    discord_client.channels.get(channel_id).send(message);
    last_updated = entry.time;
  }
};

discord_client.on('ready', () => {
  schedule.scheduleJob('*/30 * * * * *', () => {
    fetch_and_update_feed()
  });
});

discord_client.on('message', message => {
  if ('!update' == message.content) {
    fetch_and_update_feed();
  }
});

discord_client.login(bot_token);

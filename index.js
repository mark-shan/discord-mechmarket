require('dotenv').config();
const { Client } = require('discord.js');
const request = require('request-promise');
const schedule = require('node-schedule');

const sendMessage = require('./send-message');

const bot_token = process.env.BOT_TOKEN;
const channel_id = process.env.CHANNEL_ID;

const discord_client = new Client();

let last_updated = 0;

const pick_json_fields = ({author, created_utc, selftext, title, url}) => ({author, created_utc, selftext, title, url});
const fetch_and_update_feed = async () => {
  const options = {
    uri: 'https://www.reddit.com/r/mechmarket/new/.json',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
  };
  let res = await request(options);

  console.log("Last Updated:", new Date(1000 * last_updated).toISOString());
  console.log("Now:", new Date().toISOString());

  const entries = res.data.children
    .map((entry) => pick_json_fields(entry.data))    
    .filter((entry) => entry.created_utc > last_updated)
    .reverse();
  console.log('Entries: ', entries.length);

  for (entry of entries) {
    sendMessage(discord_client.channels.get(channel_id), entry);
    last_updated = entry.created_utc;
    console.log(entry.title);
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
  else if ('!test' == message.content) {
    discord_client.channels.get(channel_id).send("<@" + message.author.id + ">");
  }
});

discord_client.login(bot_token);

const { parse } = require('node-html-parser');

const sendMessage = (channel, entry) => {
  const HREF_LINK = /href="(.*)"/;
  const IS_URL = /http/;
  const links = parse(entry.content)
    .firstChild
    .querySelectorAll('a')
    .reduce((accumulator, element) => {
      const attrs = element.rawAttrs.split(' ');
      attrs.forEach((attr) => {
        const matches = attr.match(HREF_LINK);
        if (matches) {
          const url = matches[1];
          if (IS_URL.test(url)) accumulator.push(matches[1]);
        }
      });
      return accumulator;
    },
    [])
    .slice(0,3);

  channel.send(entry.title + '\n' + entry.link + '\n' + links.join(' - '));
}

module.exports = sendMessage;
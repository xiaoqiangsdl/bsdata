const async = require('async');
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const superagent = require('superagent');

const teamUrl = require('../../data/teamUrl');

const players = [];

async.everyLimit(teamUrl, 5, function (url, callback) {
  superagent.get(url)
    .end((err, res) => {
      const $ = cheerio.load(res.text);

      $('.list li a').each((idx, item) => {
        const el = $(item);
        players.push('https:' + el.attr('href'));
      });

      callback(null, players);
    });
}, function (err, result) {
  console.log('数据处理完成');
  console.log('总共抓取的球员链接数: ' + players.length);
  fs.writeFileSync(path.join(process.cwd(), 'data/playerUrl.json'), JSON.stringify(players));
});
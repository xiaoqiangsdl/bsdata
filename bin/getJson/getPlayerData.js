const async = require('async');
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const superagent = require('superagent');

const playerUrl = require('../../data/playerUrl');

const players = [];

async.mapLimit(playerUrl, 5, function (url, callback) {
  superagent.get(url)
    .end((err, res) => {
      const html = res.text;
      const $ = cheerio.load(html);

      const playObj = {};

      const infoLiDom = $('.info .detail li');
      const bodyListDom = $('.body-list .num span');
      const infoTableDom = $('.info-list tr');

      playObj.id = url.replace(/[^\d]/ig, '');
      playObj.name = getInfo(0, 0);
      playObj.eg_name = getInfo(0, 1);
      playObj.team = getInfo(1, 0);
      playObj.no = getInfo(1, 1, true);
      playObj.age = getInfo(2, 0, true);
      playObj.position = getInfo(2, 1);

      playObj.height = getShencai(0);
      playObj.wingspan = getShencai(1);
      playObj.standreach = getShencai(2);
      playObj.weight = getShencai(3);

      function getInfo(index1, index2, onlyNum) {
        let data = infoLiDom.eq(index1).children('span').eq(index2).text().trim();
        data = !onlyNum ? data : data.replace(/[^\d]/ig, '');
        return data ? data : undefined;
      }

      function getShencai(index) {
        const data = bodyListDom.eq(index).contents().filter(function () { return this.nodeType === 3 }).text().trim()
        return data !== '不详' ? data : undefined;
      }

      infoTableDom.each((index, item) => {
        const tdDom = $(item).find('td');
        const name = tdDom.eq(0).text();
        const value = tdDom.eq(1).contents().filter(function () { return this.nodeType === 3 }).text().trim();

        switch (name) {
          case '生日':
            playObj.born = value;
            break;

          case '国籍':
            playObj.nationality = tdDom.eq(1).find('label').text().trim();
            break;

          case '薪水':
            playObj.salary = value.replace(/[^\d.]/ig, '');;
            break;

          case '选秀':
            playObj.draft = value;
            break;

          default:
            break;
        }
      });

      callback(null, playObj);
    });
}, function (err, result) {
  console.log('数据处理完成!!!');
  console.log('总共抓取的球员数: ' + result.length);
  fs.writeFileSync(path.join(process.cwd(), 'data/playerData.json'), JSON.stringify(result));
});

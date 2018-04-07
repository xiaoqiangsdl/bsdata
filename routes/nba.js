var async = require('async');

const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const superagent = require('superagent');

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   superagent.get('https://nba.hupu.com/teams/celtics')
//     .end((err, sres) => {
//       if (err) {
//         return next(err);
//       }

//       const $ = cheerio.load(sres.text);
//       let players = [];
//       let datas = [];
//       $('.jiben_title_table .a .x_list').each((idx, item) => {
//         const el = $(item);
//         players.push({
//           no: el.find($('.c1')).text().trim(),
//           name: el.find($('.c2')).text().trim()
//         });
//       });

//       $('.jiben_title_table .b #table_post .x_list').each((idx, item) => {
//         const el = $(item);
//         var data = {};
//         el.each((subId, subItem) => {
//           const subEl = $(subItem);
//           console.log(subEl.find($('.c4'))[0]);
//           data.position = $(subEl.find($('.c4'))[0]).text().trim()
//           data.age = $(subEl.find($('.c4'))[1]).text().trim()
//           data.ballAge = $(subEl.find($('.c4'))[2]).text().trim()
//           data.salary = $(subEl.find($('.c4'))[3]).text().trim()
//           data.height = $(subEl.find($('.c3'))[0]).text().trim()
//           data.weight = $(subEl.find($('.c3'))[1]).text().trim()
//         });
//         datas.push({ data });
//       });

//       players.forEach((item, index) => {
//         item.data = datas[index].data;
//       })

//       res.send(players);
//     })
// });

router.get('/teams', function (req, res, next) {
  superagent.get('https://m.hupu.com/nba/standings')
    .end((err, sres) => {
      if (err) {
        return next(err);
      }

      const $ = cheerio.load(sres.text);
      let players = [];
      console.log($('.table-scroll tbody'));
      $('.table-scroll tbody tr').each((idx, item) => {
        const el = $(item);
        players.push(el.attr('data-href'));
      });

      res.send(players);
    })
});

router.get('/players', function (req, res, next) {
  superagent.get('https://m.hupu.com/nba/teams/celtics/players')
    .end((err, sres) => {
      if (err) {
        return next(err);
      }

      const $ = cheerio.load(sres.text);
      let players = [];
      $('.list li a').each((idx, item) => {
        const el = $(item);
        players.push(el.attr('href'));
      });

      res.send(players);
    })
});

router.get('/playerinfo', function (req, res, next) {
  superagent.get('https://m.hupu.com/nba/teams/celtics/players')
    .end((err, sres) => {
      if (err) {
        return next(err);
      }

      const playerUrls = [];
      const $ = cheerio.load(sres.text);

      $('.list li a').each((idx, item) => {
        const el = $(item);
        playerUrls.push('https:' + el.attr('href'));
      });

      async.mapLimit(playerUrls, 5, function (url, callback) {
        superagent.get(url)
          .end((err, res) => {
            const html = res.text;
            const $ = cheerio.load(html);

            const playObj = {};

            const infoLiDom = $('.info .detail li');
            const bodyListDom = $('.body-list .num span');
            const infoTableDom = $('.info-list tr');

            playObj.id = url.replace(/[^\d]/ig, '');
            playObj.name = infoLiDom.eq(0).children('span').eq(0).text().trim();
            playObj.eg_name = infoLiDom.eq(0).children('span').eq(1).text().trim();
            playObj.no = infoLiDom.eq(1).children('span').eq(1).text().trim().replace(/[^\d]/ig, '');
            playObj.age = infoLiDom.eq(2).children('span').eq(0).text().trim().replace(/[^\d]/ig, '');
            playObj.position = infoLiDom.eq(2).children('span').eq(1).text().trim();

            playObj.height = bodyListDom.eq(0).contents().filter(function () { return this.nodeType === 3 }).text().trim();
            playObj.wingspan = bodyListDom.eq(1).contents().filter(function () { return this.nodeType === 3 }).text().trim();
            playObj.standreach = bodyListDom.eq(2).contents().filter(function () { return this.nodeType === 3 }).text().trim();
            playObj.weight = bodyListDom.eq(3).contents().filter(function () { return this.nodeType === 3 }).text().trim();

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
        res.send(result);
      });
    });
});

module.exports = router;

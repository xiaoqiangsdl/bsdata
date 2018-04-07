const fs=require('fs');
const path=require('path');

const cheerio = require('cheerio');
const superagent = require('superagent');

superagent.get('https://m.hupu.com/nba/standings')
	.end((err, sres) => {
		if (err) {
			return next(err);
		}

		const $ = cheerio.load(sres.text);
		let teamUrl = [];

		$('.table-scroll tbody tr').each((idx, item) => {
			const el = $(item);
			teamUrl.push('https:' + el.attr('data-href'));
		});

		console.log('数据处理完成!!!');
  		console.log('总共抓取的球队链接: ' + teamUrl.length);
		fs.writeFileSync(path.join(process.cwd(), 'data/teamUrl.json'), JSON.stringify(teamUrl));
	});
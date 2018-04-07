const async = require('async');

const Player = require('../model/player');
const playerData = require('../data/playerData');

// const record = Player.build({
//   id: 10,
//   name: '测试',
//   born: '213123'
// });

// record.insert(function (err, record) {
//   if (err) {
//     console.log(err);
//     process.exit(4);
//   }

//   console.log('插入成功');
//   process.exit(0);
// });

async.every(playerData, function (data, callback) {

  const record = Player.build(data);
  
  record.save(function (err, record) {
    if (err) {
      console.log(err);
    }
  
    callback(null);
  });
}, function (err, result) {
  if (err) {
    console.log(err);
    process.exit(4);
  }

  console.log('数据导入数据库成功！');
  process.exit(0);
});

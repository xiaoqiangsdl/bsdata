const T = require('toshihiko');

const options = {           // options for MySQL
    username: 'root',
    password: '602196490',
    database: 'nba',
    host: 'localhost',
    port: 3306,
    charset: 'utf8mb4_bin',
    connectionLimit: 10
};

const toshihiko = new T.Toshihiko('mysql', options);

module.exports = toshihiko;
const T = require('toshihiko');
const toshihiko = require("./connect");

const Player = toshihiko.define('players', [
    { name: 'id', column: 'id', type: T.Type.Integer, primaryKey: true },
    { name: 'name', column: 'name', type: T.Type.String },
    { name: 'eg_name', column: 'eg_name', type: T.Type.String },
    { name: 'age', column: 'age', type: T.Type.Integer },
    { name: 'born', column: 'born', type: T.Type.String },
    { name: 'height', column: 'height', type: T.Type.Float },
    { name: 'weight', column: 'weight', type: T.Type.Float },
    { name: 'wingspan', column: 'wingspan', type: T.Type.Float },
    { name: 'standreach', column: 'standreach', type: T.Type.Float },
    { name: 'position', column: 'position', type: T.Type.String },
    { name: 'no', column: 'no', type: T.Type.Integer },
    { name: 'draft', column: 'draft', type: T.Type.String },
    { name: 'salary', column: 'salary', type: T.Type.Float },
    { name: 'nationality', column: 'nationality', type: T.Type.String },
    { name: 'team', column: 'team', type: T.Type.String }
]);

module.exports = Player;
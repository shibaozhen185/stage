var Sequelize = require('sequelize');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var config = require('../config.json');

var app = config.db
var excludes = ['.', 'Connection.js', 'types'];


var sequelize = new Sequelize(app.database, app.user, app.password, {
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    host: app.host
})

var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return _.indexOf(excludes, file) < 0;
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



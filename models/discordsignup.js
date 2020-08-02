var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dsignups = new Schema({
  id          : String,
  time           : String,
  username        : String,
  did           : String
});

module.exports = mongoose.model('discord', dsignups);
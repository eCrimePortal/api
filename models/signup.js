var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var signups = new Schema({
  email          : String,
  time           : String
});

module.exports = mongoose.model('betasignups', signups);
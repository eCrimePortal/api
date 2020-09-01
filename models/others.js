var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var signups = new Schema({
  ip             : String,
  name           : String
});

module.exports = mongoose.model('others', signups);
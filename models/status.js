var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var signups = new Schema({
  name          : String,
  uptime        : Array
});

module.exports = mongoose.model('status', signups);
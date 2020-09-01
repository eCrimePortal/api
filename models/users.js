var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var signups = new Schema({
  key          : String,
  calls        : String,
  limit        : String,
  permission   : String,
  email        : String
});

module.exports = mongoose.model('users', signups);
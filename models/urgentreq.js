var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reqs = new Schema({
  name          : String,
  email         : String,
  status        : String,
  staff         : String,
  time          : String,
  uid           : String,
  message       : String,
  subject        : String
});

module.exports = mongoose.model('urgents', reqs );
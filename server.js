// Calling all the required modules
require('dotenv').config()
const mongoose = require('mongoose');
var supr = require('./routes/signup');
var rqs = require('./routes/request');
var fet = require('./routes/fetch');
var rurg = require('./routes/rurgent');
// const ipfilter = require('express-ipfilter').IpFilter
// const IpDeniedError = require('express-ipfilter').IpDeniedError;
const express = require("express");
const app = express();
// const ips = process.env.ips.split(' ');

mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db=mongoose.connection;
db.on('error', console.log.bind(console, "Could not connect to the database!"));
db.once('open', function(callback){
    console.log("Connected to the database!");
});
// Root directory to display one single line!
app.get("/", (request, response) => {
  response.send("Welcome to the E-Crime Portal API (ALPHA).")
});
app.use('/fetch'/*, ipfilter(ips, { mode: 'allow' })*/, fet);
// if (app.get('env') === 'development') {
//   app.use((err, req, res, _next) => {
//     res.status(400).send({
//       message: "We are terribly sorry but you can not access the API directly. Apply for access at https://ecrime.xyz/API"
//     });
//   });
// }
app.use('/request', rqs)
app.use('/beta', supr)
app.use('/urgent', rurg)
// listen for requests
const listener = app.listen(process.env.port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
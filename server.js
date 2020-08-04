// Calling all the required modules
require('dotenv').config()
const mongoose = require('mongoose');
var supr = require('./routes/signup');
var rqs = require('./routes/request');
var rurg = require('./routes/rurgent');
const express = require("express");
const app = express();

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
app.use('/request', rqs)
app.use('/beta', supr)
app.use('/urgent', rurg)
app.use(function(req, res) {
  res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.locals.four = req.url;
  res.status(404).send({message: "Resource not found!"});
});
app.use(function(err, req, res, next) {
res.status(500).send({message: "Server Error!"});
});
// listen for requests
const listener = app.listen(process.env.port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
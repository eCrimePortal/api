// Calling all the required modules
require("dotenv").config();
const log = require("./handlers/logHandler");
const fs = require("fs");
const routes = fs
  .readdirSync(__dirname + "/routes")
  .filter((file) => file.endsWith(".js"));
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const users = require("./models/users");
const others = require("./models/others");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.log.bind(console, "Could not connect to the database!"));
db.once("open", function (callback) {
  log.info("Connected to MongoDB!", true);
});
app.get("/", (request, response) => {
  response.json({ message: "Welcome to the eCrimePortal API." });
  setInterval(async function () {
    const us = await users.find();
    us.forEach(async (user) => {
      const u = await users.findOne({ key: `${user.key}` });
      u.calls = 0;
      await u.save();
      log.info("Refreshed the call limit for all users.");
    });
  }, 3600000);
});
app.use(async function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: "Bad request" });
  }
  const auth = await users.findOne({ key: req.headers.authorization });
  if (!auth) {
    return res.status(403).json({ message: "Invalid key" });
  }
  if (auth.permission === "8") {
    return next();
  }
  if (parseInt(auth.calls) >= parseInt(auth.limit)) {
    return res.status(429).json({ message: "Exceeded your rate limit" });
  }

  var curcalls = parseInt(auth.calls);
  console.log(curcalls);
  auth.calls = curcalls + 1;
  await auth.save();
  next();
});
app.use(async function (req, res, next) {
  const ipauth = await others.findOne({ ip: req.connection.remoteAddress });
  console.log(req.connection.remoteAddress);
  if (!ipauth) {
    return res.status(403).json({ message: "The API is IP whitelisted" });
  }
  next();
});
for (const route of routes) {
  var x = route.slice(0, -3);
  var name = require(__dirname + "/routes/" + route);
  log.info(`Loaded route ${x}`);
  app.use("/" + x, name);
}
app.use(function (req, res) {
  res.status(404).send({ message: "Resource not found!" });
});
app.use(function (err, req, res, next) {
  res.status(500).send({ message: "Server Error!" });
});
// listen for requests
const listener = app.listen(process.env.port, () => {
  log.info("API is online on port " + listener.address().port, true);
});

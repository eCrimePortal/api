const express = require("express");
var bodyParser = require("body-parser");
var router = express.Router()
const ips = process.env.ips.split(' ');
var sups = require('../models/signup')
var dsups = require('../models/discordsignup')
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.get("/email",
async (req, res) => {
  if (!ips.includes(req.connection.remoteAddress)) {
    res.status(401).send({"message": "IP blocked!"})
    return;
  }
      const posts = await sups.find({});
      res.send(posts);
    });
router.get("/discord",
async (req, res) => {
  if (!ips.includes(req.connection.remoteAddress)) {
    res.status(401).send({"message": "IP blocked!"})
    return;
  }
      const posts = await dsups.find({});
      res.send(posts);
    });
    router.post("/email", async (req,res) => {
      var reqemail = req.body.email;
      var testmail = emailRegexp.test(reqemail);
      console.log(testmail)
      if (testmail === false) {
          res.status(400).send({"message": "Bad Request"})
          return;
      }
      const nrq = new reqs ({
          "email": req.body.email,
          "time": Math.floor(new Date() / 1000),
        })
      if (!req.body.email) {res.status(400).send({"message": "Bad Request"}); return;}
      nrq.save(function (error, document) {
        if (error) console.error(error)
        res.status(201).send(document)
      })
    });
    router.post("/discord", async (req,res) => {
      const nrq = new reqs ({
          "username": req.body.username,
          "did": req.body.did,
          "time": Math.floor(new Date() / 1000),
        })
      if (!req.body.did) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.username) {res.status(400).send({"message": "Bad Request"}); return;}
      nrq.save(function (error, document) {
        if (error) console.error(error)
        res.status(201).send(document)
      })
    });

  router.delete("/email", async (req,res) => {
    if (!req.body.email) {res.status(400).send({"message": "Bad Request"}); return;}
    var chc = await sups.findOne({ email: req.body.email })
    if (chc === null) {
      res.sendStatus(204);
      return;}
    const doc = await sups.deleteOne({ email: req.body.email })
    res.status(200).send({"message": "Deleted"})
  });
  router.delete("/discord", async (req,res) => {
    if (!req.body.did) {res.status(400).send({"message": "Bad Request"}); return;}
    var chc = await dsups.findOne({ did: req.body.did })
    if (chc === null) {
      res.sendStatus(204);
      return;}
    const doc = await dsups.deleteOne({ did: req.body.did })
    res.status(200).send({"message": "Deleted"})
  });
module.exports = router;
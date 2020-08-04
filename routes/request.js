require('dotenv').config()
const express = require("express");
const short = require("shortid");
var bodyParser = require("body-parser");
var router = express.Router()
const ips = process.env.ips.split(' ');
var reqs = require('../models/reqs')
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.get("/",
async (req, res) => {
  if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;}
  const rus = await reqs.findOne({ uid: req.body.uid })
  if (!await reqs.findOne({ uid: req.body.uid })) {res.sendStatus(204); return;}
      res.status(200).send(rus);
    });
router.get("/all",
async (req, res) => {
  if (!ips.includes(req.connection.remoteAddress)) {
    res.status(401).send({"message": "IP blocked!"})
    return;
  }
      const posts = await reqs.find({});
      res.send(posts);
    });
router.post("/", async (req,res) => {
    var reqemail = req.body.email;
    var testmail = emailRegexp.test(reqemail);
    let uid = short.generate()
    console.log(testmail)
    if (testmail === false) {
        res.status(400).send({"message": "Bad Request"})
        return;
    }
    const nrq = new reqs ({
        "name": req.body.name,
        "email": req.body.email,
        "status": null,
        "staff": null,
        "time": Math.floor(new Date() / 1000),
        "uid": uid,
        "message": req.body.message,
        "subject": req.body.subject
      })
    if (!req.body.name) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.email) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.message) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.subject) {res.status(400).send({"message": "Bad Request"}); return;}
    nrq.save(function (error, document) {
      if (error) console.error(error)
      res.status(201).send(document)
    })
  });
  router.patch("/", async (req,res) => {
    if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.staff) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.status) {res.status(400).send({"message": "Bad Request"}); return;}
    const rus = await reqs.findOne({ uid: req.body.uid })
    console.log(rus)
    if (!rus) {res.sendStatus(204); return;}
    rus.status = req.body.status;
    rus.staff = req.body.staff;
    const doc = await rus.save()
    res.status(226).send(doc)
  });
  router.delete("/", async (req,res) => {
    if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;}
    var chc = await reqs.findOne({ uid: req.body.uid })
    if (chc === null) {
      res.sendStatus(204);
      return;}
    const doc = await reqs.deleteOne({ uid: req.body.uid })
    res.status(200).send({"message": "Deleted"})
  });
module.exports = router;
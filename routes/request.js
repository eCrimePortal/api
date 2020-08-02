require('dotenv').config()
const express = require("express");
const short = require("shortid");
var bodyParser = require("body-parser");
var router = express.Router()
var reqs = require('../models/reqs')
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.post("/new", async (req,res) => {
    var testmail = emailRegexp.test(reqemail);
    if (testmail = false) {
        res.send("That is not a valid E-Mail!")
        return;
    }
    var data = {
        "name": req.body.name,
        "email": req.body.email,
        "status": "NOT ASSIGNED",
        "staff": null,
        "time": Math.floor(new Date() / 1000),
        "uid": short.generate(),
        "message": req.body.message,
        "subject": req.body.subject        
    }
    if (!req.body.name) {res.send("Name field is missing!"); return;} if (!req.body.email) {res.send("E-Mail field is missing!"); return;} if (!req.body.message) {res.send("Message field is missing!"); return;} if (!req.body.subject) {res.send("Subject field is missing!"); return;}
    reqs.create(data,function(err, collection){
      if (err) throw err;
      console.log("Request logged!");
  });
res.send("You have successfully signed logged a request!")
  });
  router.post("/assign", async (req,res) => {
    if (!req.body.uid) {res.send("UID field is missing!"); return;} if (!req.body.staff) {res.send("Name field is missing!"); return;} if (!req.body.status) {res.send("E-Mail field is missing!"); return;}
    const chn = await reqs.findOne({ uid: req.body.uid })
    chn.status = req.body.status;
    chn.staff = req.body.staff;
    const doc = await reqs.save()
    res.send(doc)
  });
  router.delete("/delete", async (req,res) => {
    if (!req.body.uid) {res.send("UID field is missing!"); return;} if (!req.body.staff) {res.send("Name field is missing!"); return;} if (!req.body.status) {res.send("E-Mail field is missing!"); return;}
    const doc = await reqs.deleteOne({ uid: req.body.uid })
    res.send("OK")
  });
module.exports = router;

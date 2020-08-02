const express = require("express");
var bodyParser = require("body-parser");
var router = express.Router()
var sups = require('../models/signup')
var dsups = require('../models/discordsignup')
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.post("/signup", async (req,res) => {
  if(req.body.did) {
    var data = {
      "discord": "true",
      "did": req.body.did,
      "username": req.body.username,
      "time": Math.floor(new Date() / 1000)
    }
    if (await dsups.findOne({ did: req.body.did })) {
      res.send("Seems like you have already signed up to recieve an update!")
  } else {
    dsups.create(data,function(err, collection){
      if (err) throw err;
      console.log("BETA request logged!");
  });
res.send("You have successfully signed up to receive the BETA RELEASE update!")
}
  } else {
    var data = {
      "email" :req.body.email,
      "time": Math.floor(new Date() / 1000)
    }
    var reqemail = req.body.email
    var testmail = emailRegexp.test(reqemail);
    if (testmail === true) {
      if (await sups.findOne({ email: req.body.email })) {
      res.send("Seems like you have already signed up to recieve an update!")
     } else {
      sups.create(data,function(err, collection){
      if (err) throw err;
      console.log("BETA request logged!");
      });
    res.send("You have successfully signed up to receive the BETA RELEASE update!")
} } else {
  res.send("Not a valid E-Mail!")
}
  };
  });

  router.delete("/signup", async (req,res) => {
    if(req.body.did) {
      if (!await dsups.findOne({ did: req.body.did })) {
        res.send("You are not subscribed!")
    } else {
        var deleted = await dsups.findOneAndDelete({ did: req.body.did })
  res.send("You have successfully withdrawn yourself from recieving future updates!")
  }
    } else {
        if (!await sups.findOne({ email: req.body.email })) {
        res.send("You are not subscribed!")
       } else {
        var deleted = await dsups.findOneAndDelete({ email: req.body.email })
      res.send("You have successfully withdrawn yourself from recieving future updates!")
  }
    };
    });
module.exports = router;
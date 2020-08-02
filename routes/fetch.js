const express = require("express");
var router = express.Router()
var reqs = require('../models/reqs')
var sups = require('../models/signup')
var dsups = require('../models/discordsignup')
var ureqs = require('../models/urgentreq')

router.get("/subscribed/email",
async (req, res) => {
      const posts = await sups.find({});
      res.send(posts);
    });
router.get("/subscribed/discord",
async (req, res) => {
      const posts = await dsups.find({});
      res.send(posts);
    });
router.get("/requests/normal",
async (req, res) => {
      const posts = await reqs.find({});
      res.send(posts);
    });
router.get("/requests/urgent",
async (req, res) => {
      const posts = await ureqs.find({});
      res.send(posts);
    });    
module.exports = router;
require('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client()
const express = require("express");
const short = require("shortid");
var bodyParser = require("body-parser");
const ips = process.env.ips.split(' ');
var router = express.Router()
var reqs = require('../models/urgentreq')
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
    client.channels.cache.get(process.env.schan).send({embed: {
      color: 16722474,
      author: {
        name: `User: ${req.auth.user}`
      },
      title: "All urgent data fetch request denied!",
      timestamp: new Date,
      description: `All user data has been fetch request has been denied! Ignore this message if you requested it.`,
      footer: {
        text: `Requested from ${req.connection.remoteAddress}`
      }
    }})
    res.status(401).send({"message": "IP blocked!"})
    return;
  }
      const posts = await reqs.find({});
      res.send(posts);
      client.channels.cache.get(process.env.schan).send({embed: {
        color: 16722474,
        author: {
          name: `User: ${req.auth.user}`
        },
        title: "All urgent data fetched!",
        timestamp: new Date,
        description: `All user data has been fetched! Ignore this message if you requested it.`,
        footer: {
          text: `Requested from ${req.connection.remoteAddress}`
        }
      }})
    });
router.post("/", async (req,res) => {
    var reqemail = req.body.email;
    var time = Math.floor(new Date() / 1000)
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
      client.channels.cache.get(process.env.schan).send({embed: {
        color: 15723317,
        author: {
          name: `UID: ${uid}`
        },
        title: "New Urgent Request!",
        timestamp: new Date(),
        description: `Raw data: \`\`\`${JSON.stringify(nrq)}\`\`\``,
        fields: [{
          name: "Name",
          value: req.body.name,
          inline: true
        },
        {
          name: "E-Mail",
          value: req.body.email,
          inline: true
        },
        {
          name: "Subject",
          value: req.body.subject,
          inline: true
        },
        {
          name: "Message",
          value: req.body.message,
          inline: true
        },
        {
          name: "Time",
          value: time,
          inline: true
        }
      ],
        footer: {
          text: `Requested by ${req.auth.user} from ${req.connection.remoteAddress}`
        }
      }})
  });
  router.patch("/", async (req,res) => {
    if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.staff) {res.status(400).send({"message": "Bad Request"}); return;} if (!req.body.status) {res.status(400).send({"message": "Bad Request"}); return;}
    const rus = await reqs.findOne({ uid: req.body.uid })
    if (!rus) {res.sendStatus(204); return;}
    rus.status = req.body.status;
    rus.staff = req.body.staff;
    const doc = await rus.save()
    client.channels.cache.get(process.env.schan).send({embed: {
      color: 15723317,
      author: {
        name: `UID: ${doc.uid}`
      },
      title: "Urgent Request Assigned!",
      timestamp: new Date(),
      description: `Raw data: \`\`\`${JSON.stringify(doc)}\`\`\``,
      fields: [{
        name: "Name",
        value: doc.name,
        inline: true
      },
      {
        name: "E-Mail",
        value: doc.email,
        inline: true
      },
      {
        name: "Subject",
        value: doc.subject,
        inline: true
      },
      {
        name: "Message",
        value: doc.message,
        inline: true
      },
      {
        name: "Staff Member",
        value: doc.staff,
        inline: true
      },
      {
        name: "Status",
        value: doc.status,
        inline: true
      },
      {
        name: "Time",
        value: doc.time,
        inline: true
      }
    ],
      footer: {
        text: `Requested by ${req.auth.user} from ${req.connection.remoteAddress}`
      }
    }})
    res.status(226).send(doc)
  });
  router.delete("/", async (req,res) => {
    if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;}
    var isit = await reqs.findOne({ uid: req.body.uid })
    if (!isit) {res.sendStatus(204); return;}
    const doc = await reqs.deleteOne({ uid: req.body.uid })
    client.channels.cache.get(process.env.schan).send({embed: {
      color: 15723317,
      author: {
        name: `UID: ${isit.uid}`
      },
      title: "Urgent Request Deleted!",
      timestamp: new Date(),
      description: `Raw data: \`\`\`${JSON.stringify(isit)}\`\`\``,
      fields: [{
        name: "Name",
        value: isit.name,
        inline: true
      },
      {
        name: "E-Mail",
        value: isit.email,
        inline: true
      },
      {
        name: "Subject",
        value: isit.subject,
        inline: true
      },
      {
        name: "Message",
        value: isit.message,
        inline: true
      },
      {
        name: "Time",
        value: isit.time,
        inline: true
      }
    ],
      footer: {
        text: `Requested by ${req.auth.user} from ${req.connection.remoteAddress}`
      }
    }})
    res.status(200).send({"message": "Deleted"})
  });
  client.once("ready", () => {
    console.log("Discord integration is working!")
    })
    client.login(process.env.token)
module.exports = router;
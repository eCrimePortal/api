require("dotenv").config();
const express = require("express");
var router = express.Router();
const resh = require("../handlers/responseHandler");
const client = require("../src/discord");

router.get("/", async (req, res) => {
  const tl = await client.channels.cache
    .get("748024095450464267")
    .messages.fetch(
      client.channels.cache.get("748024095450464267").lastMessageID
    );
  res.json(JSON.parse(tl.content));
});

router.post("/suggest", async (req, res) => {
  if (!req.body.email || !req.body.suggestion) {
    res.status(400).send({ message: "Bad request" });
    return resh.br("Bad request made at " + req.originalUrl, true);
  }
  client.channels.cache.get("748103907628154930").send({
    embed: {
      title: "CNSP TL Suggestion",
      description: `\`\`\`${req.body.suggestion}\`\`\``,
      footer: {
        text: `By: ${req.body.email}`,
      }
    }
  });
  res
    .status(201)
    .send({
      message:
        "Your suggestion has been recorded! An administrator will review it soon.",
    });
});

router.post("");

module.exports = router;

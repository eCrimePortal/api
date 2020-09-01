require("dotenv").config();
const express = require("express");
var router = express.Router();
const lists = require("../models/newsletter");
const users = require("../models/users");
router.get("/", async (req, res) => {
  const user = await users.findOne({ key: req.headers.authorization });
  if (user.permissionlevel !== "8") {
    return res
      .status(403)
      .json({ error: "You are not authorized to access this resource" });
  }
  res.json({ list: await lists.findOne({ key: req.headers.authorization }) });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
var router = express.Router();
const resh = require("../handlers/responseHandler");
const users = require("../models/users");
router.get("/", async (req, res) => {
  const user = await users.findOne({ key: req.headers.authorization });
  res.json({ calls: user.calls, permissionlevel: user.permissionlevel });
});

module.exports = router;

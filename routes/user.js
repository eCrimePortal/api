require("dotenv").config();
const uuid = require("uuid-with-v6");
const express = require("express");
var router = express.Router();
const user = require("../handlers/userHandler");
const users = require("../models/users");

router.get("/", async (req, res) => {
  const user = await users.findOne({ key: req.headers.authorization });
  res.json({ user });
});

router.post("/", async (req, res) => {
  const permission = await user.permission(req.headers.authorization);
  if (permission != "8") {
    return res.status(403).json({ message: "Permission level not met" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "Bad request" });
  }
  const data = await users.create({
    key: uuid.v6(),
    permission: req.body.permissionlevel || 0,
    calls: 0,
    limit: req.body.limit || 300,
    email: req.body.email,
  });
  res.status(201).json({ data });
});

router.patch("/", async (req, res) => {
  const permission = await user.permission(req.headers.authorization);
  if (permission != "8") {
    return res.status(403).json({ message: "Permission level not met" });
  }

  if (req.body.email) {
    const one = await users.findOne({ email: req.body.email });
    one.email = req.body.email || one.email;
    one.limit = req.body.limit || one.limit;
    one.permission = req.body.permissionlevel || one.permission;
    const doc = one.save();
    return res.status(200).json({ doc });
  }

  if (req.body.key) {
    const one = await users.findOne({ key: req.body.key });
    one.email = req.body.email || one.email;
    one.limit = req.body.limit || one.limit;
    one.permission = req.body.permissionlevel || one.permission;
    const doc = one.save();
    return res.status(200).json({ doc });
  }
  res.status(400).json({ message: "Bad request" });
});

router.delete("/", async (req, res) => {
  const permission = await user.permission(req.headers.authorization);
  if (permission != "8") {
    return res.status(403).json({ message: "Permission level not met" });
  }
  if (req.body.email) {
    await users.findOneAndDelete({ email: req.body.email });
    return res.status(202);
  }

  if (req.body.key) {
    await users.findOneAndDelete({ key: req.body.key });
    return res.status(202);
  }
  res.status(400).json({ message: "Bad request" });
});

module.exports = router;

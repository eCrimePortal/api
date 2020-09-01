const users = require("../models/users");

exports.user = async (expkey) => {
  const user = await users.findOne({ key: expkey });
  return user;
};
exports.permission = async (expkey) => {
  const user = await users.findOne({ key: expkey });
  return user.permission;
};
exports.limits = async (expkey) => {
  const user = await users.findOne({ key: expkey });
  return user.limits;
};
exports.calls = async (expkey) => {
  const user = await users.findOne({ key: expkey });
  return user.calls;
};
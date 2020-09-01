const discord = require("discord.js"),
  client = new discord.Client(),
  log = require("../handlers/logHandler");

client.once("ready", () => {
  log.info("Discord Module is ready!", true);
});

client.login(process.env.token).catch((e) => {
  log.error(e, true);
});

module.exports = client;
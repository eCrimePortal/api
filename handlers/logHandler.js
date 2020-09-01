require("dotenv").config();

const request = require("request");

async function webhook(body, title, color) {
  request({
    method: "post",
    json: true,
    url: process.env.webhook,
    body: {
      embeds: [{ rich: "true", color: color, title: title, description: `\`\`\`${body}\`\`\`` }],
    },
  });
}

exports.info = (infolog, discord) => {
  console.log(`[INFO]: ${infolog}`);
  if (discord) {
    webhook(infolog, "Information Log (API)", "15662848");
  }
};

exports.error = (errlog, discord) => {
  console.log(`[ERROR]: ${errlog}`);
  if (discord) {
    webhook(errlog, "Error Log (API)", "16711680");
  }
};

exports.warn = (warnlog, discord) => {
  console.log(`[WARNING]: ${warnlog}`);
  if (discord) {
    webhook(warnlog, "Warn Log (API)", "16752640");
  }
};

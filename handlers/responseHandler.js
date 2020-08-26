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

exports.nf = (nfres, discord) => {
  console.log(`[Not Found]: ${nfres}`);
  if (discord) {
    webhook(nfres, "Not Found (API)", "16711680");
  }
};

exports.br = (brres, discord) => {
  console.log(`[Bad Request]: ${brres}`);
  if (discord) {
    webhook(brres, "Bad Request (API)", "16711680");
  }
};

exports.ise = (iseres, discord) => {
  console.log(`[Internal Server Error]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Internal Server Error (API)", "16711680");
  }
};
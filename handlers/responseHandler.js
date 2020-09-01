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

exports.s404 = (nfres, discord) => {
  console.log(`[Not Found]: ${nfres}`);
  if (discord) {
    webhook(nfres, "Not Found (API)", "16711680");
  }
};

exports.s400 = (brres, discord) => {
  console.log(`[Bad Request]: ${brres}`);
  if (discord) {
    webhook(brres, "Bad Request (API)", "16711680");
  }
};

exports.s500 = (iseres, discord) => {
  console.log(`[Internal Server Error]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Internal Server Error (API)", "16711680");
  }
};

exports.s201 = (iseres, discord) => {
  console.log(`[Record Created]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Record Created", "16711680");
  }
};

exports.s401 = (iseres, discord) => {
  console.log(`[Unauthorized]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Unauthorized (API)", "16711680");
  }
};

exports.s403 = (iseres, discord) => {
  console.log(`[Forbidden]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Foribidden (API)", "16711680");
  }
};

exports.s429 = (iseres, discord) => {
  console.log(`[Rate Limit Reached]: ${iseres}`);
  if (discord) {
    webhook(iseres, "Rate Limit Reached (API)", "16711680");
  }
};
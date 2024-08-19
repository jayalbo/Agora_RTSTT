require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const LANG_INPUT = process.env.LANG_INPUT
  ? process.env.LANG_INPUT.split(",")
  : "en-US";
const LANG_OUTPUT = process.env.LANG_OUTPUT
  ? process.env.LANG_OUTPUT.split(",")
  : ["en-US"];

console.log(LANG_OUTPUT);
const basicAuth = Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString("base64");

app.use(bodyParser.json());
app.use(express.static("public"));

// Host page
app.get("/host", (req, res) => {
  res.sendFile(__dirname + "/public/host.html");
});

// Audience page
app.get("/audience", (req, res) => {
  res.sendFile(__dirname + "/public/audience.html");
});

// Envvars
app.get("/env", (req, res) => {
  res.send(
    `const langInput = "${LANG_INPUT}";
    const langOutput = ["${LANG_OUTPUT.join('","')}"];`,
  );
});

// API for speech-to-text control
app.post("/api/start", async (req, res) => {
  const CHANNEL_NAME = req.body.channelName;

  const instanceId = Date.now().toString();

  try {
    // Acquire Token
    let acquireTokenResponse = await axios.request({
      method: "post",
      url: `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/builderTokens`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      data: {
        instanceId,
      },
    });

    if (acquireTokenResponse.status !== 200) {
      return res.status(500).send({ error: "Failed to acquire token" });
    }
    const token = acquireTokenResponse.data.tokenName;

    // Start Speech to Text
    let startResponse = await axios.request({
      method: "post",
      url: `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks?builderToken=${token}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      data: {
        languages: [...LANG_INPUT],
        maxIdleTime: 30,
        rtcConfig: {
          channelName: CHANNEL_NAME,
          subBotUid: "1000",
          // subBotToken: null,
          pubBotUid: "1001",
          // pubBotToken: null,
        },
        translateConfig: {
          languages: [
            ...LANG_INPUT.map((lang) => ({
              source: lang,
              target: [...LANG_OUTPUT],
            })),
          ],
        },
      },

      // data: {
      //   audio: {
      //     subscribeSource: "AGORARTC",
      //     agoraRtcConfig: {
      //       channelName: CHANNEL_NAME,
      //       uid: "10000",
      //       channelType: "LIVE_TYPE",
      //       subscribeConfig: {
      //         subscribeMode: "CHANNEL_MODE",
      //       },
      //       maxIdleTime: 10,
      //     },
      //   },
      //   config: {
      //     features: ["RECOGNIZE"],
      //     recognizeConfig: {
      //       language: LANG_INPUT,
      //       model: "Model",
      //       profanityFilter: true,
      //       connectionTimeout: 60,
      //       output: {
      //         destinations: ["AgoraRTCDataStream"],
      //         agoraRTCDataStream: {
      //           channelName: CHANNEL_NAME,
      //           uid: "100001",
      //         },
      //       },
      //     },
      //     translateConfig: {
      //       languages: [
      //         {
      //           source: LANG_INPUT,
      //           target: LANG_OUTPUT,
      //         },
      //       ],
      //     },
      //   },
      // },
    });

    if (startResponse.status !== 200) {
      return res
        .status(500)
        .send({ error: "Failed to start speech-to-text service" });
    }

    // Successful response
    res.send({ message: { token, instanceId, result: startResponse.data } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to start STT due to an error" });
  }
});

app.post("/api/stop", async (req, res) => {
  // Logic to stop STT
  const CHANNEL_NAME = req.body.channelName;
  const token = req.body.RTTToken;
  const taskId = req.body.taskId;
  try {
    let stopResponse = await axios.request({
      method: "delete",
      url: `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${token}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });
    res.send({ message: "STT stopped" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to stop STT due to an error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});

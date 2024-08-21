require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const telnyx = require("telnyx")(process.env.TELNYX_API_KEY);

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/webhook", async (req, res) => {
  const event = req.body.data.event_type;
  const callControlId = req.body.data.payload.call_control_id;

  const call = new telnyx.Call({
    call_control_id: callControlId,
  });

  try {
    switch (event) {
      case "call.initiated":
        call.answer();
        break;

      case "call.answered":
        call.speak({
          payload:
            "Hello Shuaib, this is answer from Toan. Thank you for helping me to do this demo call.",
          voice: "male",
          language: "en-US",
        });
        break;

      case "call.speak.ended":
        console.log("Speak has ended.");
        call.hangup();
        break;

      case "call.hangup":
        console.log("Call has ended.");
        break;

      default:
        console.log("Unhandled event:", event);
    }
  } catch (error) {
    console.log("Error issuing call command");
    console.log(error);
  }

  res.status(200).send("Webhook received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

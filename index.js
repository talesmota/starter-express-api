const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const CLIENT_URL = "mqtt://broker.hivemq.com";
const TOPIC = "WLED-MGiA1nky6h";
const TOKEN = "e0f79dd5-a6de-4e11-9bdf-717fede9ab2d";

const CLIENT = mqtt.connect(CLIENT_URL);

const lightAction = async (req, res) => {
  console.log("INICIANDO...");
  const { func, color, token } = req.query;
  if (token !== TOKEN) {
    return { status: 403, message: "UNAUTHORIZED" };
  }

  if (func !== undefined) {
    console.log("FUNC:", func);

    await CLIENT.publish(TOPIC, func.toString(), { qos: 1 });
    setTimeout(
      async () => await CLIENT.publish(TOPIC, func.toString(), { qos: 1 }),
      2000
    );
  }
  if (color !== undefined) {
    await CLIENT.publish(`${TOPIC}/col`, color.toString(), { qos: 1 });
    setTimeout(
      async () => await CLIENT.publish(TOPIC, func.toString(), { qos: 1 }),
      2000
    );
  }
  return {
    status: 200,
    message: {
      status: "ok",
      color: color !== undefined ? color : "",
      func: func !== undefined ? func : "",
    },
  };
};
app.use(cors());
const app = express();
app.all("/wled", async (req, res) => {
  const response = await lightAction(req, res);
  res.status(response.status).send(response.message);
});
app.post("/wled", async (req, res) => {
  const response = await lightAction(req, res);
  res.status(response.status).send(response.message);
});
app.listen(process.env.PORT || 3000);

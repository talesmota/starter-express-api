const express = require("express");
const mqtt = require("mqtt");

const CLIENT_URL = "mqtt://broker.hivemq.com";
const TOPIC = "WLED-MGiA1nky6h";
const TOKEN = "e0f79dd5-a6de-4e11-9bdf-717fede9ab2d";

const CLIENT = mqtt.connect(CLIENT_URL);

const app = express();
app.all("/wled", async (req, res) => {
  console.log("INICIANDO...");
  const { func, color, token } = req.query;
  if (token !== TOKEN) {
    res.status(403).send("UNAUTHORIZED");
  }

  if (func !== undefined) {
    console.log("FUNC:", func);

    await CLIENT.publish(TOPIC, func.toString(), { qos: 1 });
  }
  if (color !== undefined) {
    await CLIENT.publish(`${TOPIC}/col`, color.toString(), { qos: 1 });
  }
  res.send({
    status: "ok",
    color: color !== undefined ? color : "",
    func: func !== undefined ? func : "",
  });
});
app.listen(process.env.PORT || 3000);

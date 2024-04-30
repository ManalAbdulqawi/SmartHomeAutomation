const axios = require("axios");
const http = require("http");

const express = require("express");

const app = express();
const server = http.createServer(app);
const hueconnectivity = require("../Hue-automation/hue-url.js");

app.use(express.json());

const hueUrl = hueconnectivity.hueUrl;

//request looger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});
// get all the sensors current state
app.get("/devices/sensors", (req, res) => {
  axios.get(`${hueUrl}/sensors`).then((rsp) => {
    const devices = rsp.data;
    res.json({ data: devices });
  });
});
//here get the specefic sensor current state
app.get("/devices/sensors/:deviceId", (req, res) => {
  axios.get(`${hueUrl}/sensors/${req.params.deviceId}`).then((rsp) => {
    const device = rsp.data;
    res.json({ data: device });
  });
});

// get the current state of all the lights
app.get("/devices/lights", (req, res) => {
  axios.get(`${hueUrl}/lights`).then((rsp) => {
    const devices = rsp.data;
    res.json({ data: devices });
  });
});
// get the current state of a specific light
app.get("/devices/lights/:deviceId", (req, res) => {
  axios.get(`${hueUrl}/lights/${req.params.deviceId}`).then((rsp) => {
    const device = rsp.data;
    res.json({ data: device });
  });
});
// turn on or off a specific light by typing in body of the request {"on": true} or {"on": false}
app.put("/devices/lights/:deviceId", async (req, res) => {
  try {
    await axios.put(`${hueUrl}/lights/${req.params.deviceId}/state`, req.body);

    const rsp = await axios.get(`${hueUrl}/lights/${req.params.deviceId}`);
    const device = rsp.data;
    res.json({ data: device });
  } catch (error) {
    console.error("An error occured:", error);
  }
});

//middleware
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
  res.json({ message: err.message });
});

app.listen(7070, () => {
  console.log("lisening to 7070");
});

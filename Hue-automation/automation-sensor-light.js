const mongoose = require("mongoose");
const axios = require("axios");
const http = require("http");

const express = require("express");

const app = express();
const server = http.createServer(app);
// create event instance
const EventEmitter = require("events");
const system = new EventEmitter();
const sensor = new EventEmitter();

let eventstate;

const SystemConDev = require("../Device_Registry_Service/connected.devices.js");
const Eventtriggered = require("../Device_Registry_Service/triggered.event.js");

const hueconnectivity = require("./hue-url.js");
const host = hueconnectivity.host;
const usrename = hueconnectivity.usrename;
const hueUrl = hueconnectivity.hueUrl;
let intervalId; // Declare the interval id variable

//request looger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});

app.put("/devices/state/:onoff", async (req, res) => {
  try {
    eventstate = req.params.onoff;
    let currentstate = "off";

    await mongoose
      .connect(
hueconnectivity.connectionString      )
      .then(() => {
        console.log("Connected to database success");
      })
      .catch(() => {
        console.log("Connected to database failed");
      });

    if (eventstate === "on") {
      currentstate = "active";
      await SystemConDev.updateMany({ currentstates: currentstate });
      const updatedConDev = await SystemConDev.find({});

      res.json({ data: updatedConDev, state: eventstate });
      startPublisher();
    } else {
      await SystemConDev.updateMany({ currentstates: currentstate });
      const updatedConDev = await SystemConDev.find({});

      res.json({ data: updatedConDev, state: eventstate });
      console.log("The system is off");
      stopPublisher();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Event Publisher to turn the system automation on

function startPublisher() {
  if (!intervalId) {
    storetriggered_event("The automation system is turned on");
    intervalId = setInterval(() => {
      system.emit("system-on", "The system is on");
    }, 1000);
  }
}
// Event Publisher to turn the system automation off

function stopPublisher() {
  clearInterval(intervalId);
  storetriggered_event("The automation system is turned off");
  // release our intervalID from the variable

  intervalId = null;
}
// store information about triggered events
async function storetriggered_event(info) {
  const triggeredevent = {
    timeOfEventTriggered: new Date().toString(),
    eventInformation: info,
  };
  try {
    const eventtriggered = await Eventtriggered.create(triggeredevent);
    console.log(triggeredevent);
  } catch (error) {
    console.log({ message: error.message });
  }
}
// Subscriber 1
system.on("system-on", (message) => {
  // when system on observeing the interaction between sensor motion number 1 and other devices interact whith it
  axios.get(`${hueUrl}/sensors/2`).then((rsp) => {
    const device = rsp.data;
    // res.json({ //data: device }); update database if presencse=on to triggered
    console.log(message);
    if (device.state.presence === true) {
      sensor.emit("presence-on", "There is a motion");
    } else {
      sensor.emit("presence-off", "There is no motion");
    }
  });
});
sensor.on("presence-on", (message) => {
  //make the light 1 on when sensor motion 1 presence = true

  applyState(1, { on: true });
  storetriggered_event(
    "The sensor number 2 triggered motion presence-on event to turn on the light number 1 "
  );

  console.log(" " + message);
});

sensor.on("presence-on", (message) => {
  //apply another action when sensor motion 1 presence = true like turn another light on
});

sensor.on("presence-off", (message) => {
  //make the light 1 off when sensor motion 1 presence = false

  applyState(1, { on: false });
  console.log(" " + message);
});

const applyState = (id, state) => {
  axios.put(`${hueUrl}/lights/${id}/state`, state).then((rsp) => {
    axios.get(`${hueUrl}/lights/${id}`).then((rsp) => {});
  });
};

// Subscriber 2
system.on("system-on", () => {
  //another reaction when system on like observing tv and light interaction
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
  res.json({ message: err.message });
});

app.listen(8082, () => {
  console.log("lisening to 8082");
});

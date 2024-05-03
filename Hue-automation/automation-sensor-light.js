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

const SystemConDev = require("./connected.devices.js");
const storetriggeredevent = require("./store.triggered.event.js");

const mongodbconnected = require("./mongodbconnection.js");
const sensor2ligh1event = require("./prsence.event.js");

const hueconnectivity = require("./hue-url.js");
const hueUrl = hueconnectivity.hueUrl;
let intervalId; // Declare the interval id variable
let sensor_2;
let light_1;

//request looger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});

app.put("/devices/state/:onoff", async (req, res) => {
  try {
    eventstate = req.params.onoff;
    let currentstate = "off";
    await mongodbconnected.mongodbconnected();

    if (eventstate === "on") {
      currentstate = "active";
      await SystemConDev.updateMany({ currentstates: currentstate });
      const updatedConDev = await SystemConDev.find({});
      sensor_2 = updatedConDev.find((x) => x.devicename === "S2");
      light_1 = updatedConDev.find((x) => x.devicename === "L1");

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
    storetriggeredevent.storetriggered_event(
      "The automation system is turned on"
    );
    intervalId = setInterval(() => {
      system.emit("system-on", "The system is on");
    }, 5000);
  }
}
// Event Publisher to turn the system automation off

async function stopPublisher() {
  clearInterval(intervalId);
  await storetriggeredevent.storetriggered_event(
    "The automation system is turned off"
  );
  // release our intervalID from the variable

  intervalId = null;
}

// System subscriber 1
system.on("system-on", async (message) => {
  // when system on, observe the interaction between sensor motion number 2 and other devices interact whith it
  if (sensor_2 && light_1) {
    console.log(message);
    // if the motion sensor 2 and light 1 exist in connected device DB exexute the interaction event between them
    await sensor2ligh1event.sensor2light1event();
  } else {console.log("sensor number 2 and/or light number 1 don't not exist");}
});

// System subscriber 2
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

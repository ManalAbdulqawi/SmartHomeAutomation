const mongoose = require("mongoose");
const axios = require("axios");
const EventEmitter = require("events");
const sensor = new EventEmitter();
const mongodbconnected = require("./mongodbconnection.js");
const storetriggeredevent = require("./store.triggered.event.js");
const client = require('prom-client');

const hueconnectivity = require("./hue-url.js");
const hueUrl = hueconnectivity.hueUrl;
let eventfivesecflag = 0;// this variable will store event presense info every five sec

const invokeCounter = new client.Counter({
  name: 'presence_on_true_invocation_count',
  help: 'Number of times there is amotion triggered event',
});
async function sensor2light1event(triggerflag) {
  eventfivesecflag = triggerflag;
  axios.get(`${hueUrl}/sensors/2`).then((rsp) => {
    const device = rsp.data;
    if (device.state.presence === true) {
      sensor.emit("presence-on", "There is a motion");
    } else {
      sensor.emit("presence-off", "There is no motion");
    }
  });
}

sensor.on("presence-on", async (message) => {
  //make the light 1 on when sensor motion 2 presence = true

  {
    console.log(" " + message);
    applyState(1, { on: true });
    if (eventfivesecflag >= 5) {
      invokeCounter.inc();

      await storetriggeredevent.storetriggered_event(
        "The sensor number 2 triggered motion presence-on event to turn on the light number 1"
      );
      eventfivesecflag = 0;
    }
  }
});

sensor.on("presence-on", (message) => {
  //apply another action when sensor motion 2 presence = true like turn another light on
});

sensor.on("presence-off", (message) => {
  //make the light 1 off when sensor motion 2 presence = false
  console.log(" " + message);

  applyState(1, { on: false });
});

const applyState = (id, state) => {
  axios.put(`${hueUrl}/lights/${id}/state`, state).then((rsp) => {
    axios.get(`${hueUrl}/lights/${id}`).then((rsp) => {});
  });
};

module.exports = { sensor2light1event,invokeCounter };

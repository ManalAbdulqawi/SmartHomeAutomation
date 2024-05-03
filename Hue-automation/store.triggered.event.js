const mongoose = require("mongoose");

const Eventtriggered = require("./triggered.event.js");

const mongodbconnected = require("./mongodbconnection.js");

// store information about triggered events
async function storetriggered_event(info) {
    await mongodbconnected.mongodbconnected();

    const triggeredevent = {
      timeOfEventTriggered: new Date().toString(),
      eventInformation: info,
    };
    try {
      const eventtriggered = await Eventtriggered.create(triggeredevent);
      console.log(eventtriggered);
    } catch (error) {
      console.log({ message: error.message });
    }
  }

  module.exports = { storetriggered_event };

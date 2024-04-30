const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  timeOfEventTriggered: {
    type: String,
    required: true,
  },
  eventInformation: {
    type: String,
    required: true,
  },
});

const Eventtriggered = mongoose.model("Eventtriggered", eventSchema);

module.exports = Eventtriggered;

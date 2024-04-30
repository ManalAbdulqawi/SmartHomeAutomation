const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  id: Number,
  state: {
    presence: Boolean,
    lastupdated: String,
  },
  swupdate: {
    state: String,
    lastinstall: String,
  },
  config: {
    on: Boolean,
    battery: Number,
    reachable: Boolean,
    alert: String,
    sensitivity: Number,
    sensitivitymax: Number,
    ledindication: Boolean,
    usertest: Boolean,
    pending: Array,
  },
  name: String,
  type: String,
  modelid: String,
  manufacturername: String,
  productname: String,
  swversion: String,
  uniqueid: String,
  capabilities: {
    certified: Boolean,
    primary: Boolean,
  },
});

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;

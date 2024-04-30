const mongoose = require("mongoose");

const LightSchema = mongoose.Schema({
    id:Number,
  state: {
    on: Boolean,
    bri: Number,
    alert: String,
    mode: String,
    reachable: Boolean,
  },
  swupdate: {
    state: String,
    lastinstall: Date,
  },
  type: String,
  name: String,
  modelid: String,
  manufacturername: String,
  productname: String,
  capabilities: {
    certified: Boolean,
    control: {
      mindimlevel: Number,
      maxlumen: Number,
    },
    streaming: {
      renderer: Boolean,
      proxy: Boolean,
    },
  },
  config: {
    archetype: String,
    function: String,
    direction: String,
    startup: {
      mode: String,
      configured: Boolean,
    },
  },
  uniqueid: String,
  swversion: String,
  swconfigid: String,
  productid: String,
});
const Light = mongoose.model("Light", LightSchema);

module.exports = Light;

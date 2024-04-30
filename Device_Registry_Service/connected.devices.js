const mongoose = require("mongoose");

const condevSchema = new mongoose.Schema({
  id: Number,
  devicename: String,
  devicetype: String,
  deviceproductname: String,
  currentstates: String,
});

const SystemConDev = mongoose.model("SystemConDev", condevSchema);

module.exports = SystemConDev;

const mongoose = require("mongoose");

const hueconnectivity = require("./hue-url.js");
const hueUrl = hueconnectivity.hueUrl;

async function mongodbconnected(){
 await mongoose
          .connect(
    hueconnectivity.connectionString      )
          .then(() => {
            console.log("Connected to database success");
          })
          .catch(() => {
            console.log("Connected to database failed");
          });
    
      } 
      module.exports = { mongodbconnected };

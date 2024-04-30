const express = require("express");
const mongoose = require("mongoose");
const Light = require("./light.device.js");
const Sensor = require("./sensor.device.js");
const ConDev = require("./connected.devices.js");
const Eventtriggered = require("./triggered.event.js");
const connectivty= require("./connectionString.js");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from node API server");
});
// add new light
app.post("/api/lights", async (req, res) => {
  try {
    const light = await Light.create(req.body);
    res.status(200).json(light);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get information about the lights in the system
app.get("/api/lights", async (req, res) => {
  try {
    const light = await Light.find({});
    res.status(200).json(light);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get information about specific light
app.get("/api/lights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const light = await Light.findById(id);

    if (!light) {
      return res.status(404).json({ message: "Light not found" });
    }

    res.status(200).json(light);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete specific light by its id
app.delete("/api/lights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lightdata = await Light.findById(id);

    const light = await Light.findByIdAndDelete(id);
    if (!light) {
      res.status(404).json({ message: "light not found" });
    }
    res.status(200).json(light);
    const idnum = lightdata.id;
    //this function delete light in connected devices table if it is delete in light table
    console.log(await deleteconnecteddevice(idnum));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//update specific light data

app.put("/api/lights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const light = await Light.findByIdAndUpdate(id, req.body);
    if (!light) {
      res.status(404).json({ message: "light not found" });
    }

    const updatedlight = await Light.findById(id);
    res.status(200).json(updatedlight);

    const name = updatedlight.name;
    const idnum = updatedlight.id;
    //this function to update the name of light in connected devices table if it is updated in light table
    console.log(await updatename(name, idnum));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add new sensor
app.post("/api/sensors", async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get information about the sensors in the system
app.get("/api/sensors", async (req, res) => {
  try {
    const sensor = await Sensor.find({});
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get information about specific sensor
app.get("/api/sensors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await Sensor.findById(id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete specific sensor by its id
app.delete("/api/sensors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensordata = await Sensor.findById(id);

    const sensor = await Sensor.findByIdAndDelete(id);
    if (!sensor) {
      res.status(404).json({ message: "sensor not found" });
    }
    res.status(200).json(sensor);
    const idnum = sensordata.id;
    //this function delete sensor in connected devices table if it is deleted in sensor table
    console.log(await deleteconnecteddevice(idnum));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//update specific light data

app.put("/api/sensors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await Sensor.findByIdAndUpdate(id, req.body);
    if (!sensor) {
      res.status(404).json({ message: "sensor not found" });
    }

    const updatedsensor = await Sensor.findById(id);
    res.status(200).json(updatedsensor);
    const name = updatedsensor.name;
    const idnum = updatedsensor.id;
    //this function to update the name of sensor in connected devices table if it is updated in sensor table
    console.log(await updatename(name, idnum));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add connected device to the system
app.post("/api/connecteddevices", async (req, res) => {
  try {
    const condev = await ConDev.create(req.body);
    res.status(200).json(condev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get information about connected devices in the system
app.get("/api/connecteddevices", async (req, res) => {
  try {
    const condev = await ConDev.find({});
    res.status(200).json(condev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//edit connected device
app.put("/api/connecteddevices/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const condev = await ConDev.updateMany({ currentstates: state });
    const updatedcondev = await ConDev.find({});
    res.status(200).json(updatedcondev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/connecteddevices/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const condev = await ConDev.findById(id);

    if (!condev) {
      return res.status(404).json({ message: "Connected device not found" });
    }

    res.status(200).json(condev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get all triggered events information
app.get("/api/triggeredevents", async (req, res) => {
  try {
    const triggeredevents = await Eventtriggered.find({});
    res.status(200).json(triggeredevents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function deleteconnecteddevice(id) {
  try {
    const condevbefor = await ConDev.find({});
    const existdevice = condevbefor.find((x) => x.id === id);
    if (existdevice) {
      const existingId = existdevice._id;
      const condev = await ConDev.findByIdAndDelete(existingId);
    }
    const updatedcondev = await ConDev.find({});
    return updatedcondev;
  } catch (error) {
    return { message: error.message };
  }
}
async function updatename(name, id) {
  try {
    const condevbefor = await ConDev.find({});
    const existname = condevbefor.find((x) => x.id === id);
    if (existname) {
      const existingId = existname._id;
      const condev = await ConDev.findByIdAndUpdate(existingId, {
        devicename: name,
      });
    }
    const updatedcondev = await ConDev.find({});
    return updatedcondev;
  } catch (error) {
    return { message: error.message };
  }
}

//delete specific connected device by its id
app.delete("/api/connecteddevices/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const condev = await ConDev.findByIdAndDelete(id);
    if (!condev) {
      res.status(404).json({ message: "connected device not found" });
    }
    res.status(200).json(condev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
connectivty.connectionString  )
  .then(() => {
    console.log("Connected to database success");
    app.listen(9090, () => {
      console.log("lisening to 9090");
    });
  })
  .catch(() => {
    console.log("Connected to database failed");
  });

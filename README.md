# SmartHome

This core version of the SmartHome application controls and monitors Philips Hue devices, including motion sensors and light bulbs.

## The Application Parts

The application consists of a MongoDB database to manage sensor and light data, controllers for lights and sensors individually, and the automation between the sensors and lights.

### Hardware

Hue candle light bulb
Hue bridge
Hue sensor

### Database

TThe Device_Registry_Service directory contains:

* light.device.js, sensor.device.js, triggered.event.js, and connected.device.js to create Mongoose schema
* index.js to manage inserting, deleting, updating, and retrieving data about lights, sensors, the devices connected to the automation system, and information about the triggered events.

### System Automation

The Hue-automation directory contains:

* Event emitters and their subscribers to turn the automation system on and off.

* Updating the connected devices when the system is active and off when the system is off.

* Event emitters and their subscribers to react when the sensor presence is detected, turning on the light, and turning off the light when the sensor presence is no longer detected. This operation continues while the system is on and stops when the system is off.

*Inserting information about the triggered events and their time into the database.

### Light and Sensor without automation

The Hue-light-sensor directory contains:

* A controller (sensor-light-index.js) to get the current state of the Hue light and sensor without running the automation.

* Ability to turn the light on or off via an HTTP PUT request.

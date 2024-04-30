# SmartHome
This core version of SmartHome application to controle and monitor Philips Hue devices (motion sensor and light bulb).

## The Application Parts
The applicaion contains mongodb database to manage sensor and light data, controler for light and sensor individually and running the automation between the sensor and the light.

### Hardware

Hue candle light bulb, Hue bridge and Hue sensor.

### Database
The Device_Registry_Servic directory contains:

* light.device.js, sensor.device.js, triggered.event.js and connected.device to create mongoose schema

* index.js to manage inserting, deleting, updating and retriving the data about lights, sensors,the devices that are connected to the automation system and infoormation about the events that are triggered from the automation system

### System Automation
The Hue-automation directory contains:
* Event emitters and its subscripers to turn the automation system on and off

* Updating the connected devices when the system on the curren statate is active, and when the system off the current state is off

* Event emitters and its subscribers to react when the sensor presence is on then turn on the light, and when the sensor presence is off then turn the light off. This operation will continue executing while the system is on and will stop when the system is off

* Insert the information about the triggred events and their time in the database

### Light and Sensor without automation
The Hue-light-sensor directory contains:
* A controller (sensor-light-index.js) to get the current state of hue light and sensor without running the automation.
* You can turn the light on or off in by http put request

# SmartHome

This core version of the SmartHome application controls and monitors Philips Hue devices, including motion sensor and light bulb.

## The Application Parts

The application consists of a MongoDB database to manage sensor and light data, controllers for lights and sensors individually, and the automation between the sensors and lights.

### Hardware

* Hue candle light bulb
* Hue bridge
* Hue sensor

### Database

The Device_Registry_Service directory contains:

* light.device.js, sensor.device.js, triggered.event.js, and connected.device.js to create Mongoose schema
* index.js to manage inserting, deleting, updating, and retrieving data about lights, sensors, the devices connected to the automation system, and information about the triggered events.

### System Automation

The Hue-automation directory contains:

* Event emitters and their subscribers to turn the automation system on and off.

* Updating the connected devices when the system is active and off when the system is off.

* Event emitters and their subscribers to react when the sensor presence is detected, turning on the light, and turning off the light when the sensor presence is no longer detected. This operation continues while the system is on and stops when the system is off.

* Inserting information about the triggered events and their time into the database.

### Light and Sensor without automation

The Hue-light-sensor directory contains:

* A controller (sensor-light-index.js) to get the current state of the Hue light and sensor without running the automation.

* Ability to turn the light on or off via an HTTP PUT request.

### Monitoring
For monitoring purposes I have added logs to monitor the system running reaction when presens motion event triggerd by typing this messages when the automation system turned on (The system is on There is a motion), (The system is on There is no motion) and (The system off ) when turn the automation system off.

Addtionally, I have added custom meteics to show how many times the triggered event of prsense-on stored in database every 5 seconds. The custom metrics is in Hue-automation/prsence.event.js, and to expose this custom metrics I have added Hue-automation/kubernetes/auto-service-monitor.yaml. Then I have setup argocd and deployed in argocd namespace Hue-automation/kubernetes and promethues https://prometheus-community.github.io/helm-charts. Then I used grafana to virtualise my custom metrics as it has showen in Screenshots folder.

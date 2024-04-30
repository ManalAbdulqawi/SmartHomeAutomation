const host = "your hue bridge ip address";
const usrename = "your hue bridge user name";
const hueUrl = `${host}/api/${usrename}`;
const connectionString = "your mongodn atlas connection string";
module.exports = { host, usrename, hueUrl, connectionString };

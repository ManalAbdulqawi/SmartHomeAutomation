const host = "your hue bridge ip addres";
const usrename = "your hue bridge username";
const hueUrl = `${host}/api/${usrename}`;
const connectionString = "your cloud mongo db connection string";
module.exports = { host, usrename, hueUrl, connectionString };

"use strict";
const restify = require('restify');
const errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const mongoose = require('mongoose');
const format = require('string-format')
const mqtt = require('mqtt');

const fs = require('fs');
const toml = require('toml');
try {
  const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
} catch (e) {
  console.error("Parsing error on line " + e.line + ", column " + e.column +
    ": " + e.message);
}


const client = mqtt.connect('mqtt://{hostname}'.format(config.mqtt), { username: config.mqtt.username, password: config.mqtt.password });
mongoose.connect('mongodb://{username}:{password}@{hostname}:{port}/{database}'.format(config.mongodb));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongodb');
});

client.on('connect', () => {
  console.log('connected to broker');
  //client.subscribe('gps-data-testiot/update');
  //Subscribe to all the topics
  //Each device has 1 unique topic
  //So fetch all devices from mongodb and subscribe
  DeviceModel.find({},
    function(err, device) {
      if (err) return console.error(err);
      client.subscribe(device.topic);
    }
  )
});

client.on('message', (topic, message) => {
  console.log(message.toString());
  
      let data = message.toString().split(',');
      if (data[0] != 'P') return;
      let location = new GPSModel({
        device_id: topic,
        latitude: data[1],
        longitude: data[2],
        speed: data[3],
        heading: data[4],
        altitude: data[5],
        date_added: new Date().toISOString()
      });
      location.save(function(err, saved) {
        if (err) return console.error(err);
      });
      return () => console.log(message);
  console.log('No handler for topic %s', topic);
});

const GPSData = new mongoose.Schema({
  device_id: String,
  latitude: Number,
  longitude: Number,
  speed: Number,
  heading: Number,
  altitude: Number,
  date_added: Date
});
const GPSModel = mongoose.model('people', GPSData, 'peoples1');

const DeviceSchema = new mongoose.Schema({
  topic: String
});
const DeviceModel = mongoose.model('device', GPSData, 'devices');

const server = restify.createServer({
  name: 'restify headstart'
});

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['X-App-Version'],
  exposeHeaders: []
});

server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

server.pre((req, res, next) => {
  console.info(`${req.method} - ${req.url}`);
  if(req.header('Token') === config.panel.token)
  return next();
  else
  return "Error: Not authenticated";
});

server.put('/device/:id', (req, res, next) =>
{
  const deviceId = req.params.id;
  let newDevice = new DeviceModel({
    topic: deviceId
  });

  newDevice.save((err, saved) => {
    if(err) console.log(err);
  });

  return next();
});

server.get('/device/:id/info', (req, res, next) => {
  const deviceId = req.params.id;

  DeviceModel.findOne({ deviceId }, (err, device) => {
    if(err) console.log(err);
    res.send(200, device);
  });

  return next();
});

server.get('/device/:id/path/from/:startDate/to/:endDate', (req, res, next) =>
{
  const deviceId = req.params.id;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  try {
    GPSModel.find(
      { device_id: deviceId,
        date_added: { $gt: startDate, $lt: endDate }},
        function(err, locations) {
        if (err) return console.error(err);
        res.send(200, locations);
      }
    );

    return next();
  } catch (error) {
    return next(new errors.NotFoundError(error));
  }

  return next();
});

server.del('/device/:id', (req, res, next) =>
{
  const deviceId = req.params.id;
  GPSModel.deleteMany({ device_id: deviceId }, function (err) {
    if (err) return console.log(err);
    // deleted at most one tank document
  });

  //Should delete the device from the device list (which doesn't exist yet)
  DeviceModel.deleteOne({ device_id: deviceId }, function (err) {
    if (err) return console.log(err);
    // deleted at most one tank document
  });
  return next();
});

server.get('/locations', (req, res, next) => {
  try {
    GPSModel.find(
      {},
      null,
      {
        limit: 10,
        sort: {
          date_added: -1 //Sort by Date Added DESC
        }
      },
      function(err, locations) {
        if (err) return console.error(err);
        res.send(200, locations);
      }
    ).sort;

    return next();
  } catch (error) {
    return next(new errors.NotFoundError(error));
  }
});

server.listen(config.panel.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

const restify = require('restify');
const errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');
const port = process.env.PORT || 8080;

mongoose.connect('mongodb://test:testtest1@ds255958.mlab.com:55958/gps-data');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongodb');
});

client.on('connect', () => {
  console.log('connected to broker');
  client.subscribe('gps-data-testiot/update');
});

client.on('message', (topic, message) => {
  console.log(message.toString());
  switch (topic) {
    case 'gps-data-testiot/update':
      let data = message.toString().split(',');
      if (data[0] != '0') return;
      let fluffy = new GPSModel({
        latitude: data[1],
        longitude: data[2],
        speed: data[3],
        heading: data[4],
        altitude: data[5],
        date_added: new Date().toISOString()
      });
      fluffy.save(function(err, fluffy) {
        if (err) return console.error(err);
      });
      return () => console.log(message);
  }
  console.log('No handler for topic %s', topic);
});

const GPSData = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  speed: Number,
  heading: Number,
  altitude: Number,
  date_added: Date
});
const GPSModel = mongoose.model('people', GPSData, 'peoples1');

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

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

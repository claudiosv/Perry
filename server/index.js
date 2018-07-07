var restify = require('restify');
const errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const controller = require('./products.controller');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

mongoose.connect('mongodb://test:testtest1@ds255958.mlab.com:55958/gps-data');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected!");
});

client.on('connect', () => {
  console.log('connected to broker');
  client.subscribe('gps-data-testiot/update');
  //client.subscribe('garage/state');
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

var GPSData = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  speed: Number,
  heading: Number,
  altitude: Number,
  date_added: Date
});
var GPSModel = mongoose.model('people', GPSData, 'peoples1');

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
  //if (!req.params.id) {
  //  return next(new errors.BadRequestError());
  //}
  try {
    //const product = controller.getById(+req.params.id);

    GPSModel.find(
      {},
      null,
      {
        limit: 10,
        sort: {
          date_added: -1 //Sort by Date Added DESC
        }
      },
      function(err, kittens) {
        if (err) return console.error(err);
        //console.log('Kittens: ');
        //console.log(kittens);
        res.send(200, kittens);
      }
    ).sort;

    client.publish('gps-data-testiot/update', '0,46.492260,11.321162,0.11,317');

    return next();
  } catch (error) {
    return next(new errors.NotFoundError(error));
  }
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});

var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  speed: Number,
  heading: Number,
  altitude: Number
});
mongoose.model('people', UserSchema);

module.exports = mongoose.model('people');

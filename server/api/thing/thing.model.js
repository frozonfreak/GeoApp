'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  pass: String,
  lat: String,
  lng: String,
  email: String,
  acc: String,
  uuid: String, 
  role: String

});

module.exports = mongoose.model('Thing', ThingSchema);
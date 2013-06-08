var events = require('events');
var express = require('express');
var util = require('util');

var Kraken = function(options) {
	options = options || {};

	events.eventEmitter.call(this);
}

util.inherits(Kraken, events.eventEmitter);
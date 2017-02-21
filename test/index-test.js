var vows = require('vows');
var assert = require('assert');
var util = require('util');
var emploiStore = require('passport-emploi-store');


vows.describe('passport-emploi-store').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(emploiStore.version);
    },
  },
  
}).export(module);

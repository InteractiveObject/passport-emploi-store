var vows = require('vows');
var assert = require('assert');
var util = require('util');
var EmploiStoreStrategy = require('passport-emploi-store/strategy');


vows.describe('EmploiStoreStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new EmploiStoreStrategy({ returnURL: 'https://www.example.com/auth/emploi-store/callback' },
        function() {}
      );
    },
    'should be named emploi-store': function (strategy) {
      assert.equal(strategy.name, 'emploi-store');
    },
    'should have correct provider URL': function (strategy) {
      assert.equal(strategy._providerURL, 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/authorize');
    },
  },
  
}).export(module);

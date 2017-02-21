/**
 * Module dependencies.
 */
var util = require('util')
  , OpenIDStrategy = require('passport-openid').Strategy;


/**
 * `Strategy` constructor.
 *
 * The EmploiStore authentication strategy authenticates requests by delegating to
 * EmploiStore using the OpenID 2.0 protocol.
 *
 * Applications must supply a `validate` callback which accepts an `identifier`,
 * and optionally a service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `returnURL`  URL to which EmploiStore will redirect the user after authentication
 *   - `realm`      the part of URL-space for which an OpenID authentication request is valid: /individu or /employeur
 *   - `client_id`  the client identifier
 *   -
 *
 * Examples:
 *
 *     passport.use(new EmploiStoreStrategy({
 *         returnURL: 'http://localhost:3000/auth/emploistore/return',
 *         realm: '/individu'
 *       },
 *       function(identifier, profile, done) {
 *         User.findByOpenID(identifier, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, validate) {

  if (!options.client_id) throw new Error('OpenID authentication requires a client_id option');

  options.providerURL = options.providerURL || 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/authorize';

  options.oauth = {
    consumerKey: options.client_id,
    scope: options.scope || '/individu'
  }

  //options.response_type = 'code'

  OpenIDStrategy.call(this, options, validate);
  this.name = 'emploi-store';
}

/**
 * Inherit from `OpenIDStrategy`.
 */
util.inherits(Strategy, OpenIDStrategy);


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;

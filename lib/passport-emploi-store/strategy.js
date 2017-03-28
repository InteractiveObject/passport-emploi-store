/**
 * Module dependencies.
 */
var util = require('util'),
  OAuth2Strategy = require('passport-oauth2'),
  nonce = require('nonce')()



/**
 * `Strategy` constructor.
 *
 * The Emploi-Store authentication strategy authenticates requests by delegating to
 * Emploi Store using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Cloud Foundry application's client id
 *   - `clientSecret`  your Cloud Foundry application's client secret
 *   - `callbackURL`   URL to which Cloud Foundry will redirect the user after granting authorization
 *
 * Examples 1:
 *     var CloudFoundryStrategy = require('passport-cloudfoundry').Strategy;
 *     var cfStrategy = new CloudFoundryStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://myapp.cloudfoundry.com/auth/cloudfoundry/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       });
 *
 *     passport.use(cfStrategy);
 *
 *     Call cfStrategy.reset() to reset when user is logged out (along w/ req.logout()).

 *
 *   Examples 2 (w/ 'state' parameter):
 *     var CloudFoundryStrategy = require('passport-cloudfoundry').Strategy;
 *     var cfStrategy = new CloudFoundryStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://myapp.cloudfoundry.com/auth/cloudfoundry/callback',
 *         passReqToCallback: true //<-- pass this to get req from CF.com to callback
 *       },
 *       function(req, accessToken, refreshToken, profile, done) {
 *         //verify things like 'state' in req.query (be sure to set: passReqToCallback=true)
 *         if(req.query.state === 'stateValueIpreviouslySent') {
 *             User.findOrCreate(..., function (err, user) {
 *                done(err, user);
 *            });
 *         } else {
 *            done({error: 'state value didnt match.. CSRF?'});
 *         }
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       });
 *
 * @param {Object} options
 * @param {Function} verify  A callback function to which accessToken, refreshToken, profile, done are sent back
 * @api public
 */

function Strategy(options, verify) {
    options = options || {};
    
    options.realm = options.realm || "/individu"
    
    options.responseType = options.responseType || "code"
    
    options.nonce = options.nonce || nonce()

    options.authorizationURL = options.authorizationURL || 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/authorize';
    options.authorizationURL += "?realm=" + options.realm +  "&response_type=" + options.responseType + "&nonce=" + options.nonce; 
    
    options.tokenURL = options.tokenURL || 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/access_token';
    options.tokenURL += '?realm=' + options.realm 

    OAuth2Strategy.call(this, options, verify);   

    this.name = 'emploi-store';

    //Set default userProfileURI (this is /userinfo endpoint for EmploiStore)
    this._userProfileURI = options.userProfileURI || 'https://api.emploi-store.fr/partenaire/peconnect-individu/v1/userinfo'
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Emploi-Store.
 *
 * This function calls /info endpoint of Cloud Foundry and returns the result
 * as 'profile'
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get(this._userProfileURI, accessToken, function (err, body, res) {
        if (err) {
            return done(err);
        }

        try {
            done(null, JSON.parse(body));
        } catch (e) {
            done(e);
        }
    });
};

/**
 * Set user profile URI for a Emploi Store installation.
 * Default value: https://api.cloudfoundry.com/info
 *
 * @param {String} userProfileURI End-point to get user profile (/info in CF)
 */
Strategy.prototype.setUserProfileURI = function (userProfileURI) {
    this._userProfileURI = userProfileURI;
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
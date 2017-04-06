# Passport-Emploi-Store
[![Build Status](https://travis-ci.org/InteractiveObject/passport-emploi-store.svg?branch=master)](https://travis-ci.org/InteractiveObject/passport-emploi-store)

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Emploi Store](http://www.emploi-store.fr/) , a platform setup by Pôle Emploi, the French unemployment agency, to share the public data.

This module lets you authenticate using [Emploi Store](http://www.emploi-store.fr/) in your Node.js applications.
By plugging into Passport, Pôle emploi authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


## Install

    $ npm install passport-emploi-store

## Usage

#### Configure Strategy

The Emploi Store authentication strategy authenticates users using a Emploi Store account,
which is also an OpenID 2.0 identifier.  The strategy requires a `validate`
callback, which accepts this identifier and calls `done` providing a user.
Additionally, options can be supplied to specify a callback URL and realm.

    passport.use(new EmploiStoreStrategy({
        clientID: "your_client_id",
        clientSecret: "your_client_secretToken",
        callbackURL: "http://localhost:3000/auth/emploi-store/callback",
        userProfileURI: "https://api.emploi-store.fr/partenaire/peconnect-individu/v1/userinfo",
        authorizationURL: "https://authentification-candidat.pole-emploi.fr/connexion/oauth2/authorize",
        tokenURL: "https://authentification-candidat.pole-emploi.fr/connexion/oauth2/access_token",
        realm: "/individu",
        responseType: "code",
        scope: ['openid','profile','email', 'api_peconnect-individuv1']
        // optional nonce: nonce
    },
      function(accessToken, refreshToken, profile, done) {
          return done(err, profile);
    }));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'emploi-store'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/emploistore',
      passport.authenticate('emploi-store'));

    app.get('/auth/emploistore/callback', 
      passport.authenticate('emploi-store', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signon example](https://github.com/InteractiveObject/passport-emploi-store/tree/master/examples/signon).

## Tests

    $ npm install --dev
    $ make test

## API Key

This library doesn't provide direct access to the data. To use it, you need to get a client ID and client secret from Emploi Store Dev.

As documented on their
[website](https://www.emploi-store-dev.fr/portail-developpeur/donneesdoctechnique) you need to:

* [Sign-in](https://www.emploi-store-dev.fr/portail-developpeur/donneesdoctechnique:connexion) or [create a new account](https://www.emploi-store-dev.fr/portail-developpeur/creationutilisateur)
* Go to your [dashboard](https://www.emploi-store-dev.fr/portail-developpeur/tableaudebord)
* Add an application, check `Oui` to the question `Utilisation de l’API Pôle
  emploi` and agree to the terms of use
* The client ID and secret are then available as `Identifiant client` and `Clé secrète`


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2017 Interactive Object [https://interactive-object.com/](https://interactive-object.com/)

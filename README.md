# Passport-Emploi-Store
[![Build Status](https://travis-ci.org/InteractiveObject/passport-emploi-store.svg?branch=master)](https://travis-ci.org/InteractiveObject/passport-emploi-store)

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Emploi Store](http://www.emploi-store.fr/) using OpenID 2.0.

This module lets you authenticate using Pôle Emploi in your Node.js applications.
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
Additionally, options can be supplied to specify a return URL and realm.

    passport.use(new EmploiStoreStrategy({
        returnURL: 'http://localhost:3000/auth/emploistore/return',
        realm: '/individu',
        response_type: 'code',
        client_id: 'XXXX',
        scope: 'application_XXXXX%20api_authentificationindividuv1%20openid%20profile%20email',
        state: 'STATE_ID',
        nonce: 'NOOCE'
      },
      function(identifier, done) {
        User.findByOpenID({ openId: identifier }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'emploi-store'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/emploistore',
      passport.authenticate('emploi-store'));

    app.get('/auth/emploistore/return', 
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


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2017 Interactive Object [https://interactive-object.com/](https://interactive-object.com/)

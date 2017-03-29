var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , morgan = require('morgan')
  , http = require('http')
  , session = require('express-session')
  , EmploiStoreStrategy = require('../../lib/passport-emploi-store').Strategy;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Emploi-Store.fr profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the EmploiStoreStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new EmploiStoreStrategy({
    clientID: "PAR_MACIGOGNE_9895C594AC8B06E3E5E0D97564C2DDADA47A6F3E1A1D4A5079C8D1B581B39CCB",
    clientSecret: "3E7AD1753F09B3A1ADA5A676BC310F3E1B7EE75E3D3C2542D9003EB124D986CF",
    callbackURL: "http://localhost:3000/auth/emploi-store/return",
    userProfileURI: "https://api-r.es-qvr.fr/partenaire/peconnect-individu/v1/userinfo",
    authorizationURL: "https://authentification-candidat-r.pe-qvr.fr/connexion/oauth2/authorize",
    tokenURL: "https://authentification-candidat-r.pe-qvr.fr/connexion/oauth2/access_token",
    realm: "/individu",
    responseType: "code",
    scope: ['profile','email', 'api_peconnect-individuv1']
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));



var app = express();

// configure Express

  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(morgan('combined'))
  //app.use(express.methodOverride());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../public'));



app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/emploi-store
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Emploi-Store authentication will involve redirecting
//   the user to emploi-store.fr.  After authenticating, Emploi-Store will redirect the
//   user back to this application at /auth/emploi-store/return
app.get('/auth/emploi-store', 
  passport.authenticate('emploi-store', { failureRedirect: '/login' , state: "AAA"}),
  function(req, res) {
    res.redirect('/');
  });

// GET /auth/emploi-store/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/emploi-store/return', 
  passport.authenticate('emploi-store', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieSession = require('cookie-session');

const LocalStrategy = require('passport-local').Strategy;
const { createUser, logIn, getUserById } = require('./lib/auth');

const {
  serializer,
  // logIn,
  userDoesExist,
  getUserURLS,
  userDoesOwnURL
} = require('./helpers');

/**
 * @description Middleware: Checks if the user is logged in
 * @param {string} cookieID The value from the 'id' cookie value
 * @returns {bool} True if the user is logged in
 */
const checkUserLoggedIn = function(req, res, next) {

  for (const id of Object.keys(userDatabase)) {
    if (id === req.session.id) {
      req.user = {
        id: userDatabase[id].id,
        username: userDatabase[id].username,
        urls: userDatabase[id].urls,
        email: userDatabase[id].email
      };
    }
  }

  next();
};

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(express.json());
// app.use(session({
//   secret: 'keyboard cat',
//   SameSite: 'strict',
//   secure: false
// }));
app.use(cookieSession({
  name: 'tinyapp-session',
  keys: ['mongoose', 'trouble', 'red', 'peppers', 'photograph', 'genuine'],
  maxAge: 1 * 24 * 60 * 60 * 1000 //24 hours
}));
app.use(morgan('dev'));

passport.use(new LocalStrategy(function(email, password, done) {
  console.log('logging in with strategy');
  logIn(email, password, done);
}));

passport.serializeUser(function(user, done) {
  console.log('serialize');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserialize');
  return getUserById(id)
    .then((user) => {
      console.log(user);
      return done(null, user);
    })
    .catch((err) => done(err, null));
});

app.use(passport.initialize());
app.use(passport.session());

const userDatabase = {};

const urlDatabase = {};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} in ${process.env.NODE_ENV} mode!`);
});

app.get('/', checkUserLoggedIn, (req, res) => {

  const templateVars = {
    email: req.user ? req.user.email : null,
    username: req.user ? req.user.username : null,
    loggedIn: req.user ? true : false
  };

  res.render('home', templateVars);
});

app.get("/urls", passport.authenticate('session'), (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  const templateVars = {
    id: req.user.id,
    urls: getUserURLS(urlDatabase, req.user.id),
    username: req.user.username,
    email: req.user.email,
    success: true,
    message: req.query.loggedIn === 'true' ? 'Succesfully Logged in' : '',
  };
  
  res.render('urls_index', templateVars);

});

app.get("/urls/new", checkUserLoggedIn, (req, res) => {

  if (!req.user) {
    return res.status(401).redirect('/');
  }

  const templateVars = {
    username: req.user.username,
    email: req.user.email,
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", checkUserLoggedIn, (req, res) => {
  
  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: req.user.username,
    email: req.user.email,
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {

  if (!urlDatabase[req.params.shortURL]) {
    return res.status(401).render('error', { title: 'Error 404', message: 'URL Not Found.'});
  }

  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get("/login", (req, res) => {
  res.render('login', { success: true, message: ""});
});

app.get("/register", (req, res) => {

  if (req.user) {
    res.redirect('/urls');
  }

  res.render('register', { success: true, message: "" });
});

app.get("/privacy", (req, res) => {
  res.render('privacy_policy');
});

//Catchall
app.get("*", (req, res) => {
  res.redirect('/urls');
});

app.post("/urls", checkUserLoggedIn, (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  const random = serializer();

  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.user.id
  };

  res.redirect(`/urls/${random}`);
});

app.post("/urls/:shortURL/delete", checkUserLoggedIn, (req, res) => {


  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  if (!userDoesOwnURL(urlDatabase, req.params.shortURL, req.user.id)) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. You don\'t own that URL!'});
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", checkUserLoggedIn, (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  if (!userDoesOwnURL(urlDatabase, req.params.id, req.user.id)) {
    return res.status(401).render('error', { title: 'Oh no you didn\'t!', message: 'You don\'t own that URL!' });
  }

  urlDatabase[req.params.id].longURL = req.body.url;
  res.redirect(`/urls`);
});

app.post("/login", passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {

  console.log('ok made it');

  if (!userDoesExist(req.body.username)) {
    return res.status(403).render('login', { success: false, message: 'Please provide a valid username or password'});
  }

  const userID = logIn(userDatabase, req.body.username, req.body.password);

  //Log user in and check for failure
  if (!userID) {
    return res.status(403).render('login', { success: false, message: 'Could not log user in'});
  }

  req.session.id = userID;
  let param = encodeURIComponent('true');
  res.redirect('/urls?loggedIn=' + param);

});

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect('/');

});

app.post("/register", (req, res) => {

  if (!req.body.email || !req.body.password || !req.body.password_confirmation) {
    return res.status(400).render('register', { success: false, message: 'Please ensure all fields are filled before submitting registration'});
  }

  if (req.body.password !== req.body.password_confirmation) {
    return res.status(400).render('register', { success: false, message: 'Password does not match password confirmation'});
  }

  createUser(req.body.password, req.body.password_confirmation, req.body.email)
    .then((newUser) => newUser.rows[0])
    .then((user) => {
      return req.login(user, function(err) {
        if (err) {
          return res.status(500).json({
            message: 'Could not Log User In',
            error: err
          });
        }
        res.send("Success");
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not Create User',
        error: err.message
      });
    });
});
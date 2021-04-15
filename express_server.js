const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');
const { nextTick } = require("process");
const bcrypt = require('bcrypt');

/**
 * @description Creates a 6 character randomized string of lower, and upper case characters and numbers
 * @returns {string} Serialized String
 */
const serializer = function() {
  let result             = [];
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');
};

/**
 * @description Middleware: Checks if the user is logged in
 * @param {string} cookieID The value from the 'id' cookie value
 * @returns {bool} True if the user is logged in
 */
const checkUserLoggedIn = function(req, res, next) {

  for (const id of Object.keys(users)) {
    if (id === req.session.id) {
      req.user = {
        id: users[id].id,
        username: users[id].username,
        urls: users[id].urls,
        email: users[id].email
      };
    }
  }

  next();
};

/**
 * @description Logs the user in
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns {boolean} Password match state
 */
const logIn = function(username, password) {

  let result = null;

  for (const id of Object.keys(users)) {
    if (users[id].username === username || users[id].email === username) {
      //Ok found user - Now check password
      if (bcrypt.compareSync(password, users[id].password)) {
        result = users[id].id;
      }
    }
  }

  return result;
};

/**
 * @description Gets a scrubbed user object from the database
 * @param {string} id The users username
 * @returns {object} User object without password
 */
const getUser = function(id) {
  let result = {};

  for (const id of Object.keys(users)) {
    if (users[id].id === id) {
      result = {
        id : users[id].id,
        username : users[id].username,
        email : users[id].email,
        urls : users[id].urls
      };
    }
  }

  return result;
};

/**
 * @description Checks to see if the user exists in database
 * @param {string} username Username or email of the User
 * @returns True if user exists in database
 */
const userDoesExist = function(username) {
  let result = false;

  for (const id of Object.keys(users)) {
    if (users[id].username === username || users[id].email === username) {
      result = true;
    }
  }

  return result;
};

/**
 * @description Creates a new User in the database
 * @param {string} userDatabase The database to create the user on
 * @param {string} username The user's submitted username
 * @param {string} email The user's submitted email
 * @param {string} password The user's submitted password
 */
const createUser = function(userDatabase, username, email, password) {

  const id = serializer();
  const hashedPassword =  bcrypt.hashSync(password, 10);
  
  userDatabase[id] = {
    id: id,
    username: username,
    email: email,
    password: hashedPassword,
    urls : []
  };

  return {
    id: id,
    username: username,
    email: email,
    urls: []
  };

};

/**
 * @description Returns composed objects of all urls stored for the user
 * @param {object} urlDatabase
 * @param {string} id
 * @returns {object} All User URLS
 */
const getUserURLS = function(urlDatabase, id) {
  const result = {};

  for (const url of Object.keys(urlDatabase)) {
    if (urlDatabase[url].userID === id) {
      result[url] = {
        longURL : urlDatabase[url].longURL
      };
    }
  }
  return result;
};

/**
 * @description Checks the database to see if the provided user owns the provided URL
 * @param {object} urlDatabase
 * @param {string} url
 * @param {string} id
 * @returns {boolean} User does own URL
 */
const userDoesOwnURL = function(urlDatabase, url, id) {
  let result = false;

  if (urlDatabase[url].userID === id) {
    result = true;
  }

  return result;
};

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'tinyapp-session',
  keys: ['mongoose', 'trouble', 'red', 'peppers', 'photograph', 'genuine'],
  maxAge: 1 * 24 * 60 * 60 * 1000 //24 hours
}));
app.use(morgan('dev'));

app.set("view engine", "ejs");

const users = {};

const urlDatabase = {};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', checkUserLoggedIn, (req, res) => {

  const templateVars = {
    email: req.user ? req.user.email : null,
    username: req.user ? req.user.username : null,
    loggedIn: req.user ? true : false
  };

  res.render('home', templateVars);
});

app.get("/urls", checkUserLoggedIn, (req, res) => {

  if (!req.user) {
    return res.status(401).redirect('/');
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
    return res.status(401).redirect('/');
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
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get("/login", (req, res) => {
  res.render('login', { success: true, message: ""});
});

app.get("/register", (req, res) => {

  res.render('register');
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
    return res.status(401).render('home', { success: false, message: 'Nuh uh uh. You didn\'t say the magic word.' });
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
    return res.status(401).render('error', { title: 'Oh no you didn\'t!', message: 'Please Login first' });
  }

  if (!userDoesOwnURL(urlDatabase, req.params.shortURL, req.user.id)) {
    return res.status(401).render('error', { title: 'Oh no you didn\'t!', message: 'You don\'t own that URL!' });
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", checkUserLoggedIn, (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Oh no you didn\'t!', message: 'Please login first.' });
  }

  if (!userDoesOwnURL(urlDatabase, req.params.id, req.user.id)) {
    return res.status(401).render('error', { title: 'Oh no you didn\'t!', message: 'You don\'t own that URL!' });
  }

  urlDatabase[req.params.id].longURL = req.body.url;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  if (!userDoesExist(req.body.username)) {
    return res.status(403).render('login', { success: false, message: 'Please provide a valid username or password'});
  }

  const userID = logIn(req.body.username, req.body.password);

  //Log user in and check for failure
  if (!userID) {
    return res.status(403).redirect('/');
  }

  req.session.id = userID;
  let param = encodeURIComponent('true');
  res.redirect('/urls?loggedIn=' + param);

});

app.post("/register", (req, res) => {

  if (!req.body.username || !req.body.username || !req.body.password) {
    return res.status(400).render('login', { success: false, message: 'Please ensure all fields are filled before submitting registration'});
  }

  //Check to see if username or email already exist in database
  for (const user of Object.keys(users)) {
    if (users[user].email === req.body.email || users[user].username === req.body.username) {
      //TODO: Change this to a proper redirect or alert
      // Redirect if so
      return res.status(400).render('login', { success: false, message: 'Username or Email already registered'});
    }
  }

  //Create new user object in database
  const newUser = createUser(users, req.body.username, req.body.email, req.body.password);
  req.session.id = newUser.id;
  let param = encodeURIComponent('true');
  res.redirect('/urls?loggedIn=' + param);
});
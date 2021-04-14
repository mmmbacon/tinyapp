const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');

const morgan = require('morgan');
const { nextTick } = require("process");

/**
 * @description Creates a 6 character randomized string of lower, and upper case characters and numbers
 * @returns {string} Serialized String
 */
const serializer = function() {
  let result           = [];
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');
};

/**
 * @description Checks if the user is logged in
 * @param {string} cookieID The value from the 'id' cookie value
 * @returns {bool} True if the user is logged in
 */
const checkUserLoggedIn = function(cookieID) {

  let result = false;

  for (const userID of Object.keys(users)) {
    console.log(userID);
    if (userID === cookieID) {
      result = true;
    }
  }

  return result;
};

/**
 * @description Logs the user in
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns {boolean} Password match state
 */
const logIn = function(username, password) {

  let result = false;

  for (const user of Object.keys(users)) {
    if (user.username === username || user.email === username) {
      //Ok found user - Now check password
      if (user.password === password) {
        result = true;
      }
    }
  }

  return result;
};

/**
 * @description Gets a scrubbed user object from the database
 * @param {string} username The users username
 * @returns {object} User object without password
 */
const getUser = function(username) {
  let result = {};

  if (username) {
    for (const user of Object.keys(users)) {
      if (user.username === username) {
        result = {
          id : user.id,
          username : user.username,
          email : user.email,
          urls : user.urls
        };
      }
    }
  }

  return result;
};

/**
 * @description Creates a new User in the database
 * @param {string} id The Generated User ID
 * @param {string} username The user's submitted username
 * @param {string} email The user's submitted email
 * @param {string} password The user's submitted password
 */
const createUser = function(userDatabase, id, username, email, password) {
  
  userDatabase[id] = {
    id: id,
    username: username,
    email: email,
    password: password
  };

};

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//Check to see if user is logged in and attach user data to request
app.use((req, res, next) => {
  if (checkUserLoggedIn(req.cookies.username)) {
    req.user = getUser(req.cookies.userName);
  }
  console.log(req.user);
  next();
});

app.use(morgan('dev'));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

let userName = "";

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', (req, res) => {
  const templateVars = {
    username: req.cookies['username']
  };
  res.render('home', templateVars);
});

app.get("/urls", (req, res) => {

  //If the user is not on the request object(not logged in) return back to home
  if (!req.user) {
    return res.status(500).redirect('/');
  }

  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  
  res.render('urls_index', templateVars);

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/login", (req, res) => {
  res.render('login');
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

app.post("/urls", (req, res) => {
  const random = serializer();
  urlDatabase[random] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${random}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.url;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  //Logic for logging in
  if (!logIn(req.body.username, req.body.password)) {
    return res.status(401).redirect('/');
  }

  const user = getUser(req.body.username);

  res.cookie('id', user.id);
  res.redirect('/urls');
});

app.post("/register", (req, res) => {

  const id = serializer();

  //Check to see if username or email already exist in database
  for (const user of Object.keys(users)) {
    if (user.email === req.body.email || user.username === req.body.username) {
      //TODO: Change this to a proper redirect or alert
      // Redirect if so
      return res.redirect('/register');
    }
  }

  //Create new user object
  createUser(users, id, req.body.username, req.body.email, req.body.password);

  res.cookie('id', id);
  res.redirect('/urls');
});





const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');

const morgan = require('morgan');

const generateRandomString = function() {
  let result           = [];
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');
};
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

//Catchall
app.get("*", (req, res) => {
  res.redirect('/URLs');
});

app.post("/urls", (req, res) => {
  const random = generateRandomString();
  console.log(req.body);
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
  console.log(req.body);
  userName = req.body.username;
  res.cookie('username', userName);
  res.redirect('/urls');
});





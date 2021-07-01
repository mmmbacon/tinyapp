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
const { createUrl, getUrlsForUser, getUrl, updateUrl, deleteUrl } = require('./lib/urls');

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

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'},function(email, password, done) {
  logIn(email, password, done);
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  return getUserById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} in ${process.env.NODE_ENV} mode!`);
});

app.get('/', passport.authenticate('session'), (req, res) => {

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

  getUrlsForUser(req.user.id)
    .then((urls) => urls.rows)
    .then((urls) => {
      const templateVars = {
        id: req.user.id,
        urls: urls,
        email: req.user.email,
        success: true,
        message: req.query.loggedIn === 'true' ? 'Succesfully Logged in' : '',
      };
      
      res.render('urls_index', templateVars);
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not get URL\'s',
        error: err.message
      });
    });

  

});

app.get("/urls/new", passport.authenticate('session'), (req, res) => {

  if (!req.user) {
    return res.status(401).redirect('/');
  }

  const templateVars = {
    username: req.user.username,
    email: req.user.email,
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", passport.authenticate('session'), (req, res) => {
  
  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  getUrl(req.params.shortURL)
    .then((urls) => urls.rows[0])
    .then((url) => {
      const templateVars = {
        short_url: url.short_url,
        long_url: url.long_url,
        username: req.user.username,
        email: req.user.email,
      };
    
      return res.render("urls_show", templateVars);
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not get URL',
        error: err.message
      });
    });

  
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

app.post("/urls", passport.authenticate('session'), (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  createUrl(req.body.longUrl, req.user.id)
    .then((url) => url.rows[0])
    .then((url)=>{
      return res.send("Success");
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not Create URL',
        error: err.message
      });
    });

});

app.post("/urls/:shortURL/delete", passport.authenticate('session'), (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  console.log(req.body.short_url, req.user.id);

  deleteUrl(req.body.short_url, req.user.id)
    .then((urls) => urls.rows[0])
    .then((urls) => {
      const templateVars = {
        id: req.user.id,
        urls: urls,
        email: req.user.email,
        success: true,
        message: req.query.loggedIn === 'true' ? 'Succesfully Logged in' : '',
      };
      
      res.render('urls_index', templateVars);
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not Delete URL',
        error: err.message
      });
    });
});

app.post("/urls/:id", passport.authenticate('session'), (req, res) => {

  if (!req.user) {
    return res.status(401).render('error', { title: 'Error 401', message: 'Unauthorized. Please log in.'});
  }

  updateUrl(req.params.id, req.user.id)
    .then((urls) => urls.rows[0])
    .then((url) => {
      return res.send("Success");
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Could not update URL',
        error: err.message
      });
    });
});

app.post("/login", passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}), (req, res) => {

  res.send("Success");

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
const db = require("../db/db");
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const saltRounds = 10;

const createUser = function(password, passwordConfirmation, email) {
   
  if (!password || !passwordConfirmation || !email) {
    return Promise.reject(new Error('You must provide an email, password and password confirmation'));
  }

  if (password !== passwordConfirmation) {
    return Promise.reject(new Error("Password does not match password confirmation"));
  }

  if (!validator.validate(email)) {
    return Promise.reject(new Error("Email does not meet validation criteria"));
  }

  const queryString1 = `SELECT email FROM users WHERE email = $1;`;
  const queryString2 = `INSERT INTO users ( email, password ) VALUES ( $1, $2 ) RETURNING id, email, password;`;
  
  return db.query(queryString1, [email])
    .then(() => bcrypt.hash(password, saltRounds))
    .then((hash) => db.query(queryString2, [email, hash]))
    .then((user) => Promise.resolve(user))
    .catch((err) => new Error(err));
};

const comparePassword = function(password, hash) {
  bcrypt.compare(password, hash, function(err, result) {
    if (err) {
      return Promise.reject("Passwords did not match");
    }
    return Promise.resolve("Successfully logged in user");
  });
};

const logIn = function(email, password, done) {

  const queryString1 = `SELECT * FROM users WHERE email = $1;`;

  console.log("attempting login");

  return db.query(queryString1, [email])
    .then((user) => comparePassword(password, user.password) ? user : null) //Validate Password
    .then((user) => user ? done(null, user) : done(null, false, { message: 'Incorrect password.' }))
    .catch((err) => done(null, false, { message: err }));
};

module.exports = {
  createUser,
  comparePassword,
  logIn
};
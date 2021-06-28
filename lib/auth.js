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
  const queryString2 = `INSERT INTO users ( email, password ) VALUES ( $1, $2 ) RETURNING id, email;`;
  
  return db.query(queryString1, [email])
    .then(() => bcrypt.hash(password, saltRounds))
    .then((hash) => db.query(queryString2, [email, hash]))
    .then((user) => user)
    .catch((err) => new Error(err));
};

const comparePassword = function(password) {
  // Load hash from your password DB.
  const hash = "blahblah";
  bcrypt.compare(password, hash, function(err, result) {
    if (err) {
      return false;
    }
  });
};

module.exports = {
  createUser,
  comparePassword
};
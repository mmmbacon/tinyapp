const db = require("../db/db");
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const saltRounds = 10;

const createUser = function(password, passwordConfirmation, email) {

  console.log("creating user..");
   
  if (!password || !passwordConfirmation || !email) {
    return Promise.reject(new Error('You must provide an email, password and password confirmation'));
  }

  if (password !== passwordConfirmation) {
    return Promise.resolve([]);
  }

  if (!validator.validate(email)) {
    return Promise.resolve([]);
  }

  //Check database to see if user by email exists
  const params = [email];
  const queryString = `
          SELECT email
          FROM users
          WHERE email = $1
          `;

  return db.query(queryString, params)
    .then((res)=> {
      if (res) {
        return bcrypt.genSalt(saltRounds, function(err, salt) {
          if (err) {
            return Promise.resolve([]);
          }
          return bcrypt.hash(password, salt, function(err, hash) {
      
            if (err) {
              return Promise.resolve([]);
            }
      
            const params = [email, hash];
      
            const queryString = `
            INSERT INTO users ( email, password )
            VALUES ( $1, $2 );
            `;
      
            return db.query(queryString, params)
              .then((res)=> {
                return true;
              })
              .catch((err)=> {
                return err;
              });
          });
        });
      }
    })
    .catch((err)=> {
      return err;
    });

  
  
};

const comparePassword = function(password) {
  // Load hash from your password DB.
  const hash = "blahblah";
  bcrypt.compare(password, hash, function(err, result) {
    if (err) {
      return false;
    }
    // result == true
  });
};

module.exports = {
  createUser,
  comparePassword
};
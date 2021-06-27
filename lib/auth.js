const db = require("./db/db");
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const saltRounds = 10;

const createUser = function(password, password_confirmation, email){
   
  if (!password || !password_confirmation || !email) {
    return Promise.resolve([]);
  }

  if(password !== password_confirmation){
    return Promise.resolve([]);
  }

  if (!validator.validate(email)){
    return Promise.resolve([]);
  }

  const params = [email, password];

  const queryString = `
  INSERT INTO users ( email, password )
  VALUES ( $1, $2 );
  `;

  return db.query(queryString, params)
    .then((res)=> {
      return //user links
    })
    .catch((err)=> {
      return err;
    });


  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        
    });
  });
}

const comparePassword = function(){
  // Load hash from your password DB.
  bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
  });
}

module.exports = {
  generatePassword,
  comparePassword
}
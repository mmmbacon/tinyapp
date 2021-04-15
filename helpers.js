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
 * @description Checks to see if the user password matches what is in the database
 * @param {object} userDatabase The user database to query
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns {boolean} Password match state
 */
const logIn = function(userDatabase, username, password) {

  let result = null;

  for (const id of Object.keys(userDatabase)) {
    console.log('checking user', userDatabase[id]);
    if (userDatabase[id].username === username || userDatabase[id].email === username) {
      console.log('found user');
      //Ok found user - Now check password
      if (bcrypt.compareSync(password, userDatabase[id].password)) {
        result = userDatabase[id].id;
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
const getUserByID = function(userDatabase, userID) {
  let result = {};

  for (const id of Object.keys(userDatabase)) {
    if (userDatabase[id].id === userID) {
      result = {
        id : userDatabase[id].id,
        username : userDatabase[id].username,
        email : userDatabase[id].email,
        urls : userDatabase[id].urls
      };
    }
  }

  return result;
};

/**
 * @description Gets a scrubbed user object from the database
 * @param {string} id The users username
 * @returns {object} User object without password
 */
const getUserByEmail = function(userDatabase, email) {
  let result = {};

  for (const id of Object.keys(userDatabase)) {
    if (userDatabase[id].email === email) {
      result = {
        id : userDatabase[id].id,
        username : userDatabase[id].username,
        email : userDatabase[id].email,
        urls : userDatabase[id].urls
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
const userDoesExist = function(userDatabase, username) {
  let result = false;

  for (const id of Object.keys(userDatabase)) {
    if (userDatabase[id].username === username || userDatabase[id].email === username) {
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
 * @returns {object} Returns the created user object without password field
 */
const createUser = function(userDatabase, username, email, password) {

  let result = {};

  if (userDatabase && username && email && password) {
    const id = serializer();
    const hashedPassword =  bcrypt.hashSync(password, 10);
  
    userDatabase[id] = {
      id: id,
      username: username,
      email: email,
      password: hashedPassword,
      urls : []
    };

    result = {
      id: id,
      username: username,
      email: email,
      urls: []
    };

  }

  return result;

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
 * @param {object} urlDatabase The URL database to query
 * @param {string} url URL to query
 * @param {string} id User ID
 * @returns {boolean} User owns url?
 */
const userDoesOwnURL = function(urlDatabase, url, id) {
  let result = false;

  if (urlDatabase[url].userID === id) {
    result = true;
  }

  return result;
};

module.exports = {
  serializer,
  logIn,
  getUserByID,
  getUserByEmail,
  userDoesExist,
  createUser,
  getUserURLS,
  userDoesOwnURL
};
const bcrypt = require('bcrypt');

/**
 * @description Logs the user in
 * @param {object} userDatabase The user database to query
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns {boolean} Password match state
 */
const comparePassword = function(userDatabase, username, password) {

  let result = null;

  for (const id of Object.keys(userDatabase)) {
    if (userDatabase[id].username === username || userDatabase[id].email === username) {
      //Ok found user - Now check password
      if (bcrypt.compareSync(password, userDatabase[id].password)) {
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

module.exports = {
  comparePassword,
  getUserByID,
  getUserByEmail,
  userDoesExist,
  createUser,
  getUserURLS,
  userDoesOwnURL
};
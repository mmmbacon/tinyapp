const db = require("../db/db");

const createUrl = function(longUrl, id) {
   
  if (!longUrl) {
    return Promise.reject(new Error('A long URL must be provided.'));
  }

  const randomString = serializer();
  const shortUrl = randomString;
  const queryString1 = `INSERT INTO urls ( long_url, short_url, user_id ) VALUES ( $1, $2, $3 ) RETURNING long_url, short_url;`;
  
  return db.query(queryString1, [longUrl, shortUrl, id ])
    .then((url) => Promise.resolve(url))
    .catch((err) => Promise.reject(new Error(err)));
};

const getUrlsForUser = function(id) {
  if (!id) {
    return Promise.reject(new Error('A user id must be provided for the query'));
  }

  const queryString1 = `SELECT long_url, short_url FROM urls WHERE user_id = $1;`;

  return db.query(queryString1, [id])
    .then((urls) => Promise.resolve(urls))
    .catch((err) => Promise.reject(new Error(err)));
};

const getUrl = function(shortUrl) {
  if (!shortUrl) {
    return Promise.reject(new Error('A user id must be provided for the query'));
  }

  const queryString1 = `SELECT long_url, short_url FROM urls WHERE short_url = $1;`;

  return db.query(queryString1, [shortUrl])
    .then((urls) => Promise.resolve(urls))
    .catch((err) => Promise.reject(new Error(err)));
};

const updateUrl = function(shortUrl, id) {

  if (!id || !shortUrl) {
    return Promise.reject(new Error('A user id and shortUrl must be provided for the query'));
  }

  const queryString1 = `SELECT short_url FROM urls WHERE user_id = $1 AND short_url = $2;`;

  return db.query(queryString1, [id, shortUrl])
    .then((urls) => Promise.resolve(urls))
    .catch((err) => Promise.reject(new Error(err)));
};

const deleteUrl = function(shortUrl, id) {

  if (!id || !shortUrl) {
    return Promise.reject(new Error('A user id and shortUrl must be provided for the query'));
  }

  const queryString1 = `DELETE FROM urls WHERE user_id = $1 AND short_url = $2;`;

  return db.query(queryString1, [id, shortUrl])
    .then(() => getUrlsForUser(id))
    .then((urls) => Promise.resolve(urls))
    .catch((err) => Promise.reject(new Error(err)));
};

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


module.exports = {
  createUrl,
  getUrlsForUser,
  getUrl,
  updateUrl,
  deleteUrl
};
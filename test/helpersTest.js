const { assert, expect } = require('chai');

const {
  serializer,
  logIn,
  getUserByID,
  getUserByEmail,
  userDoesExist,
  createUser,
  getUserURLS,
  userDoesOwnURL
} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    username: 'mmmbacon',
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    username: 'buttertarts420',
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrls = {
  'randomURLID': {
    longURL: 'randomLongURL',
    userID: 'randomUserID'
  }
};

describe('serialize', function() {
  it('should return a string', function() {
    const string = serializer();
    const expectedOutput = 'string';
    assert(typeof string === expectedOutput, 'result is not a string');
  });
  it('should return a string 6 characters long', function() {
    const string = serializer();
    const expectedOutput = 6;
    assert(string.length === expectedOutput, 'string is not 6 characters long');
  });
});

describe('logIn', function() {
  it('should return a user ID if given password matches decrypted password', function() {
    //Create a user for testing
    const user = createUser(testUsers, "mmmbacon", "mmmbacon@gmail.com", "password1234");

    assert(logIn(testUsers, "mmmbacon", "password1234") === user.id, 'Password does not match');
  });

  it('should return null if given password does not match decrypted password', function() {
    //Create a user for testing
    const user = createUser(testUsers, "mmmbacon", "mmmbacon@gmail.com", "password1234");

    assert(logIn(testUsers, "mmmbacon", "bananacoconut") === null, 'Password does not match');
  });

});

describe('getUserByID', function() {
  it('should return a user with a given ID', function() {
    //Create a user for testing
    const user = createUser(testUsers, "mmmbacon2", "mmmbacon2@gmail.com", "password1234");
    const userQuery = getUserByID(testUsers, user.id);
    
    assert(userQuery.id === user.id, 'ID Does not match');
  });

  it('should return an empty object if no id is provided', function() {
    const userQuery = getUserByID(testUsers);

    expect(userQuery).to.deep.equal({});
  });

});

describe('getUserByEmail', function() {

  it('should return a user id with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com",);
    const expectedOutput = "userRandomID";
    assert(user.id === expectedOutput, 'email does not exist');
  });

  it('should return undefined if an invalid email is provided', function() {
    const user = getUserByEmail(testUsers, "user666@example.com",);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert(user.id !== expectedOutput, 'email exists');
  });

  it('should return an empty object if no email is provided', function() {
    const userQuery = getUserByEmail(testUsers);

    expect(userQuery).to.deep.equal({});
  });

});

describe('userDoesExist', function() {

  it('should return true if the user is in the database', function() {
    const userExists = userDoesExist(testUsers, "user@example.com");
    const expectedOutput = true;
    assert(userExists === expectedOutput, 'User does not exist');
  });

  it('should return false if the user is not in the database', function() {
    const userExists = userDoesExist(testUsers, "user666@example.com");
    const expectedOutput = false;
    assert(userExists === expectedOutput, 'User exists');
  });

  it('should return false if no username provided', function() {
    const userExists = userDoesExist(testUsers);
    const expectedOutput = false;
    assert(userExists === expectedOutput, 'User exists');
  });


});

describe('createUser', function() {

  it('should return a user object when all given parameters are provided', function() {
    const user = createUser(testUsers, "mmmbacon4", "mmmbacon4@gmail.com", "password1234");
    const expectedOutput = {
      id: user.id,
      username: 'mmmbacon4',
      email: "mmmbacon4@gmail.com",
      urls: []
    };
    expect(user).to.deep.equal(expectedOutput);
  });

  it('should return an empty object if any parameters are missing', function() {
    const user = createUser(testUsers, "mmmbacon4", "mmmbacon4@gmail.com");

    expect(user).to.deep.equal({});
  });

});

describe('getUserURLS', function() {

  it('should return all URLS where the URL contains the user id', function() {
    const URLs = getUserURLS(testUrls, 'randomUserID');
    const expectedOutput = {
      'randomURLID': {
        longURL: 'randomLongURL'
      }
    };
    expect(URLs).to.deep.equal(expectedOutput);
  });

  it('should return an empty object if any parameters are missing', function() {
    const URLs = getUserURLS(testUrls);

    expect(URLs).to.deep.equal({});
  });

  it('should return an empty object if provided username isnt found', function() {
    const URLs = getUserURLS(testUrls, 'DaveSmith');

    expect(URLs).to.deep.equal({});
  });

});

describe('userDoesOwnURL', function() {

  it('should return true if the given userID matches the userID in the URL', function() {
    const URLs = userDoesOwnURL(testUrls, 'randomURLID','randomUserID');
    const expectedOutput = true;

    assert(URLs === expectedOutput, "User does not own URL");
  });

  it('should return false if any parameters are missing', function() {
    const URLs = userDoesOwnURL(testUrls, 'randomURLID');
    const expectedOutput = false;

    assert(URLs === expectedOutput, "All parameters are given");
  });

  it('should return false if no URLS match the given owner', function() {
    const URLs = userDoesOwnURL(testUrls, 'randomURLID', 'notSoRandomUserID');
    const expectedOutput = false;

    assert(URLs === expectedOutput, "All parameters are given");
  });

});





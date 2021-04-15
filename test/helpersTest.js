const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user id with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com",);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert(user.id === expectedOutput, 'email does not exist');
  });
  it('should return undefined if an invalid email is provided', function() {
    const user = getUserByEmail(testUsers, "user666@example.com",);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert(user.id !== expectedOutput, 'email exists');
  });
});

const uuid = require('uuid');

class User {
  constructor(id, email, password, firstName, lastName, roleId) {
    this.id = uuid.v4();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleId = roleId;
  }
}

module.exports = User;

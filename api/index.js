const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const { ensureToken } = require('./jwt-middleware');
require('dotenv').config();
var cors = require('cors');
const users = require('./data/users.json');
const User = require('./models/user');

app.use(express.json());
app.use(cors());

// api test
app.get('/api', (req, res) => {
  res.json({
    text: 'my api',
  });
});

// login user
app.post('/api/login', (req, res) => {
  // auth user
  const { email, password } = req.body;
  const tempUser = users.find(
    (user) => user.email === email && user.password === password,
  );
  if (!tempUser) {
    return res
      .status(403)
      .send({ message: 'Invalid email or password' });
  }
  const user = Object.assign({}, tempUser);
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: '15s',
  });
  user.token = token;
  delete user.password;
  res.json(user);
});

// get users
app.get('/api/users', ensureToken, (req, res) => {
  const processedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
  }));
  res.json(processedUsers);
});

// create user
app.post('/api/users', ensureToken, (req, res) => {
  const {
    id,
    email,
    password,
    firstName,
    lastName,
    roleId,
  } = req.body;
  const user = new User(
    id,
    email,
    password,
    firstName,
    lastName,
    roleId,
  );
  users.push(user);
  const processedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
  }));
  res.json(processedUsers);
});

// post used because of multiple delete option
app.post('/api/users/multi-delete', ensureToken, (req, res) => {
  const userIds = req.body;
  const results = users.filter(
    (user) => !userIds.some((id) => id === user.id),
  );
  const processedUsers = results.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
  }));
  res.json(processedUsers);
});

// update user
app.patch('/api/users', ensureToken, (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.id === req.body.id,
  );
  if (userIndex !== -1) {
    users[userIndex].email = req.body.email;
    users[userIndex].firstName = req.body.firstName;
    users[userIndex].lastName = req.body.lastName;
    users[userIndex].roleId = req.body.roleId;
  }
  const processedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
  }));
  res.json(processedUsers);
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

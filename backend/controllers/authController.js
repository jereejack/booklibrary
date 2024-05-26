const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { username, password } = req.body;
  const user = await createUser(username, password);
  res.status(201).json(user);
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
};

module.exports = {
  register,
  login,
};

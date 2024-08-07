const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Test endpoint
router.post('/test', (req, res) => {
  res.json({ message: 'Test endpoint hit' });
});

// Register endpoint
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit');
  const { firstName, lastName, email, username, password } = req.body;
  if (!firstName || !lastName || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, username, password: hashedPassword });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});


// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { username } })
    .then(user => {
      if (!user) {
        return Promise.reject({ status: 401, message: 'Invalid credentials' });
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return Promise.reject({ status: 401, message: 'Invalid credentials' });
          }

          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ token });
        });
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Error logging in', error: err.message });
      }
    });
});

module.exports = router;

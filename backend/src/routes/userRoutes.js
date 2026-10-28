const express = require('express');
const router = express.Router();
const { getUsers, getProfile, updateProfile, updatePassword } = require('../controllers/userController');

// Endpoint: GET /api/users
router.get('/', getUsers);
router.get('/profile/:dni', getProfile);
router.put('/profile/:dni', updateProfile);
router.put('/profile/:dni/password', updatePassword);

module.exports = router;

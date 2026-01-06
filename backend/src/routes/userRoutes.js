const express = require('express');
const { signup, login, getProfile, toggleDailyWordEmail, updateProfile, deleteProfile } = require('../controllers/userController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');

const router = express.Router();

// public
router.post('/signup', signup);
router.post('/login', login);  

// protected
router.get('/profile', jwtAuthMiddleware, getProfile);
router.patch('/enable-daily-email',jwtAuthMiddleware,toggleDailyWordEmail);
router.put('/updateProfile', jwtAuthMiddleware, updateProfile);
router.delete('/deleteProfile', jwtAuthMiddleware, deleteProfile);

module.exports = router;

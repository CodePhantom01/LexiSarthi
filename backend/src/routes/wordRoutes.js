const express = require('express');
const {
  addWord,
  getAllWords,
  searchWord,
  updateWord,
  deleteWord
} = require('../controllers/wordController');

const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// USER + ADMIN
router.get('/getAllWords', jwtAuthMiddleware, getAllWords);
router.get('/searchWord/:word', jwtAuthMiddleware, searchWord);

// ADMIN ONLY
router.post('/addWord', jwtAuthMiddleware, adminMiddleware, addWord);
router.put('/updateWord/:word', jwtAuthMiddleware, adminMiddleware, updateWord);
router.delete('/deleteWord/:word', jwtAuthMiddleware, adminMiddleware, deleteWord);

module.exports = router;

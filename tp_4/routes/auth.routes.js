const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/signup', verifyToken, authController.signup);
router.post('/login', authController.login);

module.exports = router;

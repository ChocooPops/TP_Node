const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

// Accessible uniquement aux admins
router.get('/', verifyToken, checkRole('admin'), userController.getAllUsers);
router.get('/:id', verifyToken, checkRole('admin'), userController.getUserById);
router.put('/:id', verifyToken, checkRole('admin'), userController.updateUser);
router.delete('/:id', verifyToken, checkRole('admin'), userController.deleteUser);

module.exports = router;

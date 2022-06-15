const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/register', authController.signup);
router.post('/login', authController.login);
// // Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .put(
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateUser)

module.exports = router;

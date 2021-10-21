
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', controllers.registerUser);
router.post('/login', controllers.loginUser);
router.get('/user/:id', auth, controllers.getUsers);
router.put('/user/:id/edit', auth, multer, controllers.editUser);
router.get('/user/:id/edit',auth,multer,controllers.getInfoUser);

module.exports = router;
const express = require('express');
const router = express.Router();

const controllers = require('../controllers/forum');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, controllers.getAllPosts);
router.post('/', auth, multer, controllers.createPost);
router.get('/:id', auth, controllers.getOnePost);
router.put('/:id', auth, controllers.modifyOnePost);
router.delete('/:id', auth, controllers.deleteOnePost);

module.exports = router;

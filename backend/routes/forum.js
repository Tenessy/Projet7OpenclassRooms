const express = require('express');
const router = express.Router();

const controllers = require('../controllers/forum');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, controllers.getAllPosts);
router.post('/', auth, multer, controllers.createPost);
router.delete('/', auth, controllers.deletePost);
router.get('/comment', auth, controllers.getAllComments);
router.get('/:id', auth, controllers.getOnePost);
router.put('/:id', auth, controllers.modifyOnePost);

router.get('/:id/comment', auth, controllers.getCommentsOnePost);
router.post('/:id/comment', auth, multer, controllers.postOneComment);
router.delete('/:id/comment', auth, multer, controllers.deleteOneComment);

router.get('/like/user', auth, controllers.getlikes);
router.delete('/like/user', auth, multer, controllers.deleteUserIdLikes);
router.post('/likes', auth, multer, controllers.postLikes);

module.exports = router;

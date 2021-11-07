const express = require('express');
const router = express.Router();

const controllers = require('../controllers/forum');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, controllers.getAllPosts);
router.post('/', auth, multer, controllers.createPost);
router.put('/', auth, multer, controllers.updateOnePost);
router.get('/:id', auth, controllers.getOnePost);
router.delete('/:id', auth, controllers.deleteOnePost);

router.put('/:id', auth, controllers.modifyOnePost);
router.get('/:id/comment', auth, controllers.getCommentsOnePost);
router.post('/:id/comment', auth, multer, controllers.postOneComment);

router.get('/like/user', auth, controllers.getlikes);
router.delete('/like/user', auth, multer, controllers.deleteUserIdLikes);
router.post('/likes', auth, multer, controllers.postLikes);




module.exports = router;

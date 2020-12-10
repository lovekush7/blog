const express = require('express');
const {
    getPosts,
    createPosts,
    postPhotoUpload,
    deletePost,
    updatePost
} = require('../controllers/post');

const Posts = require('../models/Posts');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/posts').get(getPosts);
router.route('/posts').post(protect, authorize('user', 'admin'), createPosts);
router.route('/posts/:id/photo').put(protect, authorize('user', 'admin'), postPhotoUpload);
router.route('/posts/:id')
    .put(protect, authorize('user', 'admin'), updatePost)
    .delete(protect, authorize('user', 'admin'), deletePost);

module.exports = router;
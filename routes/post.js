const express = require('express');
const {
    getPosts,
    createPosts,
    postPhotoUpload
} = require('../controllers/post');

const Posts = require('../models/Posts');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/posts').get(getPosts);
router.route('/posts').post(protect, authorize('user', 'admin'), createPosts);
router.route('/:id/photo').put(protect, authorize('user', 'admin'), postPhotoUpload);

module.exports = router;
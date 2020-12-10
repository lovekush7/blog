const path = require('path');
const Post = require('../models/Posts');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createPosts = asyncHandler(async(req, res, next) => {
    req.body.user = req.user.id;
    const { title, post, category, user } = req.body;
    const blog = await Post.create({ title, post, category, user });

    res.status(201).json({
        sucess: true,
        data: blog
    });
});

exports.getPosts = asyncHandler(async(req, res, next) => {
    const blogs = await Post.find();
    res.
    status(200)
        .json({
            success: true,
            count: blogs.length,
            data: blogs
        });
});

exports.postPhotoUpload = asyncHandler(async(req, res, next) => {
    const blog = await Post.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse(`Post is not found with id of ${req.params.id}`, 404))
    }
    // if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`,
    //         401));
    // }

    if (!req.files) {
        return next(new ErrorResponse(`please upload a file`, 400));
    }
    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(` Please upload an image file`, 400))
    }

    //make sure the type is image
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400));
    }
    // Create custom filename
    file.name = `photo_${blog._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`problem with file upload`, 500));
        }
        await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            sucess: true,
            data: file.name
        });
    });
});

//update post
exports.updatePost = asyncHandler(async(req, res, next) => {
    let blog = await Post.findById(req.params.id);

    if (!blog) {
        return next(next(new ErrorResponse(`Post isn't found with id of ${req.params.id}`,
            404)));
    }
    if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`,
            401));
    }
    blog = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: blog });
})


// delete post
exports.deletePost = asyncHandler(async(req, res, next) => {
    const blog = await Post.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse(`blog isn't found with id of ${req.params.id}`,
            404));
    }

    //make sure user is blog user
    if (blog.user.toString() !== req.params.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this blog`,
            401));
    }
    await blog.remove();
    res.status(200).json({ success: true, data: {} });
});
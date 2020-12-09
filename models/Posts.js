const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please add a title']
    },
    category: {
        type: String,
        required: [true, 'please select any one'],
        enum: ['art', 'sci-fi', 'sports', 'fashion', 'travel', 'music']
    },
    post: {
        type: String,
        required: [true, 'please add a post']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    }
});

module.exports = mongoose.model('Posts', PostSchema);
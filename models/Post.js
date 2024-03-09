const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [String],
        default: []
    },
    image: {
        type: {
            url: String
        },
        default: null
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
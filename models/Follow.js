const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        followers: {
            type: Array,
            required: true,
            default: []
        },
        following: {
            type: Array,
            required: true,
            default: []
        },
    }
)

module.exports = mongoose.model('Follow', followSchema);
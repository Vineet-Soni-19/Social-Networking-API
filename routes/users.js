const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

// Update User Endpoint
router.put('/:id', async (req, res) => {
    try {
        // Check if the request user ID matches the parameter ID
        if (req.body.userId === req.params.id) {
            // If the request includes a password, hash it
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            // Update the user document and respond
            const user = await User.findOneAndUpdate({ userId: req.params.id }, { $set: req.body });
            res.status(200).json("Account has been updated");
        } else {
            return res.status(403).json('You can update only your account');
        }
    } catch (err) {
        // Handle errors
        return res.status(500).json(err);
    }
});

// Delete User Endpoint
router.delete('/:id', async (req, res) => {
    try {
        // Check if the request user ID matches the parameter ID
        if (req.body.userId === req.params.id) {
            // Delete the user document and respond
            const user = await User.findOneAndDelete({ userId: req.params.id });
            res.status(200).json("Account has been deleted");
        } else {r
            return res.status(403).json('You can deleted only your account');
        }
    } catch (err) {
        // Handle errors
        return res.status(500).json(err);
    }
});

// Get User Endpoint
router.get("/:id", async (req, res) => {
    try {
        // Find the user by user ID and exclude sensitive information from the response
        const user = await User.findOne({ userId: req.params.id });
        // If user does not exist, return 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        // Handle errors
        return res.status(500).json(err);
    }
});

// Get the feed for a specific user
router.get("/:userId/feed", async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Find posts from the user and users they follow
        const posts = await Post.find({ userId: { $in: [...user.following, user.userId] } })
            .sort({ timestamp: -1 })
            .limit(10);

        res.status(200).json(posts);
    } catch (err) {
        console.error('Error occurred while fetching user feed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
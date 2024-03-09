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
            // If the user ID in the request does not match the parameter ID, return a forbidden error
            return res.status(403).json('You can update only your account');
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
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
        } else {
            // If the user ID in the request does not match the parameter ID, return a forbidden error
            return res.status(403).json('You can deleted only your account');
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
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
        // Handle errors and respond with appropriate status code and error message
        return res.status(500).json(err);
    }
});

// Follow User Endpoint
router.put("/:id/follow", async (req, res) => {
    try {
        // Check if the request user ID is different from the parameter ID
        if (req.body.userId !== req.params.id) {
            // Find the user and the current user
            const user = await User.findOne({ userId: req.params.id });
            const currentUser = await User.findOne({ userId: req.body.userId });
            // Check if the user is not already followed
            if (!user.followers.includes(req.body.userId)) {
                // Update followers and followings arrays and respond
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                // If the user is already followed, return a forbidden error
                res.status(403).json("You already follow this user")
            }
        } else {
            // If the request user ID is the same as the parameter ID, return a forbidden error
            res.status(403).json("You can't follow yourself")
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        res.status(500).json(err);
    }
});

// Unfollow User Endpoint
router.put("/:id/unfollow", async (req, res) => {
    try {
        // Check if the request user ID is different from the parameter ID
        if (req.body.userId !== req.params.id) {
            // Find the user and the current user
            const user = await User.findOne({ userId: req.params.id });
            const currentUser = await User.findOne({ userId: req.body.userId });
            // Check if the user is followed
            if (user.followers.includes(req.body.userId)) {
                // Update followers and followings arrays and respond
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                // If the user is not followed, return a forbidden error
                res.status(403).json("You do not follow this user")
            }
        } else {
            // If the request user ID is the same as the parameter ID, return a forbidden error
            res.status(403).json("You can't unfollow yourself")
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        res.status(500).json(err);
    }
});

// Get the list of users a given user is following
router.get("/:userId/following", async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve the list of following userIds
        const followingUserIds = user.following;

        // Find the users based on followingUserIds
        const following = await User.find({ userId: { $in: followingUserIds } }, 'userId username');

        res.status(200).json(following);
    } catch (err) {
        console.error('Error occurred while retrieving following list:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get the list of users who are following a given user
router.get("/:userId/followers", async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

         // Retrieve the list of followers' userIds
         const followerUserIds = user.followers;

         // Find the users based on followerUserIds
         const followers = await User.find({ userId: { $in: followerUserIds } }, 'userId username');

        res.status(200).json(followers);
    } catch (err) {
        console.error('Error occurred while retrieving followers list:', err);
        res.status(500).json({ error: 'Internal server error' });
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
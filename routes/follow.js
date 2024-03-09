const express = require('express');
const router = express.Router();
const Follow = require("../models/Follow");
const User = require("../models/User");

// Follow User Endpoint
router.put("/:id/follow", async (req, res) => {
    try {
        // Check if the request user ID is different from the parameter ID
        if (req.body.userId === req.params.id) {
            return res.status(403).json("You can't follow yourself");
        }

        // Find the user and the current user
        let user = await Follow.findOne({ userId: req.params.id });
        let currentUser = await Follow.findOne({ userId: req.body.userId });

        // If user or current user doesn't exist, create new follow relationship
        if (!user) {
            user = await Follow.create({
                userId: req.params.id,
                followers: [req.body.userId]
            });
        }
        if (!currentUser) {
            currentUser = await Follow.create({
                userId: req.body.userId,
                following: [req.params.id]
            });
        }

        // Check if the user is not already followed
        if (!user.followers.includes(req.body.userId)) {
            // Update followers and followings arrays and respond
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json("User has been followed");
        } else {
            // If the user is already followed, return a forbidden error
            res.status(403).json("You already follow this user");
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        console.error('Error occurred during follow:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unfollow User Endpoint
router.put("/:id/unfollow", async (req, res) => {
    try {
        // Check if the request user ID is different from the parameter ID
        if (req.body.userId === req.params.id) {
            return res.status(403).json("You can't unfollow yourself");
        }

        // Find the user and the current user
        const user = await Follow.findOne({ userId: req.params.id });
        const currentUser = await Follow.findOne({ userId: req.body.userId });

        // Check if current user doesn't exist, return error
        if (!currentUser) {
            return res.status(404).json({ error: 'You do not follow any user' });
        }

        // Check if the user is followed
        if (user.followers.includes(req.body.userId)) {
            // Update followers and followings arrays and respond
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json("User has been unfollowed");
        } else {
            // If the user is not followed, return a forbidden error
            res.status(403).json("You do not follow this user");
        }
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        console.error('Error occurred during unfollow:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get the list of users a given user is following
router.get("/:userId/following", async (req, res) => {
    try {
        // Find the user by userId
        const user = await Follow.findOne({ userId: req.params.userId });

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
        const user = await Follow.findOne({ userId: req.params.userId });

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

module.exports = router;
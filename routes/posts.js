const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create a post
router.post("/", async (req, res) => {
    try {
        // Validate input data
        if (!req.body.text || !req.body.userId) {
            return res.status(400).json({ error: "Text content and userId are required" });
        }

        // Create a new post
        const newPost = new Post({
            text: req.body.text,
            userId: req.body.userId,
            timestamp: new Date()
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        // Respond with the newly created post
        res.status(200).json(savedPost);
    } catch (err) {
        // Handle errors
        console.error('Error occurred during post creation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user is authorized to update the post
        if (post.userId !== req.body.userId) {
            return res.status(403).json({ error: 'You can update only your post' });
        }

        // Update the post
        await Post.findByIdAndUpdate(req.params.id, { $set: req.body });

        // Respond with success message
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        // Handle errors
        console.error('Error occurred during post update:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user is authorized to delete the post
        if (post.userId !== req.body.userId) {
            return res.status(403).json({ error: 'You can delete only your post' });
        }

        // Delete the post
        await Post.findByIdAndDelete(req.params.id);

        // Respond with success message
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        // Handle errors
        console.error('Error occurred during post deletion:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like or Unlike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user has already liked the post
        const alreadyLiked = post.likes.includes(req.body.userId);

        if (alreadyLiked) {
            // Unlike the post
            await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: req.body.userId } });
            res.status(200).json({ message: 'Post disliked successfully' });
        } else {
            // Like the post
            await Post.findByIdAndUpdate(req.params.id, { $push: { likes: req.body.userId } });
            res.status(200).json({ message: 'Post liked successfully' });
        }
    } catch (err) {
        // Handle errors
        console.error('Error occurred during post like/unlike:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a post
router.get("/:id", async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id);

        // If post not found, return 404 error
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Respond with the post
        res.status(200).json(post);
    } catch (err) {
        // Handle errors
        console.error('Error occurred while fetching post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// Sign Up Endpoint
router.post("/signup", async (req, res) => {
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user object with hashed password
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save the new user to the database
        const user = await newUser.save();

        // Respond with the newly created user
        res.status(200).json(user);
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        console.error('Error occurred during sign-up:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Log In Endpoint
router.post("/login", async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        // If user does not exist, return 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        // If password is invalid, return 400 error
        if (!validPassword) {
            return res.status(400).json({ error: 'Wrong password' });
        }

        // If everything is successful, respond with user information
        res.status(200).json(user);
    } catch (err) {
        // Handle errors and respond with appropriate status code and error message
        console.error('Error occurred during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

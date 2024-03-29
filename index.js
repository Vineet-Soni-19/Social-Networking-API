const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const followRoute = require("./routes/follow");

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
    console.log('Requested URL:', fullUrl);
    res.send(`<h2>Hello! I have created REST api for social networking platform</h2>
    <p>Use: <a href="${fullUrl}api/users">${fullUrl}api/users</a> for users</p>
    <p>Use: <a href="${fullUrl}api/posts">${fullUrl}api/posts</a> for posts</p>
    <p>Use: <a href="${fullUrl}api/follows">${fullUrl}api/follow</a> for follows</p>`)
});

//mongodb connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/follows", followRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
    console.log(`Backend server is running at: ${port}`);
});

// Routes for fetching users, posts, and follow data
app.get('/api/users', async (req, res) => {
    try {
        const User = require("./models/User");
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const Post = require("./models/Post");
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/follows', async (req, res) => {
    try {
        const Follow = require("./models/Follow");
        const follows = await Follow.find();
        res.json(follows);
    } catch (err) {
        console.error('Error fetching follows:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;
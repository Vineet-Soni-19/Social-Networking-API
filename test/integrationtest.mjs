import supertest from 'supertest';
import { expect } from 'chai';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import Follow from '../models/Follow.js';
import Post from '../models/Post.js';

describe('Integration Tests', () => {
    let request;

    before(() => {
        request = supertest(app);
    });

    describe('User Management', () => {
        it('should register a new user', async () => {
            const res = await request.post('/api/auth/signup').send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'testpassword'
            });
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('User created successfully');
        });

        it('should log in with valid credentials', async () => {
            const res = await request.post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'testpassword'
            });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });
    });

    describe('Post Management', () => {
        let authToken; // Token for authenticating requests
        let postId; // ID of the created post
        let decodedToken;
        before(async () => {
            // Log in as a user to obtain authentication token
            const loginRes = await request.post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'testpassword'
            });
            authToken = loginRes.body.token;
            decodedToken = jwt.decode(authToken);
        });

        it('should create a new post', async () => {
            console.log(decodedToken.userId);
            const postRes = await request.post('/api/posts/').send({
                text: 'Test post content',
                userId: decodedToken.userId
            }).set('Authorization', `Bearer ${authToken}`);
            expect(postRes.status).to.equal(200);
            expect(postRes.body).to.have.property('_id');
            postId = postRes.body._id; // Store the ID of the created post for further testing
        });

        it('should update an existing post', async () => {
            const updateRes = await request.put(`/api/posts/${postId}`).send({
                text: 'Updated post content',
                userId: decodedToken.userId
            }).set('Authorization', `Bearer ${authToken}`);
            expect(updateRes.status).to.equal(200);
            expect(updateRes.body).to.have.property('message', 'Post updated successfully');
        });

        it('should get a list of posts', async () => {
            const getPostsRes = await request.get('/api/posts').set('Authorization', `Bearer ${authToken}`);
            expect(getPostsRes.status).to.equal(200);
            // Assert that the response contains an array of posts
            expect(getPostsRes.body).to.be.an('array');
        });

        it('should like a post', async () => {
            const likeRes = await request.put(`/api/posts/${postId}/like`).send({
                userId: decodedToken.userId
            }).set('Authorization', `Bearer ${authToken}`);
            expect(likeRes.status).to.equal(200);
            expect(likeRes.body).to.have.property('message', 'Post liked successfully');
        });

        it('should delete an existing post', async () => {
            const deleteRes = await request.delete(`/api/posts/${postId}`).send({
                userId: decodedToken.userId
            }).set('Authorization', `Bearer ${authToken}`);
            expect(deleteRes.status).to.equal(200);
            expect(deleteRes.body).to.have.property('message', 'Post deleted successfully');
        });
    });


    describe('Follow/Unfollow Users', () => {
        let authToken; // Token for authenticating requests
        let userId;
        before(async () => {
            // Log in as a user to obtain authentication token
            const loginRes = await request.post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'testpassword'
            });
            authToken = loginRes.body.token;
            const user = await User.findOne({ _id: jwt.decode(authToken).userId });
            userId = user.userId;
        });

        it('should follow a user', async () => {
            const followRes = await request.put(`/api/follows/${userId}/follow`).send({
                userId: "8e300260-4187-4159-b264-e89ae6598498"
            }).set('Authorization', `Bearer ${authToken}`);
            expect(followRes.status).to.equal(200);
            expect(followRes.body).to.have.property('message', 'User has been followed');
        });

        it('should unfollow a user', async () => {
            const unfollowRes = await request.put(`/api/follows/${userId}/unfollow`).send({
                userId: "8e300260-4187-4159-b264-e89ae6598498"
            }).set('Authorization', `Bearer ${authToken}`);
            expect(unfollowRes.status).to.equal(200);
            expect(unfollowRes.body).to.have.property('message', 'User has been unfollowed');
        });

        it('should get the list of users following a given user', async () => {
            const followListRes = await request.get(`/api/follows/${userId}/followers`).set('Authorization', `Bearer ${authToken}`);
            expect(followListRes.status).to.equal(200);
            // Add assertions to check the format and content of the follow list response
        });

        it('should get the list of users a given user is following', async () => {
            const followingListRes = await request.get(`/api/follows/${userId}/following`).set('Authorization', `Bearer ${authToken}`);
            expect(followingListRes.status).to.equal(200);
            // Add assertions to check the format and content of the following list response
        });
    });

    describe('User update/ deletion', () => {
        let authToken; // Token for authenticating requests
        let userId;
        before(async () => {
            // Log in as a user to obtain authentication token
            const loginRes = await request.post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'testpassword'
            });
            authToken = loginRes.body.token;
            const user = await User.findOne({ _id: jwt.decode(authToken).userId });
            userId = user.userId;
        });

        it('should update the user', async () => {
            const followRes = await request.put(`/api/users/${userId}`).send({
                userId: userId,
                text: "Hello world"
            }).set('Authorization', `Bearer ${authToken}`);
            expect(followRes.status).to.equal(200);
            expect(followRes.body).to.have.property('message', 'Account has been updated');
        });

        it('should delete the user', async () => {
            const followRes = await request.delete(`/api/users/${userId}`).send({
                userId: userId,
            }).set('Authorization', `Bearer ${authToken}`);
            expect(followRes.status).to.equal(200);
            expect(followRes.body).to.have.property('message', 'Account has been deleted');
        });
    })
    after(async () => {
        const userId = await User.findOne({ email: "test@example.com" }).userId;
        console.log(userId);
        await User.deleteMany({ userId: userId  });
        await Post.deleteMany({ userId: userId });
        await Follow.deleteMany({ userId: userId });
    });
});

# Social Networking API

Welcome to the Social Networking API, a Node.js application that provides endpoints for user authentication, post management, and social interactions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [API Documentation](#api-documentation)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/social-networking-api.git
   ```

2. Navigate to the project directory:

   ```
   cd social-networking-api
   ```

3. Install dependencies:

   ```
   npm install bcrypt dotenv express helmet jsonwebtoken mongodb mongoose morgan nodemon uuid
   ```
   This will install the following dependencies:

- bcrypt: Library for hashing passwords.
- dotenv: Module for loading environment variables from a .env file.
- express: Web framework for Node.js.
- helmet: Middleware for securing Express apps with various HTTP headers.
- jsonwebtoken: Implementation of JSON Web Tokens (JWT) for authentication.
- mongodb: MongoDB driver for Node.js.
- mongoose: MongoDB object modeling tool for Node.js.
- morgan: HTTP request logger middleware for Express.
- nodemon: Utility that automatically restarts the server when changes are detected.
- uuid: Library for generating UUIDs (Universally Unique Identifiers).

4. Create a `.env` file in the root directory of the project:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   Replace `your_mongodb_connection_string` with the connection string for your MongoDB database and `your_jwt_secret_key` with a secret key for JWT token generation.

## Usage

To use the Social Networking API, follow these steps:

1. Register a new user using the `/signup` endpoint.
2. Log in with your credentials using the `/login` endpoint to obtain a JWT token.
3. Use the JWT token to authenticate subsequent requests to protected endpoints.
4. Create, update, view, and delete user profiles and posts as needed.
5. Interact with other users by following and unfollowing them, liking and unliking their posts, and viewing their profiles.

## Features

The Social Networking API offers the following features:

- User authentication using JWT tokens.
- User profile management, including registration, login, profile viewing, and profile updates.
- Post management, allowing users to create, update, view, and delete posts.
- Social interactions such as following and unfollowing users, liking and unliking posts.

## API Endpoints

The following API endpoints are available in the Social Networking API:

- `POST /signup`: Register a new user.
- `POST /login`: Authenticate and log in a user.
- `GET /profile/:userId`: Get user profile information.
- `PUT /profile/:userId`: Update user profile information.
- `POST /post`: Create a new post.
- `PUT /post/:postId`: Update an existing post.
- `DELETE /post/:postId`: Delete a post.
- `PUT /post/:postId/like`: Like a post.
- `PUT /post/:postId/unlike`: Unlike a post.
- `PUT /user/:userId/follow`: Follow a user.
- `PUT /user/:userId/unfollow`: Unfollow a user.
- `GET /user/:userId/following`: Get the list of users a given user is following.

## Authentication

Authentication in the Social Networking API is handled using JWT tokens. After successfully logging in, users receive a JWT token that must be included in subsequent requests to protected endpoints for authentication.

## Testing

To run tests for the Social Networking API, use the following command:

```
npm test
```
## API Documentation

The API documentation for the Social Networking API can be found [here](https://documenter.getpostman.com/view/30350776/2sA2xh3Ctp).

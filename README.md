# Spotify Clone API

A Node.js and Express backend for a Spotify-style music application. The project includes user authentication, role-based access control, music uploads, album creation, and read endpoints for music and album data.

## Features

- User registration, login, and logout
- JWT authentication stored in an HTTP cookie
- User and artist roles
- Artist-only music upload
- Artist-only album creation
- Authenticated music and album browsing
- MongoDB persistence with Mongoose
- ImageKit storage integration for uploaded music files

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Multer
- ImageKit
- cookie-parser
- dotenv

## Project Structure

```text
.
├── server.js
├── package.json
└── src
    ├── app.js
    ├── controllers
    │   ├── auth.controller.js
    │   └── music.controllers.js
    ├── db
    │   └── db.js
    ├── middlewares
    │   └── auth.middlewares.js
    ├── models
    │   ├── album.models.js
    │   ├── music.models.js
    │   └── user.models.js
    ├── routes
    │   ├── auth.routes.js
    │   └── music.routes.js
    └── services
        └── storage.services.js
```

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB database connection string
- ImageKit private key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Run the Server

Start the server in production mode:

```bash
npm start
```

Start the server in development mode with nodemon:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

## Authentication

Successful registration and login responses set a `token` cookie. Protected routes read this cookie and validate it with `JWT_SECRET`.

There are two roles:

- `user`: Can access public music and album browsing endpoints.
- `artist`: Can upload music and create albums.

## API Documentation

### Auth Routes

Base path:

```text
/api/auth
```

#### Register User

```http
POST /api/auth/register
```

Creates a new user account and sets an authentication cookie.

Request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

The `role` field can be `user` or `artist`. If omitted, the default role is `user`.

Success response:

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "hashed_password",
    "role": "user"
  }
}
```

Possible errors:

- `409`: User with the same email or username already exists
- `500`: Internal server error

#### Login User

```http
POST /api/auth/login
```

Logs in an existing user and sets an authentication cookie.

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

You can also log in with `username` instead of `email`:

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

Success response:

```json
{
  "message": "Login successful"
}
```

Possible errors:

- `404`: User not found
- `401`: Invalid password

#### Logout User

```http
POST /api/auth/logout
```

Clears the authentication cookie.

Success response:

```json
{
  "message": "Logout successful"
}
```

### Music Routes

Base path:

```text
/api/music
```

#### Upload Music

```http
POST /api/music/artist-login
```

Uploads a music file to ImageKit and creates a music document. This endpoint requires an authenticated `artist` account.

Content type:

```text
multipart/form-data
```

Form fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | Yes | Music title |
| `music` | file | Yes | Audio file to upload |

Success response:

```json
{
  "message": "Music uploaded successfully",
  "music": {
    "_id": "music_id",
    "uri": "https://ik.imagekit.io/...",
    "title": "Song Title",
    "artist": "artist_user_id"
  }
}
```

Possible errors:

- `401`: Missing or invalid token
- `403`: Authenticated user is not an artist

#### Create Album

```http
POST /api/music/create-album
```

Creates an album for the authenticated artist.

Requires role:

```text
artist
```

Request body:

```json
{
  "title": "Album Title",
  "musics": ["music_id_1", "music_id_2"]
}
```

Success response:

```json
{
  "message": "Album created successfully",
  "album": {
    "id": "album_id",
    "title": "Album Title",
    "musics": ["music_id_1", "music_id_2"],
    "artist": "artist_user_id"
  }
}
```

Possible errors:

- `401`: Missing or invalid token
- `403`: Authenticated user is not an artist

#### Get All Music

```http
GET /api/music
```

Returns all music records with artist details populated.

Requires role:

```text
user
```

Success response:

```json
{
  "message": "Musics retrieved successfully",
  "musics": [
    {
      "_id": "music_id",
      "uri": "https://ik.imagekit.io/...",
      "title": "Song Title",
      "artist": {
        "_id": "user_id",
        "username": "artistname",
        "email": "artist@example.com",
        "role": "artist"
      }
    }
  ]
}
```

Possible errors:

- `401`: Missing or invalid token
- `403`: Authenticated user does not have the `user` role

#### Get All Albums

```http
GET /api/music/albums
```

Returns all albums with basic artist information.

Requires role:

```text
user
```

Success response:

```json
{
  "message": "Albums retrieved successfully",
  "albums": [
    {
      "_id": "album_id",
      "title": "Album Title",
      "artist": {
        "_id": "artist_user_id",
        "username": "artistname",
        "email": "artist@example.com"
      }
    }
  ]
}
```

Possible errors:

- `401`: Missing or invalid token
- `403`: Authenticated user does not have the `user` role

#### Get Music in an Album

```http
GET /api/music/albums/:albumId
```

Returns a single album with its music list and artist details populated.

Requires role:

```text
user
```

Path parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `albumId` | string | MongoDB ObjectId of the album |

Success response:

```json
{
  "message": "Album musics retrieved successfully",
  "musics": {
    "_id": "album_id",
    "title": "Album Title",
    "musics": [
      {
        "_id": "music_id",
        "uri": "https://ik.imagekit.io/...",
        "title": "Song Title",
        "artist": "artist_user_id"
      }
    ],
    "artist": {
      "_id": "artist_user_id",
      "username": "artistname",
      "email": "artist@example.com"
    }
  }
}
```

Possible errors:

- `401`: Missing or invalid token
- `403`: Authenticated user does not have the `user` role

## Data Models

### User

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `username` | string | Yes | Unique |
| `email` | string | Yes | Unique |
| `password` | string | Yes | Stored as a bcrypt hash |
| `role` | string | No | `user` or `artist`, defaults to `user` |

### Music

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `uri` | string | Yes | Uploaded file URL |
| `title` | string | Yes | Music title |
| `artist` | ObjectId | Yes | References `User` |

### Album

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Album title |
| `musics` | ObjectId[] | No | References `Music` documents |
| `artist` | ObjectId | Yes | References `User` |

## Notes

- Protected routes require the `token` cookie returned by register or login.
- Artist-only routes require a JWT payload with `role: "artist"`.
- User browsing routes currently require a JWT payload with `role: "user"`.
- Uploaded music files are stored in the `spotify-clone` folder in ImageKit.

# Bindu Backend

## Overview

The Bindu backend serves as the core data management and authentication layer for the non-invasive blood group detection system. Built with Node.js and Express, it handles user authentication, profile management, and detection history logging. Additionally, it integrates with a local hardware scanner SDK and manages file uploads before the frontend communicates with the independent Machine Learning prediction service.

## Responsibilities

- **User Registration & Login:** Secure authentication utilizing bcrypt and JSON Web Tokens (JWT).
- **User Management:** Profile updates, password recovery via email, and profile picture uploads.
- **Admin Functionality:** Dashboard API for administrators to view, block, delete, or change roles for users, and view system-wide detection records.
- **Detection History:** Storing and retrieving fingerprint detection records (predicted blood group, confidence score, image quality).
- **Hardware Integration:** Providing endpoints to launch a local fingerprint scanner SDK and watch a temporary folder for hardware outputs.
- **Image Handling:** Using Multer to store uploaded profile pictures and fingerprint scans locally.
- **Email Notifications:** Sending customized detection result reports to users via the Resend API, and password reset links via Nodemailer.

## Technology Stack

| Technology     | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| **Node.js**    | Server runtime environment.                                         |
| **Express.js** | Web framework for routing and middleware handling.                  |
| **MongoDB**    | NoSQL database for flexible document storage.                       |
| **Mongoose**   | Object Data Modeling (ODM) library for MongoDB.                     |
| **JWT**        | Secure token-based authentication (`jsonwebtoken`).                 |
| **bcrypt**     | Cryptographic hashing for user passwords.                           |
| **Joi**        | Request payload validation.                                         |
| **Multer**     | Middleware for handling `multipart/form-data` (file uploads).       |
| **Nodemailer** | SMTP client used for sending password reset emails.                 |
| **Resend API** | External service used for sending stylish prediction result emails. |

## Project Structure

```text
Backend/
├── Controllers/
│   ├── AuthController.js       # Handles login, registration, profile updates, and password resets
│   ├── DetectionController.js  # Handles fetching, saving, and downloading detection records
│   ├── EmailController.js      # Integrates with Resend API for prediction emails
│   └── ScannerController.js    # Manages local hardware scanner SDK launch and file watching
├── Middlewares/
│   ├── AuthValidation.js       # Joi schemas for validating auth payloads
│   ├── RoleAuth.js             # Middleware enforcing Admin role access
│   └── UploadMiddleware.js     # Multer configuration for image uploads
├── Models/
│   ├── Admin.js                # Mongoose schema for Admin-specific collection
│   ├── User.js                 # Mongoose schema for Users (includes Detection subdocument)
│   ├── createDefaultAdmin.js   # Script to initialize a default admin user
│   └── db.js                   # MongoDB connection logic
├── Routes/
│   ├── AdminRouter.js          # Admin-only endpoints
│   └── AuthRouter.js           # Public and user-authenticated endpoints
├── Ml_server/                  # Independent Flask ML microservice (documented separately)
├── uploads/                    # Local storage for Multer
│   ├── fingerprints/           # Stored fingerprint images
│   └── profile-pictures/       # Stored user avatars
├── .env                        # Environment configuration
├── index.js                    # Express application entry point
└── package.json                # Project dependencies and scripts
```

## System Architecture

1. **Client Request:** The React frontend sends an HTTP request to the Express API.
2. **Validation & Auth:** Express middleware (`Joi`, `jsonwebtoken`) validates the request payload and checks for a valid Bearer token.
3. **Controller Logic:** The appropriate controller processes the request, interacting with the file system (`Multer`) or external services (`Nodemailer`, `Resend`).
4. **Database Operations:** The controller uses `Mongoose` to read/write to the `MongoDB` database.
5. **Response:** A JSON response is returned to the frontend.

## ML Server Integration Flow

Unlike monolithic setups, the backend acts as a storage and coordination layer rather than a proxy for the ML service:

1. **Upload:** User submits a fingerprint image via the Frontend.
2. **Storage:** The Frontend sends the image to the Node.js Backend (`/auth/upload-fingerprint`), which stores it locally via Multer.
3. **Inference:** The Frontend simultaneously sends the image directly to the independent Flask ML Server (`/predict`).
4. **Result:** The Flask ML Server performs CNN inference and returns the predicted blood group to the Frontend.
5. **Record Saving:** The Frontend submits the final prediction results back to the Node.js Backend (`/auth/update-fingerprint`) to be saved in the MongoDB database.

## Database

### `UserModel` (Collection: `users`)

Manages standard users, their profiles, and their embedded detection histories.

| Field              | Type    | Attributes        | Description                                  |
| ------------------ | ------- | ----------------- | -------------------------------------------- |
| `name`             | String  | Required          | User's full name.                            |
| `email`            | String  | Required, Unique  | User's email address (used for login).       |
| `password`         | String  | Required          | Bcrypt hashed password.                      |
| `phone`            | String  | Required, Unique  | 11-digit phone number.                       |
| `gender`           | Enum    | Optional          | "Male", "Female", or "Other".                |
| `dateOfBirth`      | Date    | Optional          | User's birth date.                           |
| `role`             | Enum    | Default: `"user"` | `"user"` or `"admin"`.                       |
| `isBlocked`        | Boolean | Default: `false`  | Access control flag.                         |
| `fingerprintImage` | String  | Optional          | Path to the latest uploaded fingerprint.     |
| `profilePicture`   | String  | Optional          | Path to user's avatar.                       |
| `detectionHistory` | Array   | Optional          | Embedded array of `detectionSchema` objects. |

### `detectionSchema` (Subdocument of User)

| Field            | Type   | Attributes          | Description                     |
| ---------------- | ------ | ------------------- | ------------------------------- |
| `bloodGroup`     | String | Required            | Predicted blood group label.    |
| `confidence`     | Number | Default: `0`        | AI confidence percentage.       |
| `imageQuality`   | Number | Default: `0`        | Algorithmic quality score.      |
| `processingTime` | Number | Default: `0`        | Time taken for inference in ms. |
| `filename`       | String | Required            | Reference to the image file.    |
| `timestamp`      | Date   | Default: `Date.now` | Time of detection.              |

### `AdminModel` (Collection: `admins`)

A secondary collection specifically tracking elevated administrative accounts for system redundancy. Contains `name`, `email`, `password`, `role`, and `isBlocked`.

## Authentication and Authorization

1. **Registration:** Validated by `Joi`. Passwords are hashed with `bcrypt` before saving to MongoDB.
2. **Login:** Verifies credentials. On success, generates a JWT signed with `JWT_SECRET`.
3. **JWT Validation:** Protected routes use the `authenticateToken` middleware to verify the `Authorization: Bearer <token>` header.
4. **Role-Based Authorization:** Admin routes are protected by a secondary `requireRole("admin")` middleware, ensuring only elevated users can access system records.
5. **Blocking System:** Admins can set `isBlocked: true` on a user. Subsequent frontend API calls intercept this and forcefully clear the user's session.

## API Documentation

### Auth & User Routes (`/auth`)

| Method | Endpoint                 | Authentication | Description                             |
| ------ | ------------------------ | -------------- | --------------------------------------- |
| POST   | `/register`              | None           | Register a new user account.            |
| POST   | `/login`                 | None           | Authenticate and receive a JWT.         |
| POST   | `/forgot-password`       | None           | Request a password reset email.         |
| GET    | `/me`                    | JWT            | Get current user's profile data.        |
| PUT    | `/update-profile`        | JWT            | Update profile details and avatar.      |
| POST   | `/upload-fingerprint`    | JWT            | Upload fingerprint image via Multer.    |
| POST   | `/update-fingerprint`    | JWT            | Save ML prediction results to history.  |
| GET    | `/detection-history`     | JWT            | Retrieve all past detections for user.  |
| POST   | `/send-prediction-email` | None           | Send prediction results via Resend API. |

### Admin Routes (`/admin`)

| Method | Endpoint                 | Authentication | Description                         |
| ------ | ------------------------ | -------------- | ----------------------------------- |
| GET    | `/users`                 | JWT + Admin    | Fetch all registered users.         |
| POST   | `/users/:userId/block`   | JWT + Admin    | Toggle a user's blocked status.     |
| PUT    | `/users/:userId/role`    | JWT + Admin    | Promote/demote a user role.         |
| GET    | `/detection-records`     | JWT + Admin    | Fetch all system detection records. |
| DELETE | `/detection-records/:id` | JWT + Admin    | Delete a specific detection record. |

### Hardware Scanner Routes (Root)

| Method | Endpoint              | Authentication | Description                               |
| ------ | --------------------- | -------------- | ----------------------------------------- |
| POST   | `/create-temp-folder` | None           | Creates a local directory for scanner.    |
| POST   | `/launch-scanner`     | None           | Executes the hardware scanner SDK.        |
| POST   | `/watch-fingerprint`  | None           | Polls directory for newly scanned `.bmp`. |

## Request and Response Examples

**POST `/auth/login` Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**POST `/auth/login` Response:**

```json
{
  "message": "Login success",
  "success": true,
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "name": "John Doe",
  "role": "user"
}
```

## File/Image Upload

File uploads are managed by **Multer** (`Middlewares/UploadMiddleware.js`).

- **Endpoints:** `/auth/upload-fingerprint`, `/auth/update-profile`
- **Accepted Types:** `image/*` only.
- **Size Limit:** 5MB per file.
- **Storage:** Local filesystem (`uploads/fingerprints` and `uploads/profile-pictures`).
- **Filename Handling:** Files are renamed to include the user's ID, a timestamp, and a random string to prevent collisions (e.g., `fingerprint-64a1b-169823491-1234.jpg`).

## Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Server Configuration
PORT=8080

# Database
MONGO_CONN=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email Support (Nodemailer - Forgot Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Email Support (Resend API - Prediction Reports)
RESEND_API_KEY=re_your_resend_api_key

# Frontend URL (For email links)
FRONTEND_URL=http://localhost:5173
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to backend directory:**
   ```bash
   cd Final-project-main/Backend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Configure Environment:**
   Create a `.env` file based on the variables listed above.
5. **(Optional) Create Default Admin:**
   ```bash
   node Models/createDefaultAdmin.js
   ```

## Running

- **Development/Production:**
  ```bash
  npm start
  ```
- **Server Port:** Runs on `8080` by default (or the `PORT` specified in `.env`).
- **Health Check Endpoint:** `GET /ping` (Returns `PONG`).

## Error Handling

The backend uses standard Express error-handling patterns within `try...catch` blocks.

- **Validation Errors:** Handled by Joi middleware, returning `400 Bad Request` with specific field errors.
- **Authentication Errors:** `401 Unauthorized` for invalid/missing JWTs.
- **Resource Not Found:** `404 Not Found` when requesting non-existent users or records.
- **Server Errors:** `500 Internal Server Error` containing the `error.message` for debugging.

## Security

- **bcrypt:** Passwords are never stored in plain text.
- **JWT:** Stateless, tamper-proof authentication.
- **Joi:** Strict schema validation prevents NoSQL injection and malformed payloads.
- **CORS:** Enabled globally via the `cors` package to restrict cross-origin requests.
- **Role-Based Access:** Administrative routes dynamically check the authenticated user's role against the MongoDB record to prevent privilege escalation.

## External Services

- **MongoDB Atlas:** Hosted NoSQL database for scalable data storage.
- **Nodemailer (Gmail SMTP):** Used for dispatching secure password reset tokens.
- **Resend API:** Used for generating and sending stylized HTML emails containing blood group detection results.

## Troubleshooting

- **MongoDB Connection Error:** Ensure your IP address is whitelisted in MongoDB Atlas and that `MONGO_CONN` is formatted correctly.
- **JWT Verification Fails:** Ensure the `JWT_SECRET` in your `.env` exactly matches the secret used to sign the token.
- **Multer Directory Errors:** Ensure the Node.js process has write permissions to create and write to the `uploads/` directory.

## License

No license is currently specified in the repository.

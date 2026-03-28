# MoneyCorner: Full-Stack MERN Technical Documentation

## 1. Project Overview
**MoneyCorner** is a modern, full-stack blog publishing platform designed for developers, designers, and writers to share insights and build a community. The application provides a seamless experience for both readers and content creators, featuring a robust administration system for content management.

### Main Features
*   **Dynamic Blog System**: Create, read, update, and delete blogs with markdown support.
*   **Tagging & Filtering**: Categorize content with custom tags for efficient discovery.
*   **Announcement Engine**: Site-wide updates and priority news managed by administrators.
*   **Dual Authentication**: Secure login via Email/Password or one-click Google OAuth.
*   **User Interactions**: Like blogs, save stories to favorites, and engage through comments.
*   **Admin Dashboard**: Centralized hub for managing users, blogs, announcements, and site statistics.
*   **Personalized Feeds**: Tracking of reading history and favorite content for logged-in users.

---

## 2. Tech Stack

### Frontend
*   **React**: Chosen for its component-based architecture and efficient Virtual DOM rendering.
*   **Vite**: A next-generation frontend tool providing fast build times and superior DX.
*   **Axios**: For handling HTTP requests with interceptors for global error management.
*   **Lucide React**: Provides a comprehensive and lightweight library of icons.
*   **React Router Dom**: Manages SPAs routing with protected and public views.

### Backend
*   **Node.js & Express**: Scalable and performant environment for RESTful APIs.
*   **MongoDB & Mongoose**: NoSQL database with document modeling and validation.
*   **Google Auth Library**: Securely verifies Google ID tokens on the server.
*   **jsonwebtoken**: Used for creating and verifying stateless authentication tokens.
*   **bcryptjs**: Salted password hashing for credential security.

---

## 3. Project Architecture
The project follows a decoupled **Client-Server Architecture**.

### Separation of Concerns
*   **Backend (REST API)**: Handles business logic, database persistence, and security. Organized into Models, Controllers, and Routes.
*   **Frontend (SPA)**: Responsible for the presentation layer and user interaction. Communicates with the backend exclusively via JSON APIs.

### Folder Structure
*   `/server`: Contains the entry point `index.js`, route definitions, controller logic, and database models.
*   `/client/src`: Contains the UI components, page layouts, global context (Auth), and API service layers.

---

## 4. Database Design
The database utilizes MongoDB with four primary collections:

### 1. User Model
Stores identity and personalization data.
*   `name`, `email`, `password` (hashed).
*   `role`: Enum (`user`, `admin`) to control access.
*   `favorites`: Array of references to `Blog`.
*   `readingHistory`: Log of recently viewed blogs.
*   `token` & `tokenExpires`: Session tracking tokens.

### 2. Blog Model
The core content entity.
*   `title`, `content` (Markdown support).
*   `author`: Reference to `User`.
*   `tags`: Indexed array for categorization and filtering.
*   `likes`: List of users who liked the post.

### 3. Announcement Model
*   `title`, `content`.
*   `important`: Priority flag to highlight critical updates in the UI.

### 4. Comment Model
*   `blog` & `user`: Foreign keys to link content.
*   `text`: Content of the user feedback.

---

## 5. Authentication System
MoneyCorner implements a hybrid authentication system.

### Email/Password Flow
1.  **Hashed storage**: Passwords are saved using `bcrypt` (12 rounds).
2.  **JWT Issue**: On successful login, a JSON Web Token (JWT) is signed containing the userId and sent to the client. It is configured with a 7-day expiration.

### Google OAuth Flow
1.  **Frontend Identity**: Receives an ID Token from Google Login.
2.  **Server Verification**: Backend verifies the token authenticity with Google's servers.
3.  **Cross-Platform session**: Issues a regular system token to maintain the session.

### Authorization
*   **`auth` Middleware**: Validates requested tokens against the database.
*   **Role Check**: `adminOnly` middleware guards sensitive routes like blog deletion and announcement creation.

---

## 6. API Design
*Base URL: `/api`*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/users/register` | Create a new account | No |
| POST | `/users/google-login` | OAuth Login | No |
| GET | `/blog/getAll?tag=...` | List blogs (with optional tag filter) | No |
| POST | `/blog/create` | Publish new blog | Yes (Admin) |
| POST | `/announcements/create` | Post site-wide update | Yes (Admin) |
| GET | `/blog/search?query=...` | Full-text search (Title, Body, Tags) | No |

---

## 7. Error Handling & Security
*   **Centralized Error Handling**: A global `errorMiddleware` captures all failures and returns consistent JSON responses.
*   **Input Sanitization**: Mongoose schemas prevent NoSQL injection by enforcing strict typing.
*   **Environment Protection**: Credentials are kept in `.env` files, which are excluded from Git via `.gitignore`.
*   **CORS & Security Headers**: Uses `helmet` and `cors` to prevent cross-site scripting and unauthorized domain access.

---

## 8. Important 
### How is search and filtering optimized?
**A:** We use MongoDB **indexing**. Specifically, a direct index on the `tags` array and a text index on the `title` and `content`. This allows for extremely fast searches even as the database grows.

### How did you handle 401 Unauthorized errors globally?
**A:** I implemented an **Axios Interceptor**. Every time the frontend receives a 401 status from the API, the interceptor automatically triggers the logout function in the `AuthContext`, wiping the local token and redirecting the user to the login page.

---

## 9. Project Flow: User Login
1.  User submits credentials to `/login`.
2.  **Backend Verification**: Server verifies credentials and signs a JWT token using a secret key.
3.  **Client Storage**: Frontend receives the token and stores it in `localStorage`.
4.  **Auth Context**: `AuthProvider` decodes the token (or uses it for `/me` fetch) to establish the session.
5.  **Headers**: All subsequent requests include the JWT in the `Authorization: Bearer <token>` header.

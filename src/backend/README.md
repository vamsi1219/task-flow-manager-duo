
# Task Management Backend API

This is the backend API for the Task Management application. It provides endpoints for user authentication, task management, and user management.

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
cd src/backend
npm install express mongoose cors bcryptjs jsonwebtoken
```

2. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key-change-this-in-production
```

3. Start the server:
```bash
node server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new employee user
- `POST /api/auth/login` - Login a user and get JWT token
- `GET /api/auth/me` - Get current user details (requires authentication)

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)

### Tasks
- `GET /api/tasks` - Get all tasks (requires authentication)
- `GET /api/tasks/user/:userId` - Get tasks assigned to a specific user (requires authentication)
- `POST /api/tasks` - Create a new task (requires authentication)
- `PATCH /api/tasks/:id/status` - Update task status (requires authentication)
- `DELETE /api/tasks/:id` - Delete a task (requires admin authentication)

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer your-token-here
```

## Default Admin User

A default admin user is created when the server starts for the first time:
- Email: admin@example.com
- Password: admin123

Make sure to change this in production.

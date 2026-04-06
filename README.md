# Finance Data Processing Backend

A Node.js backend application for processing financial records with role-based access control.

## Description

This backend provides user management, financial record CRUD operations, filtering, and dashboard summaries. It implements role-based access control using request headers for authentication simulation.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## Project Structure

```
├── config/          # Database configuration
├── controllers/     # Route handlers
├── middleware/      # Role-based access control
├── models/          # Mongoose schemas
├── routes/          # Express routes
├── utils/           # ID generation utility
├── index.js         # Server entry point
└── package.json     # Dependencies and scripts
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running on `localhost:27017`
4. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Users
- `POST /users` - Create user
- `GET /users` - Get all users (admin only)
- `GET /users/:id/balance` - Get user available balance (viewer/analyst/admin)
- `PUT /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

### Records
- `POST /records` - Create record (admin/analyst)
- `GET /records` - Get records with optional filters (analyst/admin)
  - Query params: `?type=income&category=salary`
- `PUT /records/:id` - Update record (admin/analyst)
- `DELETE /records/:id` - Delete record (admin only)

### Summary
- `GET /summary` - Get dashboard summary (viewer/analyst/admin)

## Access Control

- **Admin**: Full access to users and records
- **Analyst**: Can view/update records and access summary
- **Viewer**: Can only access dashboard summary

Authentication is simulated using request headers.

## How to Test

Use Postman or similar tool. Include these headers in requests:

- `Content-Type: application/json`
- `role: admin | analyst | viewer`
- `user-id: USR001` (for record creation and viewer summary)
- `username: Jane Doe` (for record creation)

## Sample Request Example

**Create User:**
```
POST /users
Headers:
  Content-Type: application/json
  role: admin

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "analyst"
}
```

**Get Summary:**
```
GET /summary
Headers:
  role: viewer
  user-id: USR001
```

## Notes / Assumptions

- MongoDB must be running locally on default port
- Custom IDs are auto-generated (USR001, REC001)
- User balances are updated automatically with record changes
- Viewer can only access their own summary and balance
- Error responses include appropriate HTTP status codes
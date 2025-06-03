# Counselairi Backend

A Node.js Express backend server with Supabase integration for authentication and database management.

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
│   └── auth.controller.js
├── dtos/            # Data Transfer Objects and validation schemas
│   └── auth.dto.js
├── middleware/      # Custom middleware
├── routes/          # Route definitions
│   └── auth.routes.js
├── services/        # Business logic and external service integrations
├── utils/           # Utility functions and helpers
└── index.js         # Application entry point
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ email, password, firstName, lastName }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
- `POST /api/auth/logout` - Logout user

## Features

- Express.js server with middleware setup
- Supabase integration for authentication and database
- Input validation using Zod
- Error handling middleware
- Security features (helmet, cors)
- Logging (morgan)

## Development

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests 
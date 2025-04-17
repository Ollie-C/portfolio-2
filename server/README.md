# Contact Form API Server

A secure Express.js backend server for handling contact form submissions from the portfolio site.

## Features

- **Security**: Implements security best practices with Helmet, CORS, and input validation
- **Rate Limiting**: Prevents abuse with request limits
- **Validation**: Validates all form inputs
- **Sanity Integration**: Stores contact messages in Sanity CMS
- **Environment Configuration**: Uses environment variables for configuration

## Setup

1. Create a `.env` file with the following variables:

   ```
   PORT=3001
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_TOKEN=your_sanity_write_token
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Deployment

For production deployment:

1. Set up a hosting platform (Vercel, Render, Heroku, etc.)
2. Configure the environment variables
3. Deploy the server

## API Endpoints

- `POST /api/contact`: Submit a contact form
  - Requires: `name`, `email`, `message`
  - Returns: `{ success: true }` or error details
- `GET /api/health`: Health check endpoint
  - Returns: `{ status: "ok" }`

## Security Considerations

- The server uses a Sanity write token that should be kept secure
- CORS is configured to only allow requests from specified origins
- Rate limiting prevents abuse of the API
- All inputs are validated and sanitized

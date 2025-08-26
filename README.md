# Nursery Registration API

A Node.js Express API server for processing nursery registration forms with Firebase integration and document extraction capabilities.

## Features

- 📄 PDF document processing and data extraction
- 🔥 Firebase Admin SDK integration
- 👤 User authentication management
- 📋 Structured form data extraction
- 🌐 CORS-enabled for cross-origin requests
- 📁 File upload handling with Multer

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Admin SDK credentials
- Access to the document analysis API

## Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure you have the Firebase service account key file:
   - `nursery-project-89d8b-firebase-adminsdk-fbsvc-19a2a10086.json`

## Usage

### Development Mode

Run the server with auto-restart on file changes:

```bash
npm run dev
```

### Production Mode

Start the server:

```bash
npm start
```

The server will start on port 8000 by default, or the port specified in the `PORT` environment variable.

## API Endpoints

### POST `/extract`

Processes uploaded PDF files and extracts structured data.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file upload

**Response:**

```json
{
  "extracted_schema": {
    "childName": "string",
    "age": "string",
    "dateOfBirth": "string"
    // ... more extracted fields
  }
}
```

### POST `/api/deleteUserFromAuth`

Deletes a user from Firebase Authentication.

**Request:**

- Method: POST
- Content-Type: application/json
- Body:
  ```json
  {
    "uid": "string",
    "email": "string"
  }
  ```

**Response:**

```json
{
  "success": true
}
```

## Project Structure

```
├── server.js                 # Main Express server file
├── package.json              # Project dependencies and scripts
├── uploads/                  # Temporary file upload directory
├── nursery-project-***.json  # Firebase service account credentials
└── README.md                 # This file
```

## Environment Variables

- `PORT`: Server port (default: 8000)

## Firebase Functions

This project is also configured to deploy as Firebase Functions. Use:

```bash
npm run deploy
```

## Security Notes

- The Firebase service account key file contains sensitive credentials
- Ensure proper CORS configuration for production
- Validate and sanitize all input data
- Use HTTPS in production environments

## Dependencies

### Production Dependencies

- **express**: Web framework
- **multer**: File upload middleware
- **axios**: HTTP client
- **form-data**: Form data handling
- **cors**: Cross-origin resource sharing
- **firebase-admin**: Firebase Admin SDK
- **firebase-functions**: Firebase Functions SDK

### Development Dependencies

- **nodemon**: Auto-restart server during development

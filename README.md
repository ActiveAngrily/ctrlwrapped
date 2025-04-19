# Ctrl PLUS Wrapped

Your internet journey, wrapped up in one scroll.

## Features

- Authentication system with Appwrite
- User registration and login
- Secure file uploading
- Responsive design for all screen sizes
- Protection against unauthorized content copying

## Tech Stack

- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Appwrite (self-hosted via Docker)
- Authentication: Appwrite Auth

## Project Structure

```
ctrl-plus-wrapped/
├── docker/
│   └── docker-compose.yml  # Docker configuration for Appwrite
├── public/
│   ├── index.html          # Main landing page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   └── favicon.ico
├── src/
│   ├── assets/             # Fonts and images
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   └── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Node.js and npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/anant-j/ctrl-plus-wrapped.git
   cd ctrl-plus-wrapped
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start Appwrite using Docker:
   ```
   cd docker
   docker-compose up -d
   ```

4. Access the Appwrite console at http://localhost and complete the setup:
   - Create a new project
   - Set up a Web platform with your local domain
   - Create a new database
   - Set up authentication

5. Create a `.env` file with your Appwrite configuration:
   ```
   APPWRITE_ENDPOINT=http://localhost/v1
   APPWRITE_PROJECT_ID=your-project-id
   ```

6. Start the development server:
   ```
   npm start
   ```

## Setting Up Appwrite

1. After starting Appwrite with Docker, navigate to http://localhost
2. Complete the initial Appwrite setup
3. Create a new project
4. In Project Settings, add a Web platform with your domain (e.g., http://localhost:8080)
5. Create necessary collections for your data
6. Update the project ID in `src/js/appwrite.js`

## Authentication Flow

The authentication system includes:
- User registration with email, password, and username
- Login functionality
- Session management
- Password visibility toggle
- Form validation

## File Security

The project includes protection features against:
- Right-click context menu
- Text selection of non-interactive elements
- Image dragging and downloading
- Keyboard shortcuts that could compromise content

## License

MIT License
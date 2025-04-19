# Ctrl PLUS Wrapped

Your internet journey, wrapped up in one scroll.

## Features

- Authentication system with Appwrite Cloud
- User registration and login
- Secure file uploading
- Responsive design for all screen sizes
- Protection against unauthorized content copying

## Tech Stack

- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Appwrite Cloud
- Authentication: Appwrite Auth

## Project Structure

```
ctrl-plus-wrapped/
├── public/               # Static HTML files
│   ├── index.html        # Main landing page
│   ├── login.html        # Login page
│   └── register.html     # Registration page
├── src/
│   ├── assets/           # Fonts and images
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript modules
│   └── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js and npm
- Appwrite Cloud account (free tier)

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

3. Create an Appwrite Cloud account and set up a project:
   - Sign up at [Appwrite Cloud](https://cloud.appwrite.io/)
   - Create a new project
   - Set up a Web platform with your domain (e.g., http://localhost:8080)
   - Enable Email/Password authentication in the Authentication section

4. Create a `.env` file with your Appwrite configuration:
   ```
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id
   ```

5. Update the project ID in `src/js/appwrite.js` with your Appwrite Cloud project ID.

6. Start the development server:
   ```
   npm start
   ```

## Setting Up Appwrite Cloud

1. Sign up for a free account at [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project
3. In Project Settings, add a Web platform with your domain (e.g., http://localhost:8080)
4. Go to Authentication and enable Email/Password sign-in method
5. Update the project ID in `src/js/appwrite.js`
6. Note your Project ID from the Appwrite Cloud dashboard

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

## Deployment

To deploy your application with Appwrite Cloud:

1. Build your project:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your preferred hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - Firebase Hosting

3. Update your Appwrite platform settings to include your production domain.

## License

MIT License
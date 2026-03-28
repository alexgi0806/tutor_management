# Tutoring Management System - React Frontend

A modern React.js single-page application (SPA) for managing tutoring services, students, classes, and enrollments.

## Features

- **User Authentication**: JWT-based login with automatic token refresh
- **Dashboard**: Overview of system statistics and user information
- **User Management**: View and manage system users
- **Tutor Management**: Manage tutor profiles and specializations
- **Class Management**: Create and manage classes
- **Enrollment Management**: Track student enrollments in classes

## Tech Stack

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.2
- **HTTP Client**: Axios
- **Authentication**: JWT with localStorage
- **Notifications**: React Toastify
- **Styling**: CSS3

## Prerequisites

- Node.js 18+ or Docker
- Backend API running (Django REST Framework API at http://localhost:8000/api)

## Installation

### Option 1: Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Option 2: Docker

Build and run with Docker Compose from the project root:

```bash
docker-compose up --build
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `REACT_APP_API_URL`: Base URL for the API (default: `http://localhost:8000/api`)

For Docker, this is set in the Dockerfile. For local development, it defaults to `http://localhost:8000/api`.

## Default Login Credentials

```
Username: admin
Password: admin123
```

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── App.js              # Main app component with routing
├── App.css             # Global styles
├── index.js            # React entry point
├── components/         # Reusable components
│   ├── Navigation.js   # Sidebar navigation
│   └── Navigation.css
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Dashboard.js    # Dashboard/home page
│   ├── Users.js        # Users list page
│   ├── Tutors.js       # Tutors list page
│   ├── Classes.js      # Classes list page
│   ├── Enrollments.js  # Enrollments list page
│   ├── Login.css
│   ├── Dashboard.css
│   └── ListPage.css
public/
├── index.html          # HTML entry point
└── ...
```

## API Integration

The application uses axios with interceptors to:
- Automatically add JWT bearer tokens to all requests
- Handle 401 responses by refreshing tokens
- Redirect to login on authentication failure

## Routes

- `/login` - Login page
- `/dashboard` - Dashboard/home page
- `/users` - User management
- `/tutors` - Tutor management
- `/classes` - Class management
- `/enrollments` - Enrollment management

## Styling

The application uses a clean, modern design with:
- Responsive grid layouts
- Fixed sidebar navigation
- Consistent color scheme (blue primary colors)
- Hover effects and transitions
- Mobile-friendly responsive design

## Notes

- All routes except `/login` require authentication
- Logging out clears stored tokens and redirects to login
- API errors are displayed as toast notifications
- Pagination is included for list pages

## Build Notes

- The build uses Create React App (react-scripts)
- Environment variables are set at build time from the Dockerfile
- For Docker deployments, ensure the REACT_APP_API_URL points to the correct backend URL

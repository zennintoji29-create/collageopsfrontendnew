# CollegeOps Frontend

This is the React frontend for the CollegeOps School Management System.

## Technology Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Getting Started

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure API URL

The frontend is configured to connect to the backend at `http://localhost:5000/api` by default.

If your backend is running on a different URL, update the `API_BASE_URL` in `src/api/axios.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Change this if needed
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

## Project Structure

```
client/
├── src/
│   ├── api/              # API configuration
│   ├── components/       # Reusable components
│   ├── context/          # React Context (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Features

### Authentication
- Login/Logout functionality
- JWT token-based authentication
- Persistent login sessions
- Protected routes based on user role

### Role-Based Access Control
- **ADMIN**: Full access to all features
- **TEACHER**: Can view students, manage attendance, view courses
- **STUDENT**: Can view their own profile, courses, and attendance

### Pages

#### Dashboard
- Overview statistics
- Recent activity feed
- Quick action buttons

#### Students
- View all students (Admin/Teacher)
- Search and filter students
- Student details with enrollment info

#### Courses
- View all courses
- Course details with teacher and student count
- Create/edit/delete courses (Admin only)

#### Attendance
- Mark attendance for courses
- View attendance records
- Filter by course and date

## Key Components

### ProtectedRoute
Wraps routes that require authentication and role-based access.

```jsx
<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
  <Students />
</ProtectedRoute>
```

### AuthContext
Provides authentication state and methods throughout the app.

```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### Axios Instance
Pre-configured axios instance with authentication headers and error handling.

```javascript
import axios from '../api/axios';
const response = await axios.get('/students');
```

## Styling

The project uses Tailwind CSS for styling. Custom utility classes are defined in `index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Form input style
- `.card` - Card container style

## Environment Variables

The frontend doesn't require environment variables for basic operation, but you can create a `.env` file if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

Then update `src/api/axios.js` to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Development Tips

### Hot Module Replacement
Vite provides fast HMR. Changes to your code will instantly reflect in the browser without full page reloads.

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Sidebar.jsx`

### Adding New API Calls
Use the configured axios instance from `src/api/axios.js` for all API calls to ensure proper authentication.

## Troubleshooting

### CORS Errors
- Ensure the backend is running
- Check that CORS is enabled in the backend for your frontend URL
- Verify the API_BASE_URL in axios.js

### Authentication Issues
- Clear browser localStorage
- Check that JWT tokens are being stored
- Verify backend JWT configuration

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check for version conflicts

## Demo Credentials

For testing, use these credentials:

**Admin:**
- Email: admin@college.com
- Password: admin123

**Teacher:**
- Email: teacher@college.com
- Password: teacher123

**Student:**
- Email: student@college.com
- Password: student123

Note: These users need to be created in the database first through the register API endpoint.
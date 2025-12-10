# Authentication System Documentation

## Overview
This application implements a complete authentication system with protected routes, token management, and user state management.

## Components

### 1. AuthContext (`app/contexts/AuthContext.tsx`)
**Purpose**: Global authentication state management

**State Variables**:
- `isAuthenticated`: Boolean indicating if user is logged in
- `user`: User object containing name, email, role, and id
- `accessToken`: JWT access token for API requests
- `refreshToken`: JWT refresh token for token renewal
- `isLoading`: Boolean for initial auth state loading

**Methods**:
- `login(loginData)`: Stores tokens and user data in localStorage and state
- `logout()`: Clears all stored data and resets state

**Storage**: All authentication data is persisted in localStorage for session persistence across browser refreshes.

### 2. ProtectedRoute (`app/components/ProtectedRoute.tsx`)
**Purpose**: Wrapper component that protects routes requiring authentication

**Behavior**:
- Shows loading spinner while checking authentication
- Redirects to login page (`/`) if not authenticated
- Renders protected content if authenticated

**Usage**: Wrap any component that requires authentication

### 3. Login Page (`app/page.tsx`)
**Purpose**: User authentication entry point

**Features**:
- Email/password login form
- API integration with error handling
- Automatic redirect to `/home` on successful login
- Redirects to `/home` if already authenticated

**Flow**:
1. User enters credentials
2. API call to `/api/auth/login`
3. On success: stores data via `login()` and redirects to `/home`
4. On failure: displays error message

### 4. Home Page (`app/home/page.tsx`)
**Purpose**: Protected dashboard showing user information

**Features**:
- Displays user information (name, email, role, ID)
- Logout functionality
- Protected by `ProtectedRoute` wrapper
- Responsive design matching the login page aesthetic

## Route Protection

### Public Routes
- `/` - Login page (redirects to `/home` if authenticated)

### Protected Routes
- `/home` - User dashboard (requires authentication)

## Token Management

### Storage
- **Access Token**: Stored in localStorage as `accessToken`
- **Refresh Token**: Stored in localStorage as `refreshToken`
- **User Data**: Stored in localStorage as `user` (JSON string)

### Security Notes
- Tokens are stored in localStorage (client-side)
- Consider implementing refresh token rotation for production
- Add token expiration checks
- Implement secure HTTP-only cookies for production

## Usage Examples

### Using Auth Context
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Creating Protected Routes
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is protected!</div>
    </ProtectedRoute>
  );
}
```

## API Integration

The system expects the login API to return data in this format:
```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}
```

## Token Refresh System

### Automatic Token Refresh
The system automatically refreshes access tokens before they expire:

- **Check Interval**: Every 5 minutes
- **Refresh Threshold**: 5 minutes before expiration
- **JWT Decoding**: Automatically decodes JWT to check expiration time
- **Fallback**: If refresh fails, user is automatically logged out

### Manual Token Refresh
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { refreshAccessToken } = useAuth();
  
  const handleRefresh = async () => {
    const success = await refreshAccessToken();
    if (success) {
      console.log('Token refreshed successfully');
    } else {
      console.log('Token refresh failed');
    }
  };
}
```

### API with Automatic Token Management
Use the `useApi` hook for API calls with automatic token handling:

```tsx
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const api = useApi();
  
  const fetchData = async () => {
    try {
      // Automatically includes access token and handles refresh
      const data = await api.get('/api/protected-endpoint');
      console.log(data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };
}
```

### Refresh Token API
The system expects the refresh endpoint to return:
```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: number;
  }
}
```

## Future Enhancements

1. **Role-based Access**: Add role-based route protection
2. **Remember Me**: Add persistent login option
3. **Two-Factor Auth**: Add 2FA support
4. **Session Management**: Add session timeout and management
5. **Token Rotation**: Implement refresh token rotation for enhanced security

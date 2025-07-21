# MVC Pattern Implementation Guide

## Overview

This project now follows a proper **Model-View-Controller (MVC)** architectural pattern across all services (`auth-service`, `tour-service`, and `user-service`). The MVC pattern separates concerns into three distinct layers:

- **Model**: Data layer (MongoDB schemas and data structures)
- **View**: Presentation layer (API response formatting)  
- **Controller**: HTTP request/response handling
- **Service**: Business logic layer (newly added)

## Architecture Structure

```
src/
├── models/           # Data layer (M in MVC)
│   ├── User.ts
│   ├── Tour.ts
│   └── Review.ts
├── views/            # Presentation layer (V in MVC)
│   └── responseView.ts
├── controllers/      # HTTP handling (C in MVC)
│   ├── authController.ts
│   ├── tourController.ts
│   └── userController.ts
├── services/         # Business logic layer (NEW)
│   ├── authService.ts
│   ├── tourService.ts
│   └── userService.ts
├── routes/           # HTTP routing
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
└── middlewares/      # Express middlewares
```

## Key Benefits

### 1. **Separation of Concerns**
- **Controllers** only handle HTTP requests/responses
- **Services** contain all business logic
- **Views** ensure consistent API responses
- **Models** handle data structure and validation

### 2. **Improved Maintainability**
- Business logic is centralized in service layer
- Easy to test individual components
- Clear responsibility boundaries

### 3. **Consistent Error Handling**
- Centralized error handling in ResponseView
- Proper HTTP status codes
- Consistent response format

### 4. **Better Testability**
- Service layer can be unit tested independently
- Controllers can be tested with mocked services
- Clear interfaces for dependencies

## Implementation Details

### Service Layer

The service layer contains all business logic and data manipulation:

```typescript
// Example: AuthService
export class AuthService {
  async registerUser(userData: RegisterData): Promise<{ success: boolean; message: string }> {
    // Business logic for user registration
    // Validation, password hashing, database operations
  }
  
  async loginUser(loginData: LoginData): Promise<{ tokens: AuthTokens; user: UserData }> {
    // Business logic for user authentication
    // Password verification, token generation
  }
}
```

### Controller Layer

Controllers are now lightweight and only handle HTTP concerns:

```typescript
// Example: Auth Controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    ResponseView.success(res, result.message, null, 201);
  } catch (error) {
    if (error instanceof Error) {
      ResponseView.error(res, error.message, 400);
    } else {
      ResponseView.serverError(res, error);
    }
  }
};
```

### View Layer

Consistent API response formatting:

```typescript
// Example: Response View
export class ResponseView {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      ...(data && { data })
    };
    res.status(statusCode).json(response);
  }
  
  static error(res: Response, message: string, statusCode: number = 400): void {
    // Error response formatting
  }
}
```

## Services Overview

### Auth Service (`auth-service`)
- **Purpose**: User authentication and authorization
- **Key Methods**:
  - `registerUser()` - User registration with validation
  - `loginUser()` - User login with password verification
  - `logoutUser()` - User logout with token cleanup
  - `refreshUserToken()` - Token refresh functionality

### Tour Service (`tour-service`)
- **Purpose**: Tour management and search functionality
- **Key Methods**:
  - `createTour()` - Create new tour with validation
  - `updateTour()` - Update existing tour
  - `deleteTour()` - Delete tour with proper checks
  - `getTourById()` - Retrieve single tour with reviews
  - `getAllTours()` - Get paginated tours
  - `searchTours()` - Search tours by criteria
  - `getFeaturedTours()` - Get featured tours

### User Service (`user-service`)
- **Purpose**: User profile management
- **Key Methods**:
  - `createUser()` - Create new user profile
  - `updateUser()` - Update user information
  - `deleteUser()` - Delete user account
  - `getUserById()` - Get user by ID
  - `getAllUsers()` - Get all users
  - `getUserByEmail()` - Find user by email
  - `getUserByUsername()` - Find user by username

## Error Handling Strategy

### Service Layer Errors
Services throw descriptive errors:
```typescript
if (!user) {
  throw new Error('User not found');
}

if (!Types.ObjectId.isValid(id)) {
  throw new Error('Invalid user ID');
}
```

### Controller Layer Error Handling
Controllers catch and properly format errors:
```typescript
catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      ResponseView.notFound(res, error.message);
    } else if (error.message.includes('Invalid')) {
      ResponseView.error(res, error.message, 400);
    } else {
      ResponseView.serverError(res, error);
    }
  } else {
    ResponseView.serverError(res, error);
  }
}
```

## API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number; // For pagination
  error?: string; // For error responses
}
```

### Success Response Example:
```json
{
  "success": true,
  "message": "Successfully created",
  "data": { /* entity data */ }
}
```

### Error Response Example:
```json
{
  "success": false,
  "message": "User not found",
  "error": "No user exists with the provided ID"
}
```

## Best Practices

### 1. **Service Layer**
- Keep methods focused on single responsibility
- Use descriptive error messages
- Validate input parameters
- Return consistent data structures

### 2. **Controller Layer**
- Keep controllers thin (no business logic)
- Use proper HTTP status codes
- Handle errors gracefully
- Extract request data clearly

### 3. **View Layer**
- Maintain consistent response format
- Use appropriate HTTP status codes
- Include helpful error messages
- Support optional response data

### 4. **Type Safety**
- Define interfaces for all data structures
- Use TypeScript strictly
- Validate request/response types
- Export types for reusability

## Migration Benefits

### Before MVC Implementation:
- Business logic mixed with HTTP handling
- Inconsistent error handling
- Difficult to test
- Code duplication across controllers

### After MVC Implementation:
- ✅ Clear separation of concerns
- ✅ Consistent error handling
- ✅ Easy to unit test
- ✅ Reusable business logic
- ✅ Maintainable codebase
- ✅ Consistent API responses

## Testing Strategy

With the new MVC structure, testing becomes much easier:

### Unit Testing Services:
```typescript
describe('AuthService', () => {
  it('should register a new user', async () => {
    const userData = { email: 'test@test.com', username: 'test', password: 'password' };
    const result = await authService.registerUser(userData);
    expect(result.success).toBe(true);
  });
});
```

### Integration Testing Controllers:
```typescript
describe('Auth Controller', () => {
  it('should return 201 on successful registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', username: 'test', password: 'password' })
      .expect(201);
    
    expect(response.body.success).toBe(true);
  });
});
```

This MVC implementation provides a solid foundation for scalable, maintainable microservices with clear responsibilities and consistent patterns across all services.
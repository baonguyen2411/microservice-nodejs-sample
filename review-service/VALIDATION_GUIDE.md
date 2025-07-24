# User and Tour Validation Guide - Review Service

## Overview

This document explains the implementation of user and tour validation in the review service using remote service calls. The validation ensures that users and tours exist before allowing review operations, maintaining data integrity across microservices.

## Architecture

### Remote Services
The review service validates entities by communicating with remote services:

1. **User Service** - Validates user existence
2. **Tour Service** - Validates tour existence

### Key Components

#### 1. Remote Service Clients (`src/services/remote/`)

**User Service Client** (`user.service.ts`)
```typescript
export const RemoteUserService = {
  async getUserById(userId: string, cookie: string) {
    // Makes HTTP request to user service
    // Passes authentication cookies for authorization
  }
};
```

**Tour Service Client** (`tour.service.ts`)
```typescript
export const RemoteTourService = {
  async getTourById(tourId: string, cookie: string) {
    // Makes HTTP request to tour service
    // Passes authentication cookies for authorization
  }
};
```

#### 2. Validation Utilities (`src/utils/validation.ts`)

**Core Validation Functions:**
- `validateObjectId(id: string)` - Validates MongoDB ObjectId format
- `validateCreateReviewRequest(data)` - Validates review creation data
- `validateUpdateReviewRequest(data)` - Validates review update data
- `verifyUserExists(userId, cookie)` - Validates user existence via remote service
- `verifyTourExists(tourId, cookie)` - Validates tour existence via remote service

#### 3. Validation Middlewares (`src/middlewares/validateRemoteEntities.ts`)

**Available Middlewares:**
- `validateUserExists` - Middleware to validate user existence
- `validateTourExists` - Middleware to validate tour existence
- `validateUserAndTour` - Combined validation for both entities

## Implementation Details

### 1. Service Layer Validation

The review service validates tours during review creation:

```typescript
async createReview(tourId: string, reviewData: ICreateReviewRequest, cookie?: string) {
  validateObjectId(tourId);
  validateCreateReviewRequest(reviewData);

  // Validate that the tour exists using remote service
  if (!(await verifyTourExists(tourId, cookie))) {
    throw new ValidationError('Tour does not exist');
  }

  // Proceed with review creation...
}
```

### 2. Middleware Integration

Routes are protected with validation middlewares:

```typescript
router.post('/:tourId', 
  verifyUser as express.RequestHandler,          // Authentication
  validateTourExists as express.RequestHandler,  // Tour validation
  createReview                                    // Controller
);
```

### 3. Cookie-Based Authentication

Remote service calls include authentication cookies:
- Extracted from request headers
- Passed to remote services for proper authorization
- Maintains user context across service boundaries

## Configuration

### Environment Variables

Required configuration in `.env`:
```bash
USER_SERVICE_URL=http://user-service:8080
TOUR_SERVICE_URL=http://tour-service:8080
```

### Service URLs

The remote services are configured in `src/utils/config.ts`:
```typescript
export const config = {
  USER_SERVICE_URL: process.env.USER_SERVICE_URL!,
  TOUR_SERVICE_URL: process.env.TOUR_SERVICE_URL!,
  // ... other config
};
```

## API Endpoints

### Remote Service Endpoints Used

**User Service:**
- `GET /api/v1/user/{userId}` - Get user by ID

**Tour Service:**
- `GET /api/v1/tour/{tourId}` - Get tour by ID

## Error Handling

### Validation Errors

1. **ValidationError** - Thrown for invalid data format or business rule violations
2. **Service Unavailable** - When remote services are unreachable
3. **Authentication Required** - When cookies are missing or invalid

### Error Response Format

```json
{
  "success": false,
  "message": "Validation error message",
  "error": "Detailed error information"
}
```

## Testing

### Unit Tests

Comprehensive test suite in `src/tests/validation.test.ts`:

- Remote service client testing with mocked HTTP calls
- Validation function testing with various input scenarios
- Error handling verification
- Cookie passing verification

### Test Categories

1. **Remote Service Tests**
   - Successful API calls
   - Error handling (network failures, 404s)
   - Cookie authentication

2. **Validation Function Tests**
   - ObjectId validation
   - Review data validation
   - User/tour existence checks

3. **Integration Tests**
   - End-to-end validation flow
   - Middleware integration
   - Controller-service integration

## Best Practices

### 1. Service Boundaries
- Repository layer focuses on database operations only
- Service layer handles business logic and remote validation
- No direct database coupling between services

### 2. Authentication Context
- Always pass authentication cookies to remote services
- Maintain user context across service boundaries
- Handle authentication failures gracefully

### 3. Error Handling
- Graceful degradation when remote services are unavailable
- Clear error messages for validation failures
- Proper HTTP status codes

### 4. Performance Considerations
- Async validation to avoid blocking
- Proper timeout handling for remote calls
- Consider caching for frequently accessed entities

## Monitoring and Logging

### Logging Strategy
- All remote service calls are logged
- Validation failures are tracked
- Performance metrics for remote calls

### Log Examples
```
[RemoteUserService] Failed to fetch user: Network timeout
[RemoteTourService] Failed to fetch tour: Tour not found
[Validation] User validation passed for user123
```

## Future Improvements

1. **Caching Layer** - Add Redis cache for frequently validated entities
2. **Circuit Breaker** - Implement circuit breaker pattern for remote calls
3. **Batch Validation** - Support validating multiple entities in single call
4. **Health Checks** - Monitor remote service health
5. **Metrics Collection** - Detailed metrics on validation performance

## Troubleshooting

### Common Issues

1. **Remote Service Unavailable**
   - Check service URLs in configuration
   - Verify network connectivity
   - Check service health status

2. **Authentication Failures**
   - Verify JWT tokens are valid
   - Check cookie format and expiration
   - Ensure proper CORS configuration

3. **Validation Failures**
   - Check ObjectId format validity
   - Verify required fields are present
   - Ensure data meets business rules

### Debug Commands

```bash
# Check service connectivity
curl http://user-service:8080/health
curl http://tour-service:8080/health

# Test validation endpoint
curl -X POST http://localhost:8080/api/v1/reviews/tourId \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=..." \
  -d '{"username":"test","reviewText":"Great tour!","rating":5}'
```

This implementation ensures robust validation across microservice boundaries while maintaining loose coupling and proper error handling.
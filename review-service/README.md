# Review Service

A microservice for managing tour reviews with user and tour verification using REST communication.

## Features

- ✅ **User Verification**: Verifies user exists and is active before allowing reviews
- ✅ **Tour Verification**: Verifies tour exists before allowing reviews  
- ✅ **Review Management**: Full CRUD operations for reviews
- ✅ **Duplicate Prevention**: Prevents users from reviewing the same tour twice
- ✅ **Rating Statistics**: Calculate average ratings for tours
- ✅ **Pagination**: Paginated responses for large datasets
- ✅ **Microservice Communication**: Uses Axios for REST communication with user-service and tour-service
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **MongoDB Integration**: Uses Mongoose with proper indexing

## API Endpoints

### Reviews

```
POST   /api/v1/reviews                    - Create a new review
GET    /api/v1/reviews                    - Get all reviews (paginated)
GET    /api/v1/reviews/:reviewId          - Get a specific review
PUT    /api/v1/reviews/:reviewId          - Update a review (owner only)
DELETE /api/v1/reviews/:reviewId          - Delete a review (owner only)
GET    /api/v1/reviews/tour/:tourId       - Get reviews for a tour
GET    /api/v1/reviews/user/:userId       - Get reviews by a user
GET    /api/v1/reviews/tour/:tourId/stats - Get tour rating statistics
```

### Health Check

```
GET    /health                            - Service health check
```

## Request/Response Examples

### Create Review

**Request:**
```bash
POST /api/v1/reviews
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "tourId": "507f1f77bcf86cd799439012", 
  "reviewText": "Amazing tour! Highly recommended.",
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "tour": "507f1f77bcf86cd799439012",
    "reviewText": "Amazing tour! Highly recommended.",
    "rating": 5,
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T10:30:00.000Z"
  }
}
```

### Get Tour Statistics

**Request:**
```bash
GET /api/v1/reviews/tour/507f1f77bcf86cd799439012/stats
```

**Response:**
```json
{
  "success": true,
  "message": "Tour rating statistics retrieved successfully",
  "data": {
    "averageRating": 4.3,
    "totalReviews": 15
  }
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=4005
MONGO_URI=mongodb://localhost:27017/review-service
SECRET_KEY_ACCESS_TOKEN=your-secret-key
FRONTEND_URL=http://localhost:3000
USER_SERVICE_URI=http://user-service:4002
TOUR_SERVICE_URI=http://tour-service:4003
```

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file with the required variables listed above.

3. **Development mode:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## Docker Support

The service includes Docker support and can be run as part of the microservices architecture:

```bash
docker build -t review-service .
docker run -p 4005:4005 review-service
```

## Verification Logic

Before creating a review, the service:

1. **Validates Input**: Checks required fields and data types
2. **Verifies User**: Makes REST call to user-service to verify user exists and is active
3. **Verifies Tour**: Makes REST call to tour-service to verify tour exists
4. **Checks Duplicates**: Ensures user hasn't already reviewed this tour
5. **Creates Review**: Only if all verifications pass

## Error Handling

The service provides detailed error responses:

- **400 Bad Request**: Invalid input, user/tour doesn't exist, duplicate review
- **404 Not Found**: Review not found, invalid route
- **500 Internal Server Error**: Database errors, service communication failures

## Database Schema

### Review Model

```typescript
{
  user: ObjectId,          // Reference to user ID
  tour: ObjectId,          // Reference to tour ID  
  reviewText: String,      // Review content (10-1000 chars)
  rating: Number,          // Rating 1-5 (integer)
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### Indexes

- Compound unique index: `{ user: 1, tour: 1 }` - Prevents duplicate reviews
- Performance indexes: `{ tour: 1, rating: -1 }`, `{ user: 1, createdAt: -1 }`

## Service Dependencies

- **user-service**: For user verification (port 4002)
- **tour-service**: For tour verification (port 4003)
- **MongoDB**: For data persistence

## Development Commands

```bash
npm run dev          # Start development server with watch mode
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```
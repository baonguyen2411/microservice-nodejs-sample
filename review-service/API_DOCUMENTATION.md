# Review Service API Documentation

## Overview

The Review Service provides REST API endpoints for managing tour reviews with comprehensive user and tour verification through microservice communication.

## Base URL

```
http://localhost:4005
```

## Authentication

The service currently doesn't implement authentication middleware but expects user IDs in request bodies for ownership verification.

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development mode)"
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, user/tour not found)
- `404` - Resource Not Found
- `500` - Internal Server Error

---

## Endpoints

### Health Check

#### GET `/health`

Check if the service is running and healthy.

**Response:**
```json
{
  "success": true,
  "message": "Review service is healthy",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

### Reviews

#### POST `/api/v1/reviews`

Create a new review after verifying user and tour existence.

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "tourId": "507f1f77bcf86cd799439012",
  "reviewText": "Amazing tour! Highly recommended.",
  "rating": 5
}
```

**Validation Rules:**
- `userId`: Required, valid MongoDB ObjectId
- `tourId`: Required, valid MongoDB ObjectId
- `reviewText`: Required, 10-1000 characters
- `rating`: Required, integer between 1-5

**Verification Process:**
1. Validates user exists and is active (via user-service)
2. Validates tour exists (via tour-service)
3. Checks user hasn't already reviewed this tour
4. Creates review if all validations pass

**Success Response (201):**
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

**Error Response (400):**
```json
{
  "success": false,
  "message": "User does not exist or is not active"
}
```

---

#### GET `/api/v1/reviews`

Get all reviews with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)

**Example Request:**
```
GET /api/v1/reviews?page=2&limit=5
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "user": "507f1f77bcf86cd799439011",
        "tour": "507f1f77bcf86cd799439012",
        "reviewText": "Amazing tour!",
        "rating": 5,
        "createdAt": "2023-12-07T10:30:00.000Z",
        "updatedAt": "2023-12-07T10:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 2,
    "totalPages": 5
  }
}
```

---

#### GET `/api/v1/reviews/:reviewId`

Get a specific review by ID.

**Path Parameters:**
- `reviewId`: MongoDB ObjectId of the review

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "tour": "507f1f77bcf86cd799439012",
    "reviewText": "Amazing tour!",
    "rating": 5,
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found"
}
```

---

#### PUT `/api/v1/reviews/:reviewId`

Update a review (only by the review owner).

**Path Parameters:**
- `reviewId`: MongoDB ObjectId of the review

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "reviewText": "Updated review text",
  "rating": 4
}
```

**Validation Rules:**
- `userId`: Required for ownership verification
- `reviewText`: Optional, 10-1000 characters if provided
- `rating`: Optional, integer between 1-5 if provided
- At least one field (reviewText or rating) must be provided

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "tour": "507f1f77bcf86cd799439012",
    "reviewText": "Updated review text",
    "rating": 4,
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T11:45:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found or user not authorized"
}
```

---

#### DELETE `/api/v1/reviews/:reviewId`

Delete a review (only by the review owner).

**Path Parameters:**
- `reviewId`: MongoDB ObjectId of the review

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found or user not authorized"
}
```

---

#### GET `/api/v1/reviews/tour/:tourId`

Get all reviews for a specific tour.

**Path Parameters:**
- `tourId`: MongoDB ObjectId of the tour

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "user": "507f1f77bcf86cd799439011",
        "tour": "507f1f77bcf86cd799439012",
        "reviewText": "Great tour!",
        "rating": 5,
        "createdAt": "2023-12-07T10:30:00.000Z",
        "updatedAt": "2023-12-07T10:30:00.000Z"
      }
    ],
    "total": 8,
    "page": 1,
    "totalPages": 1
  }
}
```

---

#### GET `/api/v1/reviews/user/:userId`

Get all reviews by a specific user.

**Path Parameters:**
- `userId`: MongoDB ObjectId of the user

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "user": "507f1f77bcf86cd799439011",
        "tour": "507f1f77bcf86cd799439012",
        "reviewText": "Great experience!",
        "rating": 5,
        "createdAt": "2023-12-07T10:30:00.000Z",
        "updatedAt": "2023-12-07T10:30:00.000Z"
      }
    ],
    "total": 3,
    "page": 1,
    "totalPages": 1
  }
}
```

---

#### GET `/api/v1/reviews/tour/:tourId/stats`

Get rating statistics for a specific tour.

**Path Parameters:**
- `tourId`: MongoDB ObjectId of the tour

**Success Response (200):**
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

**Note:** Returns `averageRating: 0` and `totalReviews: 0` if no reviews exist for the tour.

---

## External Service Dependencies

### User Service (port 4002)
- **Endpoint**: `GET /users/:userId`
- **Purpose**: Verify user exists and is active
- **Expected Response**: User data with status field

### Tour Service (port 4003)
- **Endpoint**: `GET /tours/:tourId`
- **Purpose**: Verify tour exists
- **Expected Response**: Tour data

## Database Schema

### Review Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId,          // Reference to user ID
  tour: ObjectId,          // Reference to tour ID
  reviewText: String,      // Review content (10-1000 chars)
  rating: Number,          // Rating 1-5 (integer)
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### Indexes

- `{ user: 1, tour: 1 }` (unique) - Prevents duplicate reviews
- `{ tour: 1, rating: -1 }` - Optimizes tour reviews queries
- `{ user: 1, createdAt: -1 }` - Optimizes user reviews queries

## Example Usage

### Using cURL

```bash
# Create a review
curl -X POST http://localhost:4005/api/v1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "tourId": "507f1f77bcf86cd799439012",
    "reviewText": "Excellent tour with amazing views!",
    "rating": 5
  }'

# Get tour reviews
curl http://localhost:4005/api/v1/reviews/tour/507f1f77bcf86cd799439012

# Get tour statistics
curl http://localhost:4005/api/v1/reviews/tour/507f1f77bcf86cd799439012/stats
```

### Using JavaScript/Axios

```javascript
const axios = require('axios');

// Create review
const response = await axios.post('http://localhost:4005/api/v1/reviews', {
  userId: '507f1f77bcf86cd799439011',
  tourId: '507f1f77bcf86cd799439012',
  reviewText: 'Amazing experience!',
  rating: 5
});

console.log(response.data);
```
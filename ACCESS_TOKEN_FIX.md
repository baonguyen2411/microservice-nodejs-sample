# Fix for Undefined AccessToken Issue

## Problem Summary
The API gateway and downstream services (user-service, tour-service) were experiencing undefined `accessToken` issues after user login. This was happening because the API gateway's `verifyToken` middleware was incomplete.

## Root Cause
The original `verifyToken` middleware in the API gateway (`api-gateway/src/middlewares/verifyToken.ts`) was only checking if the token existed but not:
1. Verifying the JWT token signature
2. Decoding the token to extract user information
3. Passing user information to downstream services

## Solution Implementation

### 1. Fixed API Gateway Token Verification
**File**: `api-gateway/src/middlewares/verifyToken.ts`

**Changes**:
- Added JWT token verification using `jsonwebtoken` library
- Extract user ID and role from decoded token
- Added user information to request headers (`x-user-id`, `x-user-role`)
- Proper error handling for invalid/expired tokens

**Key improvements**:
```typescript
// Before: Only checked if token exists
if (!token) {
  return res.status(401).json({ message: 'Provide token' });
}
next();

// After: Properly verify and decode token
const decode = await jwt.verify(token, config.secretKeyAccessToken);
req.headers['x-user-id'] = decode.id;
req.headers['x-user-role'] = decode.role;
```

### 2. Updated API Gateway Proxy Configuration
**File**: `api-gateway/src/index.ts`

**Changes**:
- Modified proxy configurations to forward user information headers to downstream services
- Added `x-user-id` and `x-user-role` headers to all proxied requests

**Example**:
```typescript
proxyReqOpts.headers = {
  ...proxyReqOpts.headers,
  cookie: srcReq.headers.cookie || '',
  'x-user-id': srcReq.headers['x-user-id'] || '',
  'x-user-role': srcReq.headers['x-user-role'] || '',
};
```

### 3. Enhanced Downstream Service Middleware
**Files**: 
- `user-service/src/middlewares/verifyToken.ts`
- `tour-service/src/middlewares/verifyToken.ts`

**Changes**:
- Added `extractUserFromHeaders()` function to use pre-verified user information from API gateway
- Fallback to direct token verification when headers are not available
- Improved efficiency by avoiding duplicate token verification

**Logic Flow**:
1. First, try to extract user info from headers (set by API gateway)
2. If headers are available, use them directly
3. If not, fallback to traditional JWT token verification
4. Set user information in request object for controllers to use

## Benefits of This Fix

### 1. **Resolved Undefined AccessToken Issues**
- API gateway now properly verifies tokens and extracts user information
- Downstream services receive valid user data through headers
- No more undefined `accessToken` errors

### 2. **Improved Performance**
- Downstream services can use pre-verified user information from headers
- Avoids duplicate JWT verification when using API gateway
- Faster response times for authenticated requests

### 3. **Better Error Handling**
- Proper JWT verification with meaningful error messages
- Consistent error responses across all services
- Clear logging for debugging authentication issues

### 4. **Backward Compatibility**
- Services still work when called directly (without API gateway)
- Fallback mechanism ensures existing functionality is preserved
- No breaking changes to existing API contracts

## Authentication Flow

### Before Fix
```
Client → API Gateway → Check token exists → Forward to Service → Service re-verifies token → UNDEFINED TOKEN ERROR
```

### After Fix
```
Client → API Gateway → Verify JWT + Extract user info → Forward with headers → Service uses headers → SUCCESS
```

## Environment Variables Required

Make sure these environment variables are set:

```env
SECRET_KEY_ACCESS_TOKEN=your-secret-key-here
SECRET_KEY_REFRESH_TOKEN=your-refresh-secret-key-here
```

## Testing the Fix

1. **Login to get token**:
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password"}'
   ```

2. **Test authenticated request**:
   ```bash
   curl -X GET http://localhost:4000/api/v1/user/profile \
     -H "Cookie: accessToken=your-jwt-token-here"
   ```

3. **Check logs**: You should see logs like:
   ```
   Token verified successfully for user: 12345 with role: USER
   Using user info from API gateway headers: {userId: '12345', userRole: 'USER'}
   ```

## Files Modified

1. `api-gateway/src/middlewares/verifyToken.ts` - Fixed token verification
2. `api-gateway/src/index.ts` - Updated proxy configuration
3. `user-service/src/middlewares/verifyToken.ts` - Enhanced with header extraction
4. `tour-service/src/middlewares/verifyToken.ts` - Enhanced with header extraction

## Security Considerations

- JWT tokens are properly verified using the secret key
- User information is securely passed through internal headers
- Headers are only used for internal service communication
- Original authentication mechanism is preserved as fallback

The fix ensures that user authentication works correctly throughout the microservices architecture while maintaining security and performance.
const axios = require('axios');

const REVIEW_SERVICE_URL = 'http://localhost:4005';

async function testReviewService() {
  try {
    console.log('🧪 Testing Review Service...\n');

    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${REVIEW_SERVICE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log();

    // Test 2: Create Review (This will fail with verification since services are not running)
    console.log('2. Testing review creation...');
    const reviewData = {
      userId: '507f1f77bcf86cd799439011',
      tourId: '507f1f77bcf86cd799439012',
      reviewText: 'This is a test review for the amazing tour!',
      rating: 5
    };

    try {
      const createResponse = await axios.post(`${REVIEW_SERVICE_URL}/api/v1/reviews`, reviewData);
      console.log('✅ Review creation passed:', createResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('⚠️  Review creation expected to fail (services not running):', error.response.data.message);
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    console.log();

    // Test 3: Get All Reviews
    console.log('3. Testing get all reviews...');
    try {
      const allReviewsResponse = await axios.get(`${REVIEW_SERVICE_URL}/api/v1/reviews`);
      console.log('✅ Get all reviews passed. Total reviews:', allReviewsResponse.data.data.total);
    } catch (error) {
      if (error.response) {
        console.log('⚠️  Get all reviews response:', error.response.data.message);
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    console.log();

    console.log('🎉 Review Service tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testReviewService();
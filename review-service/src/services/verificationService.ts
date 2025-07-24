import axios, { AxiosResponse } from 'axios';
import { config } from '../utils/config';
import { ITourVerificationResponse, IUserVerificationResponse } from '../types/external';

class VerificationService {
  private userServiceBaseUrl: string;
  private tourServiceBaseUrl: string;

  constructor() {
    this.userServiceBaseUrl = config.USER_SERVICE_URI;
    this.tourServiceBaseUrl = config.TOUR_SERVICE_URI;
  }

  /**
   * Verify if a user exists and is active
   * @param userId - The user ID to verify
   * @returns Promise<boolean> - true if user exists and is active
   */
  async verifyUserExists(userId: string): Promise<{ exists: boolean; userData?: any }> {
    try {
      const response: AxiosResponse<IUserVerificationResponse> = await axios.get(
        `${this.userServiceBaseUrl}/users/${userId}`,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success && response.data.data) {
        // Check if user is active
        const isActive = response.data.data.status === 'Active';
        return {
          exists: isActive,
          userData: isActive ? response.data.data : null,
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error verifying user existence:', error);
      
      // Check if it's a 404 error (user not found)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { exists: false };
      }
      
      // For other errors, throw to be handled by caller
      throw new Error(`User verification service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify if a tour exists
   * @param tourId - The tour ID to verify
   * @returns Promise<boolean> - true if tour exists
   */
  async verifyTourExists(tourId: string): Promise<{ exists: boolean; tourData?: any }> {
    try {
      const response: AxiosResponse<ITourVerificationResponse> = await axios.get(
        `${this.tourServiceBaseUrl}/tours/${tourId}`,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success && response.data.data) {
        return {
          exists: true,
          tourData: response.data.data,
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error verifying tour existence:', error);
      
      // Check if it's a 404 error (tour not found)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { exists: false };
      }
      
      // For other errors, throw to be handled by caller
      throw new Error(`Tour verification service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify both user and tour exist in parallel
   * @param userId - The user ID to verify
   * @param tourId - The tour ID to verify
   * @returns Promise with verification results for both
   */
  async verifyUserAndTour(userId: string, tourId: string): Promise<{
    userExists: boolean;
    tourExists: boolean;
    userData?: any;
    tourData?: any;
    errors?: string[];
  }> {
    try {
      const [userResult, tourResult] = await Promise.allSettled([
        this.verifyUserExists(userId),
        this.verifyTourExists(tourId),
      ]);

      const errors: string[] = [];
      let userExists = false;
      let tourExists = false;
      let userData = null;
      let tourData = null;

      // Handle user verification result
      if (userResult.status === 'fulfilled') {
        userExists = userResult.value.exists;
        userData = userResult.value.userData;
      } else {
        errors.push(`User verification failed: ${userResult.reason.message}`);
      }

      // Handle tour verification result
      if (tourResult.status === 'fulfilled') {
        tourExists = tourResult.value.exists;
        tourData = tourResult.value.tourData;
      } else {
        errors.push(`Tour verification failed: ${tourResult.reason.message}`);
      }

      return {
        userExists,
        tourExists,
        userData,
        tourData,
        ...(errors.length > 0 && { errors }),
      };
    } catch (error) {
      throw new Error(`Verification service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const verificationService = new VerificationService();
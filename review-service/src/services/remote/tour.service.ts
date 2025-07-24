import axios from 'axios';
import { config } from '../../utils/config';

const API_BASE_URL = '/api';
const API_VERSION = 'v1';
const ROUTES_PATH = {
  tour: `${API_BASE_URL}/${API_VERSION}/tour`,
} as const;

const tourServiceBaseUrl = config.TOUR_SERVICE_URL;
const tourApi = axios.create({
  baseURL: tourServiceBaseUrl,
  withCredentials: true,
});

export const RemoteTourService = {
  async getTourById(tourId: string, cookie: string) {
    try {
      const response = await tourApi.get(`${ROUTES_PATH.tour}/${tourId}`, {
        headers: {
          Cookie: cookie,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('[RemoteTourService] Failed to fetch tour:', error?.message);
      throw new Error('Tour service unavailable');
    }
  },
};

import axios from 'axios';
import { config } from '../../utils/config';

const API_BASE_URL = '/api';
const API_VERSION = 'v1';
const ROUTES_PATH = {
  user: `${API_BASE_URL}/${API_VERSION}/user`,
} as const;

const userServiceBaseUrl = config.USER_SERVICE_URL;
const userApi = axios.create({
  baseURL: userServiceBaseUrl,
  withCredentials: true,
});

export const RemoteUserService = {
  async getUserById(userId: string, cookie: string) {
    try {
      const response = await userApi.get(`${ROUTES_PATH.user}/${userId}`, {
        headers: {
          Cookie: cookie,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('[RemoteUserService] Failed to fetch user:', error?.message);
      throw new Error('User service unavailable');
    }
  },
};

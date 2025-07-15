export const API_BASE_URL = '/api';
export const API_VERSION = 'v1';

export const ROUTES_PATH = {
  auth: `${API_BASE_URL}/${API_VERSION}/auth`,
  user: `${API_BASE_URL}/${API_VERSION}/user`,
  tour: `${API_BASE_URL}/${API_VERSION}/tour`,
} as const;

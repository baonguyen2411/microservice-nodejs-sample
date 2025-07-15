export const API_BASE_URL = '/api';
export const API_VERSION = 'v1';

export const ROUTES_PATH = {
  tour: `${API_BASE_URL}/${API_VERSION}/tour`,
  review: `${API_BASE_URL}/${API_VERSION}/review`,
} as const;

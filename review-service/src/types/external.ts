// Types for external service responses

export interface IUserVerificationResponse {
  success: boolean;
  data?: {
    _id: string;
    username: string;
    email: string;
    photo?: string;
    role: string;
    status: string;
  };
  message: string;
}

export interface ITourVerificationResponse {
  success: boolean;
  data?: {
    _id: string;
    title: string;
    city: string;
    price: number;
    featured: boolean;
  };
  message: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}
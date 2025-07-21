import { ValidationError } from './errors';
import { ILoginRequest, IRegisterRequest, IUpdateUserRequest } from '../types/user';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // 3-30 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const validateLoginRequest = (data: ILoginRequest): void => {
  if (!data.email || !data.password) {
    throw new ValidationError('Email and password are required');
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  if (data.password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }
};

export const validateRegisterRequest = (data: IRegisterRequest): void => {
  if (!data.email || !data.username || !data.password) {
    throw new ValidationError('Email, username, and password are required');
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  if (!validateUsername(data.username)) {
    throw new ValidationError(
      'Username must be 3-30 characters long and contain only letters, numbers, and underscores',
    );
  }

  if (!validatePassword(data.password)) {
    throw new ValidationError(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
    );
  }
};

export const validateUpdateUserRequest = (data: IUpdateUserRequest): void => {
  if (data.email && !validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  if (data.username && !validateUsername(data.username)) {
    throw new ValidationError(
      'Username must be 3-30 characters long and contain only letters, numbers, and underscores',
    );
  }

  if (data.role && !['ADMIN', 'USER'].includes(data.role)) {
    throw new ValidationError('Invalid role');
  }

  if (data.status && !['Active', 'Inactive', 'Suspended'].includes(data.status)) {
    throw new ValidationError('Invalid status');
  }
};

export const validateObjectId = (id: string): void => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    throw new ValidationError('Invalid ID format');
  }
};

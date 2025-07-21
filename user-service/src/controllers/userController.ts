import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { ResponseView } from '../views/responseView';

// create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedUser = await userService.createUser(req.body);
    ResponseView.created(res, 'Successfully created', savedUser);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedUser = await userService.updateUser(id, req.body);
    ResponseView.success(res, 'Successfully updated', updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedUser = await userService.deleteUser(id);
    ResponseView.success(res, 'Successfully deleted', deletedUser);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

export const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    ResponseView.success(res, 'User found', user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    ResponseView.success(res, 'Users found', users);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

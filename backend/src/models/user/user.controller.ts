import { UserService } from './user.service';
import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api/api.response';
import { ValidationError } from 'class-validator';
import dotenv from 'dotenv';
dotenv.config();
console.log("hamid token: ",process.env.ENV_PROD)
export class UserController {
  constructor(private userService: UserService) {}

  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.signUp(req.body);

      return res
        .status(201)
        .json(ApiResponse.success(user, 'User created successfully'));
    } catch (err: any) {
      if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const validationErrors = err
          .map((e) => Object.values(e.constraints || {}))
          .flat();
        return res
          .status(400)
          .json(ApiResponse.error('Validation failed', validationErrors));
      }

      const statusCode = err.message.includes('exist') ? 409 : 500;
      return res
        .status(statusCode)
        .json(ApiResponse.error(err.message || 'Internal server error'));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } = await this.userService.login(
        req.body,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === process.env.ENV_PROD, // Required for SameSite=None
        sameSite: 'none', // Required for cross-site cookie
        maxAge: 15 * 60 * 1000,
      });

      if (refreshToken != null) {
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === process.env.ENV_PROD, // Required for SameSite=None
          sameSite: 'none', // Required for cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      return res
        .status(200)
        .json(ApiResponse.success(user, 'Login successful'));
    } catch (err: any) {
      if (
        Array.isArray(err) &&
        err.length > 0 &&
        err[0] instanceof ValidationError
      ) {
        return res
          .status(400)
          .json(ApiResponse.error('Validation failed', err));
      }

      return res
        .status(401)
        .json(ApiResponse.error(err.message || 'Authentication failed'));
    }
  }

  async getProfil(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.userId;

      if (!id) {
        return res
          .status(401)
          .json(ApiResponse.error('User ID missing from request'));
      }

      const profil = await this.userService.getProfil(id as string);

      return res.status(200).json(ApiResponse.success(profil, 'User Profil'));
    } catch (err: any) {
      return res
        .status(err.message === 'User not found' ? 404 : 500)
        .json(ApiResponse.error(err.message || 'Internal server error'));
    }
  }

  async EditProfil(req: Request, res: Response) {
    const updates = req.body;
    const userId: any = req.userId;
    try {
      const updatedUser: any = await this.userService.EditProfil(
        updates,
        userId,
      );
      return res
        .status(200)
        .json(ApiResponse.success(updatedUser, 'Profil change successfully'));
    } catch (err: any) {
      let status = 500;
      if (err.message === 'user not found') status = 404;
      if (err.message === 'no data provided to update') status = 400;
      if (err.message === 'no valid field to update') status = 400;
      return res
        .status(status)
        .json(ApiResponse.error(err.message || 'Internal server error'));
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({
      message: 'Logout successful',
    });
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const result: any = await this.userService.forgotPassword(email);
      return res.status(200).json(ApiResponse.success(result, result.message));
    } catch (err: any) {
      let status = 500;
      if (err.message === 'Email is required') status = 400;
      if (err.message === 'User with this email does not exist') status = 404;

      return res
        .status(status)
        .json(ApiResponse.error(err.message || 'Internal server error'));
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const id = req.params.id;
      const newPassword = req.body.password;
      const result: any = await this.userService.resetPassword(
        token,
        id,
        newPassword,
      );

      return res.status(200).json(ApiResponse.success(null, result.message));
    } catch (err: any) {
      let status = 400;
      if (err.message === 'User does not exist') status = 404;
      if (err.message === 'Invalid or expired token') status = 401;

      return res
        .status(status)
        .json(ApiResponse.error(err.message || 'Bad request'));
    }
  }
}

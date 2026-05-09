import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, refreshTokenSchema } from '../utils/validators';

const authService = new AuthService();

/**
 * Auth controller — handles login, refresh, logout (§6.3, §8).
 */
export class AuthController {
  /** POST /auth/login */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** POST /auth/refresh */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = refreshTokenSchema.parse(req.body);
      const result = await authService.refresh(refresh_token);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** POST /auth/logout */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.sub);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

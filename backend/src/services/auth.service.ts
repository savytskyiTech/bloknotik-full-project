import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { UnauthorizedError, NotFoundError, ConflictError } from '../utils/errors';

const prisma = new PrismaClient();

interface LoginResult {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    assigned_instructor_id?: string | null;
  };
}

/**
 * Authentication service.
 * Handles login, token refresh, and logout.
 */
export class AuthService {
  /**
   * Login with email and password.
   * Returns access_token, refresh_token, and user info.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError('Невірний email або пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Невірний email або пароль');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        assigned_instructor_id: user.assigned_instructor_id,
      },
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Невалідний refresh token');
    }

    if (storedToken.expires_at < new Date()) {
      // Clean up expired token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token протух');
    }

    const accessToken = this.generateAccessToken(storedToken.user);

    return { access_token: accessToken };
  }

  /**
   * Logout — invalidate the refresh token.
   */
  async logout(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { user_id: userId } });
  }

  /**
   * Generate a JWT access token.
   */
  private generateAccessToken(user: {
    id: string;
    role: string;
    name: string;
    assigned_instructor_id?: string | null;
  }): string {
    const payload: Record<string, unknown> = {
      sub: user.id,
      role: user.role,
      name: user.name,
    };

    if (user.assigned_instructor_id) {
      payload.assigned_instructor_id = user.assigned_instructor_id;
    }

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    });
  }

  /**
   * Generate and store a refresh token in the database.
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');

    // Calculate expiry (parse the JWT_REFRESH_EXPIRES_IN string)
    const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
    const days = parseInt(expiresIn.replace('d', ''), 10) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await prisma.refreshToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });

    return token;
  }
}

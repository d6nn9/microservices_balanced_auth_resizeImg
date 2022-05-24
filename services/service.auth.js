import { validateUser } from './validate/validate.user.data.js';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(userModel, refreshTokenModel, options) {
    this.userModel = userModel;
    this.refreshTokenModel = refreshTokenModel;
    this.jwtSecret = options?.jwtSecret;
  }

  async register(userData) {
    validateUser(userData);
    const savedUser = await this.userModel.create(userData);
    return { email: savedUser.email };
  }

  async issueTokens(email) {
    const TOKEN_EXPIR_TIME = Math.floor(Date.now() / 1000) + (60 * 15);

    const newRefreshToken = v4();

    await this.refreshTokenModel.add({
      refreshToken: newRefreshToken,
      email,
    });

    return {
      token: jwt.sign(
        {
          exp: TOKEN_EXPIR_TIME,
          email,
        },
        this.jwtSecret,
      ),
      refreshToken: newRefreshToken,
    };
  }

  async login(userData) {
    validateUser(userData);
    const user = await this.userModel.getByEmail(userData);
    if (user) {
      return this.issueTokens(user.email);
    }
  }
}



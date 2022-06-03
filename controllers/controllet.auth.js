
const MAX_AGE = 5 * 24 * 60 * 60 * 1000;

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async register(req, res, next) {
    const { email, password } = req.body;
    try {
      const result = await this.authService.register({ email, password });
      res.status(200).json({
        message: 'Successfully registered.',
        user: result
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const token = await this.authService.login({ email, password });
      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE
      });
      res.status(200).json(token.token);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    const { refreshToken } = req.body;
    try {
      const newtoken = await this.authService.refresh(refreshToken);
      res.status(200).json(newtoken);
    } catch (err) {
      next(err);
    }
  }

  // async logout(req, res, next) {
  //   const { email } = req.user;
  //   try {
  //     await this.authService.logout(email);
  //     res.status(200).json({ message: 'Logout successful.' });
  //   } catch (err) {
  //     this.passErrorToErrorHandler(err, next);
  //   }
  // }

  // verifyToken(req, res, next) {
  //   const { authorization } = req.headers;

  //   try {
  //     this.authService.getTokenFromAuthHeaderAndVerify(authorization);

  //     res.status(200).json({ message: 'Token verified.' });
  //   } catch (err) {
  //     this.passErrorToErrorHandler(err, next);
  //   }
  // }
}

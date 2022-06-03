import express from 'express';


export const authRouter = (authController) => {
  const router = express.Router();

  router.post(
    '/create',
    (req, res, next) => authController.register(req, res, next),
  );

  router.post(
    '/login',
    (req, res, next) => authController.login(req, res, next),
  );

  router.post(
    '/refresh',
    (req, res, next) => authController.refresh(req, res, next),
  );

  router.post(
    '/logout',
    (req, res, next) => authController.logout(req, res, next),
  );

  router.get(
    '/verifyToken',
    (req, res, next) => authController.verifyToken(req, res, next),
  );

  return router;
};

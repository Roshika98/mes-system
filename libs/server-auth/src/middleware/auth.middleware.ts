import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'keycloak',
    { session: false },
    (err: Error | null, user: Express.User | false | null) => {
      if (err) {
        return next(err);
      }
      if (user) {
        req.user = user;
      }
      next();
    },
  )(req, res, next);
};

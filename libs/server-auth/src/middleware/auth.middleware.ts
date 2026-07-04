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
    (err: any, user: any) => {
      if (err) {
        return next(err);
      }
      if (user) {
        (req as any).user = user;
      }
      next();
    },
  )(req, res, next);
};

import * as passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

const KEYCLOAK_REALM_URL =
  process.env['KEYCLOAK_REALM_URL'] || 'http://localhost:8080/realms/mes-realm';
const KEYCLOAK_CLIENT_ID = process.env['KEYCLOAK_CLIENT_ID'] || 'mes-backend';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  secretOrKeyProvider: jwksRsa.passportJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${KEYCLOAK_REALM_URL}/protocol/openid-connect/certs`,
  }),

  audience: KEYCLOAK_CLIENT_ID,
  issuer: KEYCLOAK_REALM_URL,
  algorithms: ['RS256'],
} as StrategyOptionsWithoutRequest;

export const keycloakJwtStrategy = new JwtStrategy(
  options,
  (jwt_payload, done) => {
    if (jwt_payload) {
      return done(null, jwt_payload);
    } else {
      return done(null, false);
    }
  },
);

export function configurePassport() {
  passport.use('keycloak', keycloakJwtStrategy);
  return passport;
}

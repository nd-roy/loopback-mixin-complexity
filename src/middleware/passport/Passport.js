// @flow

import passport from 'passport';
import BearerStrategy from './strategies/BearerStrategy';
import LocalStrategy from './strategies/LocalStrategy';
import FacebookStrategy from './strategies/FacebookStrategy';

/**
 * Passport JS Init.
 * @param applicationUrl
 * @returns {Passport}
 */
export default function (applicationUrl : string) : passport {
  passport.use('bearer', BearerStrategy);
  passport.use('local', LocalStrategy);
  passport.use('facebook', FacebookStrategy(applicationUrl));

  return passport;
}

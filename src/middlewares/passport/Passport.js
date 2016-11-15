// @flow

import passport from 'passport';
import CustomStrategy from './strategies/CustomStrategy';

passport.use('kong', CustomStrategy);

export default passport;

import { deprecate } from 'util';
import complexity from './complexity';

export default deprecate(
  app => app.loopback.modelBuilder.mixins.define('Complexity', complexity),
  'DEPRECATED: Use mixinSources, see https://github.com/AbdoulNdiaye/loopback-mixin-complexity#mixinsources'
);

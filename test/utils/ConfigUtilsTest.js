"use strict";

import chai from 'chai';
import config from '../../src/utils/ConfigUtils';

describe('Checking configuration.', function () {
    it('should return an object".', function (done) {

        var parameters = config.getConfig();

        chai.assert.isObject(parameters);

        done();
    });

    it('should set "local" environment by default".', function (done) {

        var parameters = config.getConfig();

        chai.assert.equal('local', parameters.env, 'Invalid default environment');

        done();
    });
});

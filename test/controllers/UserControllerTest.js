import chai from 'chai';
import sinon from 'sinon';
import UserController from '../../src/controllers/PatientController';

var expect = chai.expect;

const userController = new UserController();

describe('User Controller', function () {
  describe('Register', function () {
    it('Should throw an Http exception if no parameter', function () {
      let req, res, spy, next;

      req = res = {};
      req.body = {};
      spy = next = sinon.spy();

      UserController.register(req, res, next);
      expect(spy.calledOnce).to.equal(true);

      let exception = spy.lastCall.args[0];

      expect(exception).to.be.an.instanceof(Error);
      chai.assert(exception.message === 'Missing mandatory field.');
    });

    it('Should throw an Http exception if password has less than 6 characters', function () {
      let req, res;

      req = res = {};
      req.body = {
        password: 'qwert',
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName'
      };

      chai.assert.throws(function () {
        UserController.register(req, res)
      }, Error, 'Password must be at least 6 characters.');
    });

    it('Should set a temp object in the request', function () {
      let req, res, spy, next;

      req = res = {};
      req.body = {
        password: 'qwerty',
        email: 'email@test.com',
        firstName: 'firstName',
        lastName: 'lastName'
      };

      spy = next = sinon.spy();

      UserController.register(req, res, next);
      expect(spy.calledOnce).to.equal(true);

      expect(req.object).to.be.an.instanceof(Object);
    });
  });
});

const
  hooks = require('hooks'),
  moment = require('moment'),
  currentTime = moment().format('x'),
  email = 'test.' + currentTime + '@test.com',
  doctorEmail = 'test.doctor.' + currentTime + '@test.com',
  adminEmail = 'admin@test.com',
  password = 'qwerty',
  request = require('sync-request')
;

const res = request('POST', process.argv[process.argv.length - 1] + '/oauth/token', {
  json: {
    username: adminEmail,
    password: password,
    grant_type: 'password',
    scope: 'admin'
  }
});

const adminToken = JSON.parse(res.getBody('utf8'));

const doctorValidRegisterBody = {
  email: doctorEmail,
  password: password,
  lastName: 'Toto',
  firstName: 'Tata'
};

const validRegisterBody = {
  email: email,
  password: password,
  lastName: 'Toto',
  firstName: 'Tata'
};

const invalidRegisterBody = {
  email: 'test.com',
  password: 'test',
  lastName: 'Toto',
  firstName: 'Tata'
};

const medicalRecord = {
  gender: 'f',
  birthday: '1987-10-13',
  height: '1',
  weight: '23',
  allergies: 'allergies',
  currentTreatments: 'currentTreatments',
  medicalHistory: 'medicalHistory',
  surgeryHistory: 'surgeryHistory',
  smokeGraduation: '4',
  sportGraduation: '3',
  alcoholGraduation: '5'
};

let patientToken;
let doctorToken;
let consultationId;

hooks.beforeEach(function (test, done) {
  test.request.headers = {
    "content-type": "application/json"
  };

  done();
});

hooks.before('GET / -> 200', function (test, done) {
  done();
});

hooks.before('GET /exception/404 -> 404', function (test, done) {
  done();
});

hooks.before('GET /exception/error -> 500', function (test, done) {
  done();
});

hooks.before('POST /patient/register -> 400', function (test, done) {
  done();
});


hooks.before('POST /patient/register -> 201', function (test, done) {
  test.request.body = validRegisterBody;

  done();
});

hooks.before('POST /patient/register -> 406', function (test, done) {
  test.request.body = invalidRegisterBody;

  done();
});

hooks.before('POST /patient/register -> 409', function (test, done) {
  test.request.body = validRegisterBody;

  done();
});


/**
 * Oauth
 */
hooks.before('POST /oauth/token -> 200 patient', function (test, done) {
  test.request.body = {
    username: email,
    password: password,
    grant_type: 'password',
    scope: 'patient',
  };

  done();
});

hooks.before('POST /oauth/token -> 200 admin', function (test, done) {
  test.request.body = {
    username: adminEmail,
    password: password,
    grant_type: 'password',
    scope: 'admin',
  };

  done();
});

hooks.before('POST /oauth/token -> 400', function (test, done) {
  done();
});

hooks.before('POST /oauth/token -> 403', function (test, done) {
  test.request.body = {
    username: email,
    password: 'wrong password',
    grant_type: 'password'
  };

  done();
});

hooks.after('POST /oauth/token -> 200 patient', function (test, done) {
  patientToken = test.response.body;

  done();
});

hooks.before('POST /doctor/register -> 201', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;

  test.request.body = doctorValidRegisterBody;

  done();
});

hooks.before('POST /doctor/register -> 406', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;

  test.request.body = invalidRegisterBody;

  done();
});

hooks.before('POST /doctor/register -> 409', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;

  test.request.body = validRegisterBody;

  done();
});

hooks.before('POST /doctor/register -> 401', function (test, done) {

  test.request.body = validRegisterBody;

  done();
});


hooks.before('POST /oauth/token -> 200 doctor', function (test, done) {
  test.request.body = {
    username: doctorEmail,
    password: password,
    grant_type: 'password',
    scope: 'doctor',
  };

  done();
});

hooks.after('POST /oauth/token -> 200 doctor', function (test, done) {
  doctorToken = test.response.body;

  done();
});



hooks.before('POST /medical/record/edit -> 200', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;

  test.request.body = medicalRecord;

  done();
});

hooks.before('GET /medical/record/show -> 200', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;

  test.request.body = medicalRecord;

  done();
});

hooks.before('POST /medical/record/edit -> 401', function (test, done) {
  test.request.headers.Authorization = undefined;

  done();
});

hooks.before('POST /medical/record/edit -> 406', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;

  test.request.body = medicalRecord;
  test.request.body.alcoholGraduation = 'Wrong value';
  test.request.body.smokeGraduation = 'Wrong value';

  done();
});

hooks.before('POST /pharmacy/add -> 200', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;

  test.request.body = {
    name: 'Test Pharmacy',
    address: 'Pharmacy address',
    postcode: 'E1HUJ',
    city: 'London',
    country: 'United kingdom',
    location: {
      latitude: 21,
      longitude: 10
    }
  };

  done();
});

hooks.before('POST /pharmacy/add -> 401', function (test, done) {
  done();
});

hooks.before('POST /pharmacy/add -> 406', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;

  test.request.body = {
    address: 'Pharmacy address',
    city: 'London',
    country: 'United kingdom',
    location: {
      latitude: 21,
      longitude: 10
    }
  };

  done();
});

hooks.before('POST /consultation/add -> 200', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;
  done();
});

hooks.after('POST /consultation/add -> 200', function (test, done) {
  consultationId = test.response.body._id;
  done();
});

hooks.before('POST /consultation/add -> 401', function (test, done) {
  done();
});

// hooks.before('POST /consultation/add -> 302', function (test, done) {
//   test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;
//   done();
// });

hooks.before('GET /consultation/{id} -> 200 patient', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;
  test.request.params.id = consultationId;

  done();
});

hooks.before('GET /consultation/{id} -> 401', function (test, done) {
  done();
});

hooks.before('GET /consultation/{id} -> 404', function (test, done) {
  test.request.headers.Authorization = patientToken.token_type + ' ' + patientToken.access_token;
  done();
});

hooks.before('GET /consultation/{id} -> 403 doctor_non_assign', function (test, done) {
  test.request.headers.Authorization = doctorToken.token_type + ' ' + doctorToken.access_token;
  test.request.params.id = consultationId;

  done();
});

hooks.before('GET /consultation/{id} -> 200 admin', function (test, done) {
  test.request.headers.Authorization = adminToken.token_type + ' ' + adminToken.access_token;
  test.request.params.id = consultationId;

  done();
});

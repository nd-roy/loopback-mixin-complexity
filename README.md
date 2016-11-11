![Karma Logo](logo.png)

# Restfull API

By [Kamet](http://www-test.kametventures.com/)

**Build** [![Build Status](http://badgeci.karma.k4met.com/badge/build-api)](https://ci.karma.k4met.com/go/tab/pipeline/history/build-api) ⇛ 
**Dev** [![Build Status](http://badgeci.karma.k4met.com/badge/api-to-dev)](https://ci.karma.k4met.com/go/tab/pipeline/history/api-to-dev) ⇛ 
**Demo** [![Build Status](http://badgeci.karma.k4met.com/badge/api-to-demo)](https://ci.karma.k4met.com/go/tab/pipeline/history/api-to-demo)

## Installation

### NPM

OSX :

```ssh
brew install node
```


### Sources
```ssh
git@github.com:kametventures/karma-api.git
cd karma-api
npm install
```

### Configure Docker

```ssh
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:8
docker run -d -p 6379:6379 --name redis redis
```

## Commands

### Start the project

To launch the application as a NodeJs daemon

```ssh
npm start
```

 - The application will listen the port `3000`
 - The source code will be watched by [nodemon](https://github.com/remy/nodemon)

### Execute the tests

 To launch the tests, simply execute:

 ```ssh
 npm test
 ```

 We are using:

  - [Flow](https://flowtype.org)
  - [Mocha](https://github.com/mochajs/mocha)
  - [Chai](http://chaijs.com)
  
# Rules

## EsLint

We are using the `airbnb` and `flowtype` style guide in our project. In order to validate a feature, you need to follow their guideline because style guide is executed before the unit tests.

Some additionnal rules have been added to match with the `ExpressJs` framework:

| Rule  | Description  |
|---|---|
| `"prefer-arrow-callback": 0,`  | Flow and arrow callback are imcompatible.  |
| `"new-cap": 0,`  | Some first letters of ExpressJs function are in Uppercase |
| `"no-param-reassign": [1, { "props": false } ],`  | Reassign a variable is blocked but change a property is accepted in order to change the request object of `ExpressJs` |
| `no-unused-vars` | We need to declare all the variables to be able to use the error handler of `ExpressJs` |

## Raml

RESTful API Modeling Language (`RAML`) helps us to generate our documentation and end-to-end tests.

The Raml is defined in the `doc` folder.

Please install [Api workbench](http://apiworkbench.com/) to make easier the implementation of the new routes.



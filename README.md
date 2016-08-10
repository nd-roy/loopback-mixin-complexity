Complexity
==========

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework.
It allows of any Model to validate the complexity of a field. 
It can help to builds regular expressions based on common settings for passwords, username, and other user identification methods.

Install
-------

```bash
  npm install --save loopback-mixin-complexity
```

Configure
----------

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
    "Complexity": {
      "fields" : {
        "password" : {   
          "uppercase": 1,    // A through Z
          "lowercase": 1,    // a through z
          "special": 0,      // ! @ # $ & *
          "digit": 1,        // 0 through 9
          "alphaNumeric": 1, // a through Z
          "min": 6,          // minumum number of characters
          "max": 16,         // silly idea to have maximum...
          "exact": 20        // match the exact number of characters
        }
      }
    },
```



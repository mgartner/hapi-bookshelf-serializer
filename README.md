# Hapi Bookshelf Serializer
[![Build Status](https://travis-ci.org/lob/hapi-bookshelf-serializer.svg)](https://travis-ci.org/lob/hapi-bookshelf-serializer)
[![Coverage Status](https://coveralls.io/repos/lob/hapi-bookshelf-serializer/badge.svg?branch=master)](https://coveralls.io/r/lob/hapi-bookshelf-serializer?branch=master)

This plugin takes [Bookshelf.js](http://bookshelfjs.org/) models that are returned via [Hapi](http://hapijs.com/)'s ```reply``` method and serializers them using [Joi](https://github.com/hapijs/joi) schemas.

# Registering the Plugin
```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();

server.register([
  {
    register: require('hapi-bookshelf-serializer'),
    options: {
      directory: 'path/to/serializers' // Required
    }
  }
], function (err) {
  // An error will be available here if anything goes wrong
});
```

# Options
- ```directory``` directory where your serializers are defined

# Defining Serializers
The serializers are just [Joi](https://github.com/hapijs/joi) schemas that are applied using the ```stripUnknown``` option. Below is a basic example of related serializers.

## Example
```javascript
// Target Object
{
  id: 1,
  name: 'Test User',
  roles: [
    {
      id: 1,
      name: 'admin'
    }
  ]
}

// serializers/role.js
var Joi = require('joi');

module.exports = {
  id: Joi.number().integer().required(),
  name: Joi.string().required()
};

// serializers/user.js
var Joi  = require('joi');
var Role = require('./role.js'); 

module.exports = {
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  roles: Joi.array().includes(Role)
};
```

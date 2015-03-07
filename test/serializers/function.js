var Joi = require('joi');

module.exports = function (request) {
  var schema = Joi.object().keys({
    id: Joi.number().integer().required(),
    object: Joi.string().optional().default('function'),
  });

  if (request.method === 'get') {
    schema = schema.keys({
      name: Joi.string().required()
    });
  }

  return schema;
};

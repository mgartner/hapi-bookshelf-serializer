var Boom        = require('boom');
var fs          = require('fs');
var Joi         = require('joi');
var path        = require('path');

var internals = {};

internals.schema = {
  directory: Joi.string().required()
};

internals.serializers = {};

internals.format = function (request, model) {
  var serializer = internals.serializers[model.serializer];

  if (serializer instanceof Function) {
    serializer = serializer(request);
  }

  var formattedModel = Joi.validate(model.toJSON(), serializer,
    { stripUnknown: true });

  if (formattedModel.error) {
    throw formattedModel.error;
  } else {
    return formattedModel.value;
  }
};

module.exports.register = function (server, options, next) {

  try {
    Joi.assert(options, internals.schema, 'Invalid Configuration Object');
  } catch (ex) {
    return next(ex);
  }

  var serializerFiles = fs.readdirSync(options.directory);

  serializerFiles.forEach(function (file) {
    var serializerName = path.basename(file).replace(path.extname(file), '');
    internals.serializers[serializerName] = require(path.join(options.directory,
      file));
  });

  server.ext('onPreResponse', function (request, reply) {
    if (request.response.source && request.response.source.models) {
      try {
        var models = request.response.source.models.map(function (model) {
          return internals.format(request, model);
        });
        request.response.source = models;

        reply.continue();
      } catch (ex) {
        reply(Boom.badImplementation(ex.toString()));
      }
    } else if (request.response.source && request.response.source.serializer) {
      try {
        var model = internals.format(request, request.response.source);
        request.response.source = model;

        reply.continue();
      } catch (ex) {
        reply(Boom.badImplementation(ex.toString()));
      }
    } else {
      reply.continue();
    }
  });
  next();
};

module.exports.register.attributes = {
  name: 'serializer',
  version: '1.1.0'
};

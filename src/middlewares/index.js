const Joi = require("@hapi/joi");

const validator = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.query);

    if (validateResult.error) {
      return res.json({
        success: false,
        error: validateResult.error.details,
      });
    }

    req.value = validateResult.value;
    return next();
  };
};

const bodyValidator = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body);

    if (validateResult.error) {
      return res.json({
        success: false,
        error: validateResult.error.details,
      });
    }

    req.value = validateResult.value;
    return next();
  };
};

const schemas = {
  idSchema: Joi.object().keys({
    id: Joi.string()
      .regex(/^[A-Z0-9]{8}$/)
      .required(),
  }),

  searchSchema: Joi.object().keys({
    searchValue: Joi.string().required(),
  }),

  artistSchema: Joi.object().keys({
    alias: Joi.string().required(),
  }),

  downloadSchema: Joi.object().keys({
    type: Joi.string().valid("song", "playlist").required(),
    id: Joi.string()
      .regex(/^[A-Z0-9]{8}$/)
      .required(),
    query: Joi.string().valid("128", "320").required(),
  }),
};

module.exports = {
  validator,
  bodyValidator,
  schemas,
};

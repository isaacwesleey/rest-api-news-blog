'use strict';

import Joi from 'joi';

const schemas = {
  user: Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  }),
  news: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(1000).required(),
  }),
};

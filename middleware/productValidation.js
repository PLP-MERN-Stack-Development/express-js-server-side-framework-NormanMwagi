import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('electronics', 'kitchen', 'fashion', 'other').required(),
  inStock: Joi.boolean().default(true),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().positive(),
  category: Joi.string().valid('electronics', 'kitchen', 'fashion', 'other'),
  inStock: Joi.boolean(),
});

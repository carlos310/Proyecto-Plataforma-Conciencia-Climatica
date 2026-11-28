import Joi from 'joi';

export type ReturnUpdateProductoData = Partial<{
  name: string;
  description: string;
  sellValue: number;
  buyValue: number;
  stock: string;
  category: string;
  providerId: number;
  measure: string;
  material: string;
}>;

type ValidationUpdateProductoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateProductoData;
};

function validateUpdateProductoData(data: any): ValidationUpdateProductoData {
  const ProductoSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    name: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.base': 'El nombre debe ser un texto.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
      }),

    description: Joi.string().trim().min(3).optional().messages({
      'string.base': 'La descripción debe ser un texto.',
      'string.empty': 'La descripción no puede estar vacía.',
      'string.min': 'La descripción debe tener al menos 3 caracteres.',
    }),

    sellValue: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El valor de venta debe ser un número.',
      'number.min': 'El valor de venta debe ser mayor a 0.',
    }),

    buyValue: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El valor de compra debe ser un número.',
      'number.min': 'El valor de compra debe ser mayor a 0.',
    }),

    stock: Joi.string().trim().max(40).optional().messages({
      'string.base': 'El stock debe ser un texto.',
      'string.max': 'El stock no puede superar los 40 caracteres.',
    }),

    category: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.base': 'La categoría debe ser un texto.',
        'string.empty': 'La categoría no puede estar vacía.',
        'string.min': 'La categoría debe tener al menos 3 caracteres.',
        'string.max': 'La categoría no puede superar los 100 caracteres.',
        'string.pattern.base': 'La categoría solo puede contener letras y espacios.',
      }),

    providerId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El id de proveedor debe ser un número.',
      'number.min': 'El id de proveedor debe ser mayor a 0.',
    }),
    measure: Joi.string().trim().min(1).optional().messages({
      'string.base': 'La medida debe ser un texto.',
      'string.empty': 'La medida no puede estar vacía.',
    }),
    material: Joi.string().trim().min(1).max(45).optional().messages({
      'string.base': 'El material debe ser un texto.',
      'string.empty': 'El material no puede estar vacío.',
      'string.max': 'El material no puede superar los 45 caracteres.',
    }),
  }).unknown(false);

  const { error, value } = ProductoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  return { error, value };
}

export const loadUpdateProductoData = (data: any): ReturnUpdateProductoData => {
  const result = validateUpdateProductoData(data);
  if (result.error) {
    const message = result.error.details.map((d:any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

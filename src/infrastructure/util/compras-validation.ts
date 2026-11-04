import Joi from 'joi';

export interface Compra {
  id: number;
  total: number;
  quantity: number;
  date: Date;
  provider: string;
  usuId: number;
}

type ValidationCompraData = {
  error: Joi.ValidationError | undefined;
  value: Compra;
};

function validateCompraData(data: any): ValidationCompraData {
  const compraSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    total: Joi.number().positive().precision(2).required().messages({
      'number.base': 'El total debe ser un número.',
      'number.positive': 'El total debe ser mayor que 0.',
      'any.required': 'El total es obligatorio.',
    }),

    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': 'La cantidad debe ser un número.',
      'number.min': 'La cantidad debe ser al menos 1.',
      'any.required': 'La cantidad es obligatoria.',
    }),

    date: Joi.date().iso().required().messages({
      'date.base': 'La fecha debe tener un formato válido.',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD).',
      'any.required': 'La fecha es obligatoria.',
    }),

    provider: Joi.string().trim().min(3).max(100).required().messages({
      'string.base': 'El proveedor debe ser un texto.',
      'string.empty': 'El proveedor no puede estar vacío.',
      'string.min': 'El proveedor debe tener al menos 3 caracteres.',
      'string.max': 'El proveedor no puede superar los 100 caracteres.',
      'any.required': 'El proveedor es obligatorio.',
    }),

    usuId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'number.min': 'El ID de usuario debe ser mayor a 0.',
      'any.required': 'El ID de usuario es obligatorio.',
    }),
  }).unknown(false);

  const { error, value } = compraSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadCompraData = (data: any): Compra => {
  const result = validateCompraData(data);
  if (result.error) {
    const message = result.error.details.map((d:any) => d.message).join(', ');
    throw new Error(message);
  }
  return result.value;
};

import Joi from 'joi';

export type ReturnVentaData = {
  id: number;
  total: number;
  cantidad: number;
  fecha: Date;
  clienteId: number;
  usuId: number;
};

type ValidationVentaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnVentaData;
};

function validateVentaData(data: any): ValidationVentaData {
  const VentaSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    total: Joi.number().positive().precision(2).required().messages({
      'number.base': 'El total debe ser un número.',
      'number.positive': 'El total debe ser mayor que 0.',
      'any.required': 'El total es obligatorio.',
    }),
    cantidad: Joi.number().integer().min(1).required().messages({
      'number.base': 'La cantidad debe ser un número.',
      'number.min': 'La cantidad debe ser al menos 1.',
      'any.required': 'La cantidad es obligatoria.',
    }),
    fecha: Joi.date().iso().required().messages({
      'date.base': 'La fecha debe tener un formato válido.',
      'any.required': 'La fecha es obligatoria.',
    }),
    clienteId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de cliente debe ser un número.',
      'number.min': 'El ID de cliente debe ser mayor a 0.',
      'any.required': 'El ID de cliente es obligatorio.',
    }),
    usuId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'number.min': 'El ID de usuario debe ser mayor a 0.',
      'any.required': 'El ID de usuario es obligatorio.',
    }),
  }).unknown(false);

  const { error, value } = VentaSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadVentaData = (data: any): ReturnVentaData => {
  const result = validateVentaData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

import Joi from 'joi';

export type ReturnUpdateVentaData = Partial<{
  total: number;
  cantidad: number;
  fecha: Date;
  clienteId: number;
  usuId: number;
}>;

type ValidationUpdateVentaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateVentaData;
};

function validateUpdateVentaData(data: any): ValidationUpdateVentaData {
  const VentaSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    total: Joi.number().positive().precision(2).optional().messages({
      'number.base': 'El total debe ser un número.',
      'number.positive': 'El total debe ser mayor que 0.',
    }),
    cantidad: Joi.number().integer().min(1).optional().messages({
      'number.base': 'La cantidad debe ser un número.',
      'number.min': 'La cantidad debe ser al menos 1.',
    }),
    fecha: Joi.date().iso().optional().messages({
      'date.base': 'La fecha debe tener un formato válido.',
    }),
    clienteId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El ID de cliente debe ser un número.',
      'number.min': 'El ID de cliente debe ser mayor a 0.',
    }),
    usuId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'number.min': 'El ID de usuario debe ser mayor a 0.',
    }),
  }).unknown(false);

  const { error, value } = VentaSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  return { error, value };
}

export const loadUpdateVentaData = (data: any): ReturnUpdateVentaData => {
  const result = validateUpdateVentaData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

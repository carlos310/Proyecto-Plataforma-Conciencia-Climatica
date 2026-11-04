import Joi from 'joi';

export interface Gasto {
  id: number;
  description: string;
  value: number;
  date: Date;
  empId: number;
  usuId: number;
}

type ValidationGastoData = {
  error: Joi.ValidationError | undefined;
  value: Gasto;
};

function validateGastoData(data: any): ValidationGastoData {
  const gastoSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    description: Joi.string().trim().min(3).max(200).required().messages({
      'string.base': 'La descripción debe ser un texto.',
      'string.empty': 'La descripción no puede estar vacía.',
      'string.min': 'La descripción debe tener al menos 3 caracteres.',
      'string.max': 'La descripción no puede superar los 200 caracteres.',
      'any.required': 'La descripción es obligatoria.',
    }),

    value: Joi.number().positive().precision(2).required().messages({
      'number.base': 'El valor debe ser un número.',
      'number.positive': 'El valor debe ser mayor que 0.',
      'any.required': 'El valor es obligatorio.',
    }),

    date: Joi.date().iso().required().messages({
      'date.base': 'La fecha debe tener un formato válido.',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD).',
      'any.required': 'La fecha es obligatoria.',
    }),

    empId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de empleado debe ser un número.',
      'number.min': 'El ID de empleado debe ser mayor a 0.',
      'any.required': 'El ID de empleado es obligatorio.',
    }),

    usuId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'number.min': 'El ID de usuario debe ser mayor a 0.',
      'any.required': 'El ID de usuario es obligatorio.',
    }),
  }).unknown(false);

  const { error, value } = gastoSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadGastoData = (data: any): Gasto => {
  const result = validateGastoData(data);
  if (result.error) {
    const message = result.error.details.map((d:any) => d.message).join(', ');
    throw new Error(message);
  }
  return result.value;
};

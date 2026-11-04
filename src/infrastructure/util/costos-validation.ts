import Joi from 'joi';

export interface Costo {
  id: number;
  description: string;
  value: number;
  date: Date;
  source: string;
  empId: number;
  usuId: number;
}

type ValidationCostoData = {
  error: Joi.ValidationError | undefined;
  value: Costo;
};

function validateCostoData(data: any): ValidationCostoData {
  const costoSchema = Joi.object({
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

    source: Joi.string().trim().min(3).max(100).required().messages({
      'string.base': 'La fuente debe ser un texto.',
      'string.empty': 'La fuente no puede estar vacía.',
      'string.min': 'La fuente debe tener al menos 3 caracteres.',
      'string.max': 'La fuente no puede superar los 100 caracteres.',
      'any.required': 'La fuente es obligatoria.',
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

  const { error, value } = costoSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadCostoData = (data: any): Costo => {
  const result = validateCostoData(data);
  if (result.error) {
    const message = result.error.details.map((d:any) => d.message).join(', ');
    throw new Error(message);
  }
  return result.value;
};

import Joi from 'joi';

export type ReturnEmpleadoData = {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  salario: number;
  fechaContratacion: Date;
  usuId: number;
  rol: string;
};

type ValidationEmpleadoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnEmpleadoData;
};

function validateEmpleadoData(data: any): ValidationEmpleadoData {
  const EmpleadoSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    nombre: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.base': 'El nombre debe ser un texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'any.required': 'El nombre es obligatorio.',
      }),
    apellido: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.base': 'El apellido debe ser un texto.',
        'string.min': 'El apellido debe tener al menos 3 caracteres.',
        'any.required': 'El apellido es obligatorio.',
      }),
    cargo: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'El cargo debe ser un texto.',
        'string.min': 'El cargo debe tener al menos 3 caracteres.',
        'any.required': 'El cargo es obligatorio.',
      }),
    salario: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'El salario debe ser un número.',
        'number.positive': 'El salario debe ser mayor que 0.',
        'any.required': 'El salario es obligatorio.',
      }),
    fechaContratacion: Joi.date()
      .iso()
      .required()
      .messages({
        'date.base': 'La fecha debe tener un formato válido.',
        'any.required': 'La fecha de contratación es obligatoria.',
      }),
    usuId: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'El ID de usuario debe ser un número.',
        'any.required': 'El ID de usuario es obligatorio.',
      }),
    rol: Joi.string()
      .trim()
      .valid('gerente', 'supervisor', 'operario')
      .required()
      .messages({
        'any.only': 'El rol debe ser gerente, supervisor u operario.',
        'any.required': 'El rol es obligatorio.',
      }),
  }).unknown(false);

  const { error, value } = EmpleadoSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadEmpleadoData = (data: any): ReturnEmpleadoData => {
  const result = validateEmpleadoData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

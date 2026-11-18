import Joi from 'joi';

export type ReturnUpdateEmpleadoData = Partial<{
  nombre: string;
  apellido: string;
  cargo: string;
  salario: number;
  fechaContratacion: Date;
  usuId: number;
  rol: string;
}>;

type ValidationUpdateEmpleadoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateEmpleadoData;
};

function validateUpdateEmpleadoData(data: any): ValidationUpdateEmpleadoData {
  const EmpleadoSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    nombre: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.base': 'El nombre debe ser un texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
      }),
    apellido: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.base': 'El apellido debe ser un texto.',
        'string.min': 'El apellido debe tener al menos 3 caracteres.',
      }),
    cargo: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .optional()
      .messages({
        'string.base': 'El cargo debe ser un texto.',
        'string.min': 'El cargo debe tener al menos 3 caracteres.',
      }),
    salario: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.base': 'El salario debe ser un número.',
        'number.positive': 'El salario debe ser mayor que 0.',
      }),
    fechaContratacion: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'La fecha debe tener un formato válido.',
      }),
    usuId: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'El ID de usuario debe ser un número.',
      }),
    rol: Joi.string()
      .trim()
      .valid('gerente', 'supervisor', 'operario')
      .optional()
      .messages({
        'any.only': 'El rol debe ser gerente, supervisor u operario.',
      }),
  }).unknown(false);

  const { error, value } = EmpleadoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  return { error, value };
}

export const loadUpdateEmpleadoData = (data: any): ReturnUpdateEmpleadoData => {
  const result = validateUpdateEmpleadoData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

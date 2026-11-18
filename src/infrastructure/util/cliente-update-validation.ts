import Joi from 'joi';

export type ReturnUpdateClienteData = Partial<{
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  usuId: number;
  rol: string;
}>;

type ValidationUpdateClienteData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateClienteData;
};

function validateUpdateClienteData(data: any): ValidationUpdateClienteData {
  const ClienteSchema = Joi.object({
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
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 100 caracteres.',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
      }),

    apellido: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.base': 'El apellido debe ser un texto.',
        'string.empty': 'El apellido no puede estar vacío.',
        'string.min': 'El apellido debe tener al menos 3 caracteres.',
        'string.max': 'El apellido no puede superar los 100 caracteres.',
        'string.pattern.base': 'El apellido solo puede contener letras y espacios.',
      }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .optional()
      .messages({
        'string.base': 'El correo debe ser un texto.',
        'string.email': 'El correo debe tener un formato válido.',
      }),

    telefono: Joi.string()
      .trim()
      .min(7)
      .max(20)
      .optional()
      .messages({
        'string.base': 'El teléfono debe ser un texto.',
        'string.min': 'El teléfono debe tener al menos 7 caracteres.',
        'string.max': 'El teléfono no puede superar los 20 caracteres.',
      }),

    direccion: Joi.string()
      .trim()
      .min(5)
      .max(150)
      .optional()
      .messages({
        'string.base': 'La dirección debe ser un texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 150 caracteres.',
      }),

    usuId: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'El ID de usuario debe ser un número.',
        'number.min': 'El ID de usuario debe ser mayor a 0.',
      }),

    rol: Joi.string()
      .trim()
      .valid('cliente', 'vip')
      .optional()
      .messages({
        'string.base': 'El rol debe ser un texto.',
        'any.only': 'El rol debe ser cliente o vip.',
      }),
  }).unknown(false);

  const { error, value } = ClienteSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  return { error, value };
}

export const loadUpdateClienteData = (data: any): ReturnUpdateClienteData => {
  const result = validateUpdateClienteData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

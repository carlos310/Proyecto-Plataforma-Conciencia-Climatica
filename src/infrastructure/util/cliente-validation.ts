import Joi from 'joi';

export type ReturnClienteData = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  usuId: number;
  rol: string;
};

type ValidationClienteData = {
  error: Joi.ValidationError | undefined;
  value: ReturnClienteData;
};

function validateClienteData(data: any): ValidationClienteData {
  const ClienteSchema = Joi.object({
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
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 100 caracteres.',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
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
        'string.empty': 'El apellido no puede estar vacío.',
        'string.min': 'El apellido debe tener al menos 3 caracteres.',
        'string.max': 'El apellido no puede superar los 100 caracteres.',
        'string.pattern.base': 'El apellido solo puede contener letras y espacios.',
        'any.required': 'El apellido es obligatorio.',
      }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.base': 'El correo debe ser un texto.',
        'string.email': 'El correo debe tener un formato válido.',
        'any.required': 'El correo es obligatorio.',
      }),

    telefono: Joi.string()
      .trim()
      .min(7)
      .max(20)
      .required()
      .messages({
        'string.base': 'El teléfono debe ser un texto.',
        'string.min': 'El teléfono debe tener al menos 7 caracteres.',
        'string.max': 'El teléfono no puede superar los 20 caracteres.',
        'any.required': 'El teléfono es obligatorio.',
      }),

    direccion: Joi.string()
      .trim()
      .min(5)
      .max(150)
      .required()
      .messages({
        'string.base': 'La dirección debe ser un texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 150 caracteres.',
        'any.required': 'La dirección es obligatoria.',
      }),

    usuId: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'El ID de usuario debe ser un número.',
        'number.min': 'El ID de usuario debe ser mayor a 0.',
        'any.required': 'El ID de usuario es obligatorio.',
      }),

    rol: Joi.string()
      .trim()
      .valid('cliente', 'vip')
      .required()
      .messages({
        'string.base': 'El rol debe ser un texto.',
        'any.only': 'El rol debe ser cliente o vip.',
        'any.required': 'El rol es obligatorio.',
      }),
  }).unknown(false);

  const { error, value } = ClienteSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadClienteData = (data: any): ReturnClienteData => {
  const result = validateClienteData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

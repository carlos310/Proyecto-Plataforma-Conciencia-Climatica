import Joi from 'joi';

export type ReturnProveedorData = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  contacto: string;
  estado: string;
};

type ValidationProveedorData = {
  error: Joi.ValidationError | undefined;
  value: ReturnProveedorData;
};

function validateProveedorData(data: any): ValidationProveedorData {
  const ProveedorSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    nombre: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'El nombre debe ser un texto.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 100 caracteres.',
        'any.required': 'El nombre es obligatorio.',
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

    ciudad: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.base': 'La ciudad debe ser un texto.',
        'string.min': 'La ciudad debe tener al menos 3 caracteres.',
        'string.max': 'La ciudad no puede superar los 50 caracteres.',
        'any.required': 'La ciudad es obligatoria.',
      }),

    pais: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.base': 'El país debe ser un texto.',
        'string.min': 'El país debe tener al menos 3 caracteres.',
        'string.max': 'El país no puede superar los 50 caracteres.',
        'any.required': 'El país es obligatorio.',
      }),

    contacto: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'El contacto debe ser un texto.',
        'string.min': 'El contacto debe tener al menos 3 caracteres.',
        'string.max': 'El contacto no puede superar los 100 caracteres.',
        'any.required': 'El contacto es obligatorio.',
      }),

    estado: Joi.string()
      .trim()
      .valid('activo', 'inactivo')
      .required()
      .messages({
        'string.base': 'El estado debe ser un texto.',
        'any.only': 'El estado debe ser activo o inactivo.',
        'any.required': 'El estado es obligatorio.',
      }),
  }).unknown(false);

  const { error, value } = ProveedorSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadProveedorData = (data: any): ReturnProveedorData => {
  const result = validateProveedorData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

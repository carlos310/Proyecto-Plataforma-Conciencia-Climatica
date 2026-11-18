import Joi from 'joi';

export type ReturnFacturaData = {
  id: number;
  tipo: string;
  referenciaId: number;
  fecha: Date;
  total: number;
  cantidad: number;
  estado: string;
  proveedorCliente: string;
  usuId: number;
  loteId: string;
};

type ValidationFacturaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnFacturaData;
};

function validateFacturaData(data: any): ValidationFacturaData {
  const FacturaSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    tipo: Joi.string()
      .trim()
      .valid('venta', 'compra')
      .required()
      .messages({
        'any.only': 'El tipo debe ser venta o compra.',
        'any.required': 'El tipo es obligatorio.',
      }),
    referenciaId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de referencia debe ser un número.',
      'any.required': 'El ID de referencia es obligatorio.',
    }),
    fecha: Joi.date().iso().required().messages({
      'date.base': 'La fecha debe tener un formato válido.',
      'any.required': 'La fecha es obligatoria.',
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
    estado: Joi.string()
      .trim()
      .valid('pendiente', 'pagada', 'cancelada')
      .required()
      .messages({
        'any.only': 'El estado debe ser pendiente, pagada o cancelada.',
        'any.required': 'El estado es obligatorio.',
      }),
    proveedorCliente: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'El proveedor/cliente debe ser un texto.',
        'string.empty': 'El proveedor/cliente no puede estar vacío.',
        'string.min': 'El proveedor/cliente debe tener al menos 3 caracteres.',
        'string.max': 'El proveedor/cliente no puede superar los 100 caracteres.',
        'any.required': 'El proveedor/cliente es obligatorio.',
      }),
    usuId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'any.required': 'El ID de usuario es obligatorio.',
    }),
    loteId: Joi.string()
      .trim()
      .max(100)
      .optional()
      .messages({
        'string.base': 'El ID de lote debe ser un texto.',
      }),
  }).unknown(false);

  const { error, value } = FacturaSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadFacturaData = (data: any): ReturnFacturaData => {
  const result = validateFacturaData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

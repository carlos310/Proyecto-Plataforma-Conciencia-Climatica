import Joi from 'joi';

export type ReturnUpdateFacturaData = Partial<{
  tipo: string;
  referenciaId: number;
  fecha: Date;
  total: number;
  cantidad: number;
  estado: string;
  proveedorCliente: string;
  usuId: number;
  loteId: string;
}>;

type ValidationUpdateFacturaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateFacturaData;
};

function validateUpdateFacturaData(data: any): ValidationUpdateFacturaData {
  const FacturaSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    tipo: Joi.string()
      .trim()
      .valid('venta', 'compra')
      .optional()
      .messages({
        'any.only': 'El tipo debe ser venta o compra.',
      }),
    referenciaId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El ID de referencia debe ser un número.',
    }),
    fecha: Joi.date().iso().optional().messages({
      'date.base': 'La fecha debe tener un formato válido.',
    }),
    total: Joi.number().positive().precision(2).optional().messages({
      'number.base': 'El total debe ser un número.',
      'number.positive': 'El total debe ser mayor que 0.',
    }),
    cantidad: Joi.number().integer().min(1).optional().messages({
      'number.base': 'La cantidad debe ser un número.',
      'number.min': 'La cantidad debe ser al menos 1.',
    }),
    estado: Joi.string()
      .trim()
      .valid('pendiente', 'pagada', 'cancelada')
      .optional()
      .messages({
        'any.only': 'El estado debe ser pendiente, pagada o cancelada.',
      }),
    proveedorCliente: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .optional()
      .messages({
        'string.base': 'El proveedor/cliente debe ser un texto.',
        'string.min': 'El proveedor/cliente debe tener al menos 3 caracteres.',
      }),
    usuId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'El ID de usuario debe ser un número.',
    }),
    loteId: Joi.string()
      .trim()
      .max(100)
      .optional()
      .messages({
        'string.base': 'El ID de lote debe ser un texto.',
      }),
  }).unknown(false);

  const { error, value } = FacturaSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  return { error, value };
}

export const loadUpdateFacturaData = (data: any): ReturnUpdateFacturaData => {
  const result = validateUpdateFacturaData(data);
  if (result.error) {
    const message = result.error.details.map((d: any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

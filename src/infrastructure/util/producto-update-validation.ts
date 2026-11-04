import Joi from 'joi';
//no es una clase es solo un modulo
const joi = Joi;
export type ReturnUpdateProductoData = Partial<{
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: number;
  address: string;
}>;
type ValidationUpdateProductoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateProductoData;
};
function validateUpdateProductoData(data: any): ValidationUpdateProductoData {
  const ProductoSchema = Joi.object({
    id: Joi.any().forbidden().messages({
      'any.unknown': 'El campo id no puede ser modificado.',
    }),
    name: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.base': 'El nombre debe ser un texto.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
        'any.required': 'El nombre es obligatorio.',
      }),

    description: Joi.string().trim().min(3).required().messages({
      'string.base': 'La descripción debe ser un texto.',
      'string.empty': 'La descripción no puede estar vacía.',
      'string.min': 'La descripción debe tener al menos 3 caracteres.',
      'any.required': 'La descripción es obligatoria.',
    }),

    sellValue: Joi.number().integer().min(1).required().messages({
      'number.base': 'El valor de venta debe ser un número.',
      'number.min': 'El valor de venta debe ser mayor a 0.',
      'any.required': 'El valor de venta es obligatorio.',
    }),

    buyValue: Joi.number().integer().min(1).required().messages({
      'number.base': 'El valor de compra debe ser un número.',
      'number.min': 'El valor de compra debe ser mayor a 0.',
      'any.required': 'El valor de compra es obligatorio.',
    }),

    stock: Joi.number().integer().min(0).required().messages({
      'number.base': 'El stock debe ser un número.',
      'number.min': 'El stock no puede ser negativo.',
      'any.required': 'El stock es obligatorio.',
    }),

    category: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.base': 'La categoría debe ser un texto.',
        'string.empty': 'La categoría no puede estar vacía.',
        'string.min': 'La categoría debe tener al menos 3 caracteres.',
        'string.max': 'La categoría no puede superar los 100 caracteres.',
        'string.pattern.base': 'La categoría solo puede contener letras y espacios.',
        'any.required': 'La categoría es obligatoria.',
      }),

    providerId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El id de proveedor debe ser un número.',
      'number.min': 'El id de proveedor debe ser mayor a 0.',
      'any.required': 'El id de proveedor es obligatorio.',
    }),
  })
    .unknown(false)
    .or('id', 'name', 'lastname', 'email', 'password', 'phone', 'address'); //no se permiten campos extra u otros fields no conocidos
  //el or se agregó para que no se limite a exigir todo sino que permita que no sean todos los valores los que se modifiquen
  const { error, value } = ProductoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  }); //abortEarly define cuantos errores soporta mientras va validando si fuera true pararía en el primer error, en este caso como es false solo sigue después de obtener el error
  return { error, value };
}
//funcion de carga de datos
export const loadUpdateProductoData = (data: any): ReturnUpdateProductoData => {
  const result = validateUpdateProductoData(data);
  if (result.error) {
    //une todos los mensajes en una sola cadena
    const message = result.error.details.map((d:any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

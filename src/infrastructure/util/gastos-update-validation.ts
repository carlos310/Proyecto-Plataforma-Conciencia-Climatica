import Joi from 'joi';
//no es una clase es solo un modulo
const joi = Joi;
export type ReturnUpdateGastoData = Partial<{
  id: number;
  description: string;
  value: number;
  date: Date;
  empId: number;
  usuId: number;
}>;
type ValidationUpdateGastoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateGastoData;
};
function validateUpdateGastoData(data: any): ValidationUpdateGastoData {
  const GastoSchema = Joi.object({
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
  })
    .unknown(false)
    .or('id', 'description', 'value', 'date', 'empId', 'usuId'); //no se permiten campos extra u otros fields no conocidos
  //el or se agregó para que no se limite a exigir todo sino que permita que no sean todos los valores los que se modifiquen
  const { error, value } = GastoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  }); //abortEarly define cuantos errores soporta mientras va validando si fuera true pararía en el primer error, en este caso como es false solo sigue después de obtener el error
  return { error, value };
}
//funcion de carga de datos
export const loadUpdateGastoData = (data: any): ReturnUpdateGastoData => {
  const result = validateUpdateGastoData(data);
  if (result.error) {
    //une todos los mensajes en una sola cadena
    const message = result.error.details.map((d:any) => d.message).join(',');
    throw new Error(message);
  }
  return result.value;
};

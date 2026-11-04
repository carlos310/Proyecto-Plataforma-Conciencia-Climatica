import Joi from 'joi';
//no es una clase es solo un modulo
const joi=Joi;
export type ReturnUserData={
    name:string,
    email:string;
    password:string;
    rol:string;
}
type ValidationUserData={
    error:Joi.ValidationError|undefined;
    value:ReturnUserData;    
}
function validateUserData(data:any):ValidationUserData{
    const userSchema=Joi.object({
        name:Joi.string()
        .trim()
        .min(3)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            "string.base": "El nombre debe ser un texto.",
            "string.empty": "El nombre no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.pattern.base": "El nombre solo puede contener letras y espacios.",
            "any.required": "El nombre es obligatorio."
        }),
        email:Joi.string()
        .email({tlds:{allow:false}})
        .required()
        .messages({
            "string.base": "El correo debe ser un texto.",
            "string.empty": "El correo no puede estar vacío.",
            "string.email": "El correo debe tener un formato válido (ejemplo: usuario@dominio.com).",
            "any.required": "El correo es obligatorio."
        }), //tlds hace referencia a las terminaciones de los correo, lo que se dice ahí es que no valide eso, ejemplo de tlds .edu
        password: Joi.string()
        .min(8)
        .max(20)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
            "string.base": "La contraseña debe ser un texto.",
            "string.empty": "La contraseña no puede estar vacía.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña no puede superar los 20 caracteres.",
            "string.pattern.base": "La contraseña debe incluir mayúsculas, minúsculas, números y un carácter especial.",
            "any.required": "La contraseña es obligatoria."
        }),
        rol:Joi.string()
        .trim()
        .min(3)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
            "string.base": "El rol debe ser un texto.",
            "string.empty": "El rol no puede estar vacío.",
            "string.min": "El rol debe tener al menos 3 caracteres.",
            "string.pattern.base": "El rol solo puede contener letras y espacios.",
            "any.required": "El rol es obligatorio."
        }),
        
    }).unknown(false); //no se permiten campos extra u otros fields no conocidos

    const{error, value}=userSchema.validate(data,{abortEarly:false});//abortEarly define cuantos errores soporta mientras va validando si fuera true pararía en el primer error, en este caso como es false solo sigue después de obtener el error
    return{error, value};
}
//funcion de carga de datos
export const loadUserData=(data:any):ReturnUserData=>{
    const result=validateUserData(data);
    if(result.error){
        //une todos los mensajes en una sola cadena
        const message =result.error.details.map((d:any)=>d.message).join(',');
        throw new Error(message);
    }
    return result.value;
}
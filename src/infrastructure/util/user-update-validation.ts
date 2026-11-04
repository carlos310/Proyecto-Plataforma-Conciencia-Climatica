import Joi from 'joi';
//no es una clase es solo un modulo
const joi=Joi;
export type ReturnUpdateUserData= Partial<{
    name:string,
    email:string;
    password:string;
    rol:string;
}>;
type ValidationUpdateUserData={
    error:Joi.ValidationError|undefined;
    value:ReturnUpdateUserData;
}
//el esquema coincide con las columnas reales de usuarios (usu_nombre, usu_email, usu_contrasena, usu_rol)
//la contraseña es opcional: si no se envía, se conserva la actual
function validateUpdateUserData(data:any):ValidationUpdateUserData{
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
        //solo se aceptan los roles que entienden las rutas y el menú; cualquier otro texto se rechaza
        rol:Joi.string()
        .trim()
        .valid("admin","empleado","cliente")
        .required()
        .messages({
            "string.base": "El rol debe ser un texto.",
            "string.empty": "El rol no puede estar vacío.",
            "any.only": "El rol debe ser admin, empleado o cliente.",
            "any.required": "El rol es obligatorio."
        }),
        password: Joi.string()
        .min(8)
        .max(20)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
        .optional()
        .messages({
            "string.base": "La contraseña debe ser un texto.",
            "string.empty": "La contraseña no puede estar vacía.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña no puede superar los 20 caracteres.",
            "string.pattern.base": "La contraseña debe incluir mayúsculas, minúsculas, números y un carácter especial."
        }),
    }).unknown(false).or("name","email","rol","password"); //no se permiten campos extra u otros fields no conocidos
    //el or se agregó para que no se limite a exigir todo sino que permita que no sean todos los valores los que se modifiquen
    const{error, value}=userSchema.validate(data,{abortEarly:false, stripUnknown:true,convert:true});//abortEarly define cuantos errores soporta mientras va validando si fuera true pararía en el primer error, en este caso como es false solo sigue después de obtener el error
    return{error, value};
}
//funcion de carga de datos
export const loadUpdateUserData=(data:any):ReturnUpdateUserData=>{
    const result=validateUpdateUserData(data);
    if(result.error){
        //une todos los mensajes en una sola cadena
        const message =result.error.details.map((d:any)=>d.message).join(',');
        throw new Error(message);
    }
    return result.value;
}

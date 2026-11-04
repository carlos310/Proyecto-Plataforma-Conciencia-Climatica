import Joi from 'joi';
export type ReturnUserEmail={
    email:string,
};
type validationUserEmail={
    error:Joi.ValidationError|undefined;
    value:validationUserEmail;
};
function validateUserEmail(data:any){
    const userEmailSchema=Joi.object({
        email:Joi.string()
        .email({tlds:{allow:false}})
        .required()
        .messages({
            "string.base": "El correo debe ser un texto.",
            "string.empty": "El correo no puede estar vacío.",
            "string.email": "El correo debe tener un formato válido (ejemplo: usuario@dominio.com).",
            "any.required": "El correo es obligatorio."
        }), //tlds hace referencia a las terminaciones de los correo, lo que se dice ahí es que no valide eso, ejemplo de tlds .edu
        
        }).unknown(false); //no se permiten campos extra u otros fields no conocidos
        //el or se agregó para que no se limite a exigir todo sino que permita que no sean todos los valores los que se modifiquen
        const{error, value}=userEmailSchema.validate({abortEarly:false});//abortEarly define cuantos errores soporta mientras va validando si fuera true pararía en el primer error, en este caso como es false solo sigue después de obtener el error
        return{error, value};
    
}
export const loadEmail=(data:any):ReturnUserEmail=>{
    const result =validateUserEmail(data);
    if(result.error){
        const message =result.error.details.map((d:any)=>d.message).join(',');
        throw new Error(message);
    }
    return result.value;
}
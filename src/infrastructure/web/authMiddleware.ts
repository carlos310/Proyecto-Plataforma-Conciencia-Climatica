//intermediario que se usa para validar antes de llegar antes de llegar a la ruta original eso es un middleware (para este caso se va a validar el token dado por JWT)
import {Request, Response, NextFunction} from  "express";
import { AuthAppplication } from "../../app/AuthApplication.js";

export function authenticateToken(req:Request, res:Response, next:NextFunction):void{
    const authHeader= req.headers["authorization"];//en el token se pasa un json que iene como clave authorization por eso se usa con el fin de traerlo propiamente
    const token= authHeader&&authHeader.split(" ")[1];//con esto se separa y se obtiene el token
    if(!token){
        res.status(401).json({error:"ERROR EN AUTENTICACIÓN"});
        return;
    }
    try {
        const payload=AuthAppplication.verifyToken(token);
        (req as any).user=payload;//payload es otra parte del token donde se muestran ams datos el token
        next();
    } catch (error) {
        res.status(403).json({error:"Token invalido o expirado"});
        return;
    }
}

//revisa el rol que viene dentro del token; debe usarse después de authenticateToken
export function authorizeRoles(...roles:string[]){
    return (req:Request, res:Response, next:NextFunction):void=>{
        //el rol se compara sin importar mayúsculas: "Admin", "ADMIN" y "admin" son el mismo rol
        const rol=String((req as any).user?.rol??"").trim().toLowerCase();
        if(!rol||!roles.includes(rol)){
            res.status(403).json({error:"No tienes permisos para esta acción"});
            return;
        }
        next();
    };
}

//empleado y admin pueden crear registros
export const empleadoOAdmin=authorizeRoles("empleado","admin");
//solo admin puede editar, borrar o consultar registros internos
export const soloAdmin=authorizeRoles("admin");

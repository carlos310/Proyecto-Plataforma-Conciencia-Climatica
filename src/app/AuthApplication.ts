import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET: string = process.env["JWT_SECRET"] ?? "";

if(!JWT_SECRET){
    throw new Error("JWT no configurado");
}

export class AuthAppplication{
    static generateToken(payload:object):string{
        return jwt.sign(payload, JWT_SECRET, {expiresIn:"1h"});//ESTO GENERA LA CONTRASEÑA O TOKEN QUE SE VA A USAR DESPUÉS
    }
    static verifyToken(token:string):any{
        return jwt.verify(token, JWT_SECRET); //verifica el token generado para saber si puede acceder o no
    }
}
import jwt from "jsonwebtoken";
const JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; //DEBEN SER 32 CARACTERES O BITS, ES UNA CONTRASEÑA QUE SE VA A USAR PARA DAR ACCESO

export class AuthAppplication{
    static generateToken(payload:object):string{
        return jwt.sign(payload, JWT_SECRET, {expiresIn:"1h"});//ESTO GENERA LA CONTRASEÑA O TOKEN QUE SE VA A USAR DESPUÉS
    }
    static verifyToken(token:string):any{
        return jwt.verify(token, JWT_SECRET); //verifica el token generado para saber si puede acceder o no
    }
}
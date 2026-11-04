
import bcrypt from "bcryptjs";
import { User } from "../domain/user.js";
import { UserPort } from "../domain/userPort.js";
import { AuthAppplication } from "./AuthApplication.js";
import jwt from 'jsonwebtoken';



export class UserApplication{
    private port:UserPort;
    constructor(port:UserPort){
        this.port=port;
    };
    //metodo de logueo
    async login(email: string, password: string): Promise<string> {
  // 1. Buscar usuario por email usando el puerto
  const usuario = await this.port.getUserByEmail(email);
  if (!usuario) throw new Error("Usuario no encontrado");

  // 2. Validar contraseña
  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) throw new Error("Contraseña incorrecta");

  // 3. Generar token con tu AuthApplication
  return AuthAppplication.generateToken({ id: usuario.id, email: usuario.email, rol: usuario.rol.trim().toLowerCase() });
}

    async createUser(user:Omit<User, "id">):Promise<number>{
        //tener en cuenta que antes de crear toca validar si el correo ya existe
        const existUser=await this.port.getUserByEmail(user.email);
        if(existUser){
            throw new Error("Un usuario ya existe con este email");
        }
        //hasheo de la contraseña antes de guardarla 
        const hashedPassword=await bcrypt.hash(user.password,12 );//a lo ultimo se especifican la cantidad de vueltas para dar mas seguridad
        user.password=hashedPassword;
        return this.port.createUser(user);
    }
    async getUserById(id:number):Promise<User|null>{
        return await this.port.getUserById(id);
    }
    async getUserByEmail(email:string):Promise<User|null>{
        return await this.port.getUserByEmail(email);
    }
    async getAllUsers():Promise<User[]>{
        return await this.port.getUserAllUser();
    };
    async updateUser(id:number, user:Partial<User>):Promise<boolean>{
        const existingUser=await this.port.getUserById(id);
        if(!existingUser){
            throw new Error("No se puede actualizar porque el usuario no existe");
        }
        if(user.email){
            const emailTaken= await this.port.getUserByEmail(user.email);
            if(emailTaken&&emailTaken.id!==id){
                throw new Error("el email ya está en uso");

            }
        }
        //si viene contraseña nueva también se hashea, igual que al crear el usuario
        //los roles se guardan en minúsculas para que la validación de permisos sea consistente
        if(user.rol){
            user.rol=user.rol.trim().toLowerCase();
        }
        if(user.password){
            user.password=await bcrypt.hash(user.password,12);
        }
        return this.port.updateUser(id, user);
    }
    async  deleteUser(id:number):Promise<boolean>{
        const existUser= await this.port.getUserById(id);
        if(!existUser){
            throw new Error("No es posible borrar el usuario porque no existe");
        }
        return await this.port.deleteUser(id);
    };
}

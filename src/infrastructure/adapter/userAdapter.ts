import { Repository } from 'typeorm';
import { User as UserDomain } from '../../domain/user.js';
import {User as UserEntity} from '../entities/user.js';
import { UserPort } from '../../domain/userPort.js';
import { AppDataSource } from '../config/data-base.js';
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class UserAdapter implements UserPort{
    private userRepository:Repository<UserEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.userRepository=AppDataSource.getRepository(UserEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(user:UserEntity):UserDomain{
        //se especifican los nombres de los datos primero de userDomain : y userEntity para hacer la igualación
        return{
            id:user.usu_id,
            name:user.usu_nombre,
            email:user.usu_email,
            password:user.usu_contrasena,
            rol: user.usu_rol
        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(user:Omit<UserDomain, "id">):UserEntity{
        const userEntity= new UserEntity();
        userEntity.usu_nombre= user.name;
        userEntity.usu_email= user.email;
        userEntity.usu_contrasena= user.password;
        userEntity.usu_rol=user.rol;
        return userEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa userdomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createUser(user: Omit<UserDomain, 'id'>): Promise<number> {
        try {
            const newUser= this.toEntity(user);
            const savedUser=await this.userRepository.save(newUser);
            return savedUser.usu_id;
        } catch (error) {
            console.log("Error creating the new user", error);
            throw new Error("Error creando el usuario");
        }
    }
    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existingUser=await this.userRepository.findOne({where : {usu_id:id}});
            if(!existingUser) return false;
            Object.assign(existingUser, {
                usu_nombre:user.name ?? existingUser.usu_nombre,
                usu_email:user.email??existingUser.usu_email,
                usu_contrasena:user.password ?? existingUser.usu_contrasena,
                usu_rol:user.rol?? existingUser.usu_rol
            });
            await this.userRepository.save(existingUser);
            return true;
            
        } catch (error) {
            console.log("Error updating the new user", error);
            throw new Error("Error actualizando el usuario");
        }
    }
    async deleteUser(id: number): Promise<boolean> {
        try {
            const existingUser= await this.userRepository.findOne({where : {usu_id:id}});
            if(!existingUser) return false;
            await this.userRepository.remove(existingUser);
            return true;
        } catch (error) {
            console.log("Error deleting the new user", error);
            throw new Error("Error borrando el usuario");
        }
    }
    async getUserById(id: number): Promise<UserDomain | null> {
        try {
            const existingUser= await this.userRepository.findOne({where : {usu_id:id}});
            return existingUser? this.toDomain(existingUser):null;
        } catch (error) {
            console.log("Error finding the new user", error);
            throw new Error("Error encontrando el usuario");
        }
    }
    async getUserByEmail(email: string): Promise<UserDomain | null> {
        try {
            const existingUser= await this.userRepository.findOne({where : {usu_email:email}});
            return existingUser? this.toDomain(existingUser):null;
        } catch (error) {
            console.log("Error finding the new user", error);
            throw new Error("Error encontrando el usuario");
        }
    }
    async getUserAllUser(): Promise<UserDomain[]> {
        try {
            const existingUser= await this.userRepository.find();
            return existingUser.map(this.toDomain);
        } catch (error) {
            console.log("Error finding users", error);
            throw new Error("Error encontrando usuarios");
        }
    }
    

}
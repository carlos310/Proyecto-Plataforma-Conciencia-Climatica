import {Router, Request, Response }  from "express";
import { UserAdapter } from '../adapter/userAdapter.js';
import { UserApplication } from "../../app/userApplication.js";
import { UserController} from '../controller/userController.js';
import { authenticateToken, soloAdmin } from "../web/authMiddleware.js";



const userRouter=Router();
//inicializacion de las capas
const userAdapter=new UserAdapter;
const userApp= new UserApplication(userAdapter);
const userController=new UserController(userApp);
//se toma el nombre del function del middleware que valida el token apra ejecutar la validacion de los datos, recordar solo poner a casos donde se requiera una auth, para registrarse no pero para consultar todos los productos o usuarios si
//se pone el nombre de esa funcion entre el route y el async
//ruta para el login user
userRouter.post("/login", async (req:Request, res:Response)=>{
    await userController.login(req, res);
    console.log("Body recibido:", req.body);
});
userRouter.get("/me", authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id; // viene del payload del token
    const user = await userApp.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
//definicion de rutas
userRouter.post("/users", async(req: Request, res: Response)=>{
    try {
        await userController.createUser(req,res);
    } catch (error) {
        res.status(500).json({message:"Error en la creación de usuario", error});
    }
});
userRouter.put("/user/:id",authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response)=>{
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la cactualización del usuario", error});
    }
});
userRouter.delete("/users/:id",authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(500).json({message:"Error al borrar usuario por id", error});
    }
});
//se hace el userRouter para el get de los emails y como se requierede consultar y se tiene un indice que es el email se pone de la siguiente manera
userRouter.get("/users/id/:id",authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await userController.getUserById(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la consulta por id", error});
    }
});

userRouter.get("/users/email/:email",authenticateToken, soloAdmin, async(req: Request, res: Response)=>{
    try {
        await userController.getUserByEmail(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la consulta por email", error});
    }
});

userRouter.get("/users",authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response)=>{
    try {
       await userController.getUserAllUser(req, res); 
    } catch (error) {
       res.status(500).json({message:"Error en la consulta de datos", error}); 
    }
});
export default userRouter;

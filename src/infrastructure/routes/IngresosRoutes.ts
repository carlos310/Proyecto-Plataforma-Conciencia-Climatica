
import {Router, Request, Response}  from "express";
import { IngresosAdapter } from '../adapter/ingresosAdapter.js';
import { IngresoApplication } from "../../app/ingresoApplication.js";
import { IngresoController} from '../controller/ingresosController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const ingresoRouter=Router();
//inicializacion de las capas
const ingresoAdapter=new IngresosAdapter;
const IngresoApp= new IngresoApplication(ingresoAdapter);
const ingresoController=new IngresoController(IngresoApp);
//definicion de rutas
ingresoRouter.post("/ingresos", authenticateToken, empleadoOAdmin, async(req: Request, res: Response)=>{
    try {
        await ingresoController.createIngreso(req,res);
    } catch (error) {
        res.status(500).json({message:"Error en la creación de Ingreso", error});
    }
});
ingresoRouter.put("/Ingreso/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response)=>{
    try {
        await ingresoController.updateIngreso(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la cactualización del Ingreso", error});
    }
});
ingresoRouter.delete("/ingresos/:id", authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await ingresoController.deleteIngreso(req, res);
    } catch (error) {
        res.status(500).json({message:"Error al borrar Ingreso por id", error});
    }
});
//se hace el IngresoRouter para el get de los emails y como se requierede consultar y se tiene un indice que es el email se pone de la siguiente manera
ingresoRouter.get("/ingresos/id/:id", authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await ingresoController.getIngresoById(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la consulta por id", error});
    }
});

ingresoRouter.get("/ingresos", authenticateToken, soloAdmin, async (req: Request, res: Response)=>{
    try {
       await ingresoController.getIngresoAllIngreso(req, res); 
    } catch (error) {
       res.status(500).json({message:"Error en la consulta de datos", error}); 
    }
});
export default ingresoRouter;

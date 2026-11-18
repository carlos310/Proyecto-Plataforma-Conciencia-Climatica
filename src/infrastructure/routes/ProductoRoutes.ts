
import {Router, Request, Response }  from "express";
import { ProductoAdapter } from '../adapter/productoAdapter.js';
import { ProductoApplication } from "../../app/productoApplication.js";
import { ProductoController} from '../controller/productoController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const productoRouter=Router();
//inicializacion de las capas
const productoAdapter=new ProductoAdapter;
const ProductoApp= new ProductoApplication(productoAdapter);
const productoController=new ProductoController(ProductoApp);
//definicion de rutas
productoRouter.post("/", authenticateToken, empleadoOAdmin, async(req: Request, res: Response)=>{
    try {
        await productoController.createProducto(req,res);
    } catch (error) {
        res.status(500).json({message:"Error en la creación de producto", error});
    }
});
productoRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response)=>{
    try {
        await productoController.updateProducto(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la actualización del producto", error});
    }
});
productoRouter.delete("/:id", authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await productoController.deleteProducto(req, res);
    } catch (error) {
        res.status(500).json({message:"Error al borrar producto por id", error});
    }
});

productoRouter.get("/id/:id", authenticateToken, soloAdmin, async(req: Request<{ id: string }>, res: Response)=>{
    try {
        await productoController.getProductoById(req, res);
    } catch (error) {
        res.status(500).json({message:"Error en la consulta por id", error});
    }
});

productoRouter.get("/", async (req: Request, res: Response)=>{
    try {
       await productoController.getProductoAllProducto(req, res);
    } catch (error) {
       res.status(500).json({message:"Error en la consulta de datos", error});
    }
});
export default productoRouter;

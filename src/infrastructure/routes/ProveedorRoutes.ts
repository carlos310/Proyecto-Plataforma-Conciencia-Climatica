import { Router, Request, Response } from "express";
import { ProveedorAdapter } from '../adapter/proveedorAdapter.js';
import { ProveedorApplication } from "../../app/proveedorApplication.js";
import { ProveedorController } from '../controller/proveedorController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const proveedorRouter = Router();

// Inicialización de las capas
const proveedorAdapter = new ProveedorAdapter();
const ProveedorApp = new ProveedorApplication(proveedorAdapter);
const proveedorController = new ProveedorController(ProveedorApp);

// Definición de rutas
proveedorRouter.post("/", authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
    try {
        await proveedorController.createProveedor(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de proveedor", error });
    }
});

proveedorRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await proveedorController.updateProveedor(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualización del proveedor", error });
    }
});

proveedorRouter.delete("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await proveedorController.deleteProveedor(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar proveedor por id", error });
    }
});

proveedorRouter.get("/id/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await proveedorController.getProveedorById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta por id", error });
    }
});

proveedorRouter.get("/", authenticateToken, soloAdmin, async (req: Request, res: Response) => {
    try {
        await proveedorController.getProveedorAllProveedor(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});

export default proveedorRouter;

import { Router, Request, Response } from "express";
import { VentaAdapter } from '../adapter/ventaAdapter.js';
import { VentaApplication } from "../../app/ventaApplication.js";
import { VentaController } from '../controller/ventaController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const ventaRouter = Router();

const ventaAdapter = new VentaAdapter();
const VentaApp = new VentaApplication(ventaAdapter);
const ventaController = new VentaController(VentaApp);

ventaRouter.post("/", authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
    try {
        await ventaController.createVenta(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de venta", error });
    }
});

ventaRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await ventaController.updateVenta(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualización de la venta", error });
    }
});

ventaRouter.delete("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await ventaController.deleteVenta(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar venta por id", error });
    }
});

ventaRouter.get("/id/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await ventaController.getVentaById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta por id", error });
    }
});

ventaRouter.get("/", authenticateToken, soloAdmin, async (req: Request, res: Response) => {
    try {
        await ventaController.getVentaAllVenta(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});

export default ventaRouter;

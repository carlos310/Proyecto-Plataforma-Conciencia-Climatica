import { Router, Request, Response } from "express";
import { FacturaAdapter } from '../adapter/facturaAdapter.js';
import { FacturaApplication } from "../../app/facturaApplication.js";
import { FacturaController } from '../controller/facturaController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const facturaRouter = Router();

const facturaAdapter = new FacturaAdapter();
const FacturaApp = new FacturaApplication(facturaAdapter);
const facturaController = new FacturaController(FacturaApp);

facturaRouter.post("/", authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
    try {
        await facturaController.createFactura(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de factura", error });
    }
});

facturaRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await facturaController.updateFactura(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualización de la factura", error });
    }
});

facturaRouter.delete("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await facturaController.deleteFactura(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar factura por id", error });
    }
});

facturaRouter.get("/id/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await facturaController.getFacturaById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta por id", error });
    }
});

facturaRouter.get("/", authenticateToken, soloAdmin, async (req: Request, res: Response) => {
    try {
        await facturaController.getFacturaAllFactura(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});

export default facturaRouter;

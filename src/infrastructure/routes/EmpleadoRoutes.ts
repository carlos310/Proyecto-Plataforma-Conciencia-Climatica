import { Router, Request, Response } from "express";
import { EmpleadoAdapter } from '../adapter/empleadoAdapter.js';
import { EmpleadoApplication } from "../../app/empleadoApplication.js";
import { EmpleadoController } from '../controller/empleadoController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const empleadoRouter = Router();

const empleadoAdapter = new EmpleadoAdapter();
const EmpleadoApp = new EmpleadoApplication(empleadoAdapter);
const empleadoController = new EmpleadoController(EmpleadoApp);

empleadoRouter.post("/", authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
    try {
        await empleadoController.createEmpleado(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de empleado", error });
    }
});

empleadoRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await empleadoController.updateEmpleado(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualización del empleado", error });
    }
});

empleadoRouter.delete("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await empleadoController.deleteEmpleado(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar empleado por id", error });
    }
});

empleadoRouter.get("/id/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await empleadoController.getEmpleadoById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta por id", error });
    }
});

empleadoRouter.get("/", authenticateToken, soloAdmin, async (req: Request, res: Response) => {
    try {
        await empleadoController.getEmpleadoAllEmpleado(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});

export default empleadoRouter;

import { Router, Request, Response } from "express";
import { ClienteAdapter } from '../adapter/clienteAdapter.js';
import { ClienteApplication } from "../../app/clienteApplication.js";
import { ClienteController } from '../controller/clienteController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const clienteRouter = Router();

const clienteAdapter = new ClienteAdapter();
const ClienteApp = new ClienteApplication(clienteAdapter);
const clienteController = new ClienteController(ClienteApp);

clienteRouter.post("/", authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
    try {
        await clienteController.createCliente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de cliente", error });
    }
});

clienteRouter.put("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await clienteController.updateCliente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualización del cliente", error });
    }
});

clienteRouter.delete("/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await clienteController.deleteCliente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar cliente por id", error });
    }
});

clienteRouter.get("/id/:id", authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await clienteController.getClienteById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta por id", error });
    }
});

clienteRouter.get("/", authenticateToken, soloAdmin, async (req: Request, res: Response) => {
    try {
        await clienteController.getClienteAllCliente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});

export default clienteRouter;

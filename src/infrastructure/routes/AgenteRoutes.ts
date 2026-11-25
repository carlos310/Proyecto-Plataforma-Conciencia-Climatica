import { Router, Request, Response } from "express";
import { AgenteApplication } from "../../app/agenteApplication.js";
import { TicketAdapter } from "../adapter/agenteAdapter.js";
import { AgenteController } from "../controller/agenteController.js";
import { authenticateToken, soloAdmin } from "../web/authMiddleware.js";

const agenteRouter = Router();
const ticketAdapter = new TicketAdapter();
const agenteApplication = new AgenteApplication(ticketAdapter);
const agenteController = new AgenteController(agenteApplication);

agenteRouter.post("/", authenticateToken, (req: Request, res: Response) =>
    agenteController.createTicket(req, res));
agenteRouter.get("/", authenticateToken, soloAdmin, (req: Request, res: Response) =>
    agenteController.getAllTicket(req, res));
agenteRouter.get("/id/:id", authenticateToken, (req: Request<{ id: string }>, res: Response) =>
    agenteController.getTicketById(req, res));
agenteRouter.get("/usuario/:id", authenticateToken, (req: Request<{ id: string }>, res: Response) =>
    agenteController.getTicketbyUser(req, res));
agenteRouter.put("/:id", authenticateToken, (req: Request<{ id: string }>, res: Response) =>
    agenteController.updateTicket(req, res));
agenteRouter.delete("/:id", authenticateToken, (req: Request<{ id: string }>, res: Response) =>
    agenteController.deleteTicket(req, res));

export default agenteRouter;
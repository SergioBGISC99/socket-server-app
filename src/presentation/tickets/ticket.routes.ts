import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { TicketService } from "../services/ticket.service";

export class TicketRoutes {
  static get routes() {
    const router = Router();

    const service = new TicketService();
    const controller = new TicketController(service);

    router.get("/", controller.getTickets);
    router.get("/last", controller.getLastTicketNumber);
    router.get("/pending", controller.pendingTickets);
    router.get("/draw/:desk", controller.drawTicket);
    router.get("/working-on", controller.workingOn);

    router.post("/", controller.createTicket);

    router.put("/done/:ticketId", controller.ticketDone);

    return router;
  }
}

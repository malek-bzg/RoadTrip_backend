import { Router } from "express" ;
import { eventController } from "../controllers/events.controller"

const routes = Router();

routes.get("/", eventController.index );
routes.post("/create", eventController.createEvent);
routes.get("/:id", eventController.findUniqueEvent);
routes.put("/:id", eventController.updateEvent);
routes.delete("/:id", eventController.deletEvent);

export default routes;
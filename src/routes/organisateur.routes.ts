import { Router } from "express" ;
import { organisateurController } from "../controllers/organisateur.controller"

const routes = Router();

routes.get("/", organisateurController.index );
routes.post("/create", organisateurController.createOrganisateur);
routes.get("/:id", organisateurController.findUniqueOrganisateur);
routes.put("/:id", organisateurController.updateOrganisateur);
routes.delete("/:id", organisateurController.deletOrganisateur);

export default routes;
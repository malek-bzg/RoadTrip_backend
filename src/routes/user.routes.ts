
import { Router } from "express" ;
import { userController } from "../controllers/user.controller"

const routes = Router();


routes.get("/", userController.index );
routes.post("/create", userController.createUser);
routes.get("/:id", userController.findUniqueUser);
routes.put("/:id", userController.updateUser);
//routes.post("/confirmation", userController.confirmation)
//routes.post("/send-confirmation-email", userController.sendConfirmationEmail)
routes.delete("/:id", userController.deletUser);
routes.post("/login", userController.login)

export default routes;
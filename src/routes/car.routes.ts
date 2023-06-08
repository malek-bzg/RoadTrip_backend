import { Router } from "express" ;
import { carController } from "../controllers/car.controller"

const routes = Router();
routes.get("/", carController.index );
routes.post("/create", carController.createCar);
routes.get("/:id", carController.findUniqueCar);
routes.put("/:id", carController.updateCar);
routes.delete("/:id", carController.deletCar);

export default routes;
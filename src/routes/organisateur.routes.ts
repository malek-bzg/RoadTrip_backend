import express, { Router } from "express" ;
import { organisateurController } from "../controllers/organisateur.controller"
import { upload } from "../middlewares/storage";

const router = express.Router();

router.get("/", organisateurController.index );
router.post("/create", organisateurController.createOrganisateur);
router.get("/:id", organisateurController.findUniqueOrganisateur);
router.put("/:id", organisateurController.updateOrganisateur);
router.put("/edit-organisateur-picture/:organisateurId", upload.single('organisateurPicture'), organisateurController.editOrganisateurPicture)
router.delete("/:id", organisateurController.deletOrganisateur);

export default router;
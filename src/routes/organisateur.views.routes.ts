import express from 'express';
import { upload } from '../middlewares/storage';
import { organisateurController } from '../controllers/organisateur.controller';

const router = express.Router();

router.get("/", organisateurController.index)
router.get("/{id}", organisateurController.index)
router.delete("/:id", organisateurController.deletOrganisateur);
router.post("/create", organisateurController.createOrganisateur);
router.get("/create", organisateurController.showCreateOrgaisateurPage);


// Ajoutez d'autres routes pour les utilisateurs si nécessaire

export default router;

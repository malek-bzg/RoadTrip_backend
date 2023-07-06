import express from 'express';
import { carController } from '../controllers/car.controller';
import { upload } from '../middlewares/storage';

const router = express.Router();

router.get("/", carController.index)
router.get("/{id}", carController.index)


// Ajoutez d'autres routes pour les utilisateurs si nécessaire

export default router;

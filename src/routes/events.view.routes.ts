import express from 'express';
import { eventController } from '../controllers/events.controller';

const router = express.Router();

router.get("/", eventController.index)
router.get("/{id}", eventController.index)
router.delete("/:id", eventController.deletEvent);
router.post("/create", eventController.createEvent);
router.get("/create", eventController.showCreateEventPage);


// Ajoutez d'autres routes pour les utilisateurs si nécessaire

export default router;

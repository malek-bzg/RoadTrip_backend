import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { upload } from '../middlewares/storage';

const router = express.Router();

router.get("/", dashboardController.showdashboardPage);

export default router;
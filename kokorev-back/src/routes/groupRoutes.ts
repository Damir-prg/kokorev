import express from 'express';
import { groupController } from '../controllers/groupController';

const router = express.Router();

router.patch('/:id/publish', groupController.togglePublish);

export default router; 
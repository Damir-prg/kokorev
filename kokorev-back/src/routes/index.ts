import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  createGroup,
  groupController,
  getGroupById,
  updateGroup,
  deleteGroup
} from '../controllers/groupController';
import {
  uploadPhotos,
  getPhotosByGroup,
  deletePhoto,
  setPreviewPhoto,
  getAllPreviewPhotos,
  photoController
} from '../controllers/photoController';
import { login } from '../controllers/authController';

const router = express.Router();

// Auth routes
router.post('/auth/login', login);

// Group routes
router.post('/groups', authenticate, isAdmin, createGroup);
router.get('/groups', groupController.getAll);
router.get('/groups/:id', getGroupById);
router.put('/groups/:id', authenticate, isAdmin, updateGroup);
router.delete('/groups/:id', authenticate, isAdmin, deleteGroup);

// Photo routes
router.post('/photos', authenticate, isAdmin, uploadPhotos);
router.get('/photos/group/:groupId', getPhotosByGroup);
router.delete('/photos/:id', authenticate, isAdmin, deletePhoto);
router.put('/photos/:id', authenticate, isAdmin, photoController.update);
router.put('/photos/:photoId/preview', authenticate, isAdmin, setPreviewPhoto);
router.get('/photos/preview', getAllPreviewPhotos);

export default router; 
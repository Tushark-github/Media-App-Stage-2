import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followunfollowUser } from '../controllers/userContoller.js';

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
// router.get('/suggested',protectRoute,getUserProfile);
router.post('/follow/:id', protectRoute, followunfollowUser);
// router.post('/update', protectRoute, updateUserProfile);

export default router;



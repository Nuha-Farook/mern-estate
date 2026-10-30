import express from 'express';
import { google, signin, signup, signOut } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signUp", signup);
router.post("/signin", signin);
router.post("/signIn", signin);
router.post('/google', google);
router.get('/signout', signOut);
router.get('/signOut', signOut);

export default router;
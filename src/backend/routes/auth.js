import express from 'express';
import cookieParser from 'cookie-parser';
import warrantiesRouter from './warranties.js';
import { verifyToken, login, refreshToken, signup } from './auth.functions.js';

const router = express.Router();

// Rute koje ne zahtevaju verifikaciju tokena
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/signup', signup);

// Middleware function to verify JWT token
router.use(verifyToken);

// Dodavanje zasticenih ruta
router.use('/warranties', warrantiesRouter);


// Koriscenje routera
export default router;
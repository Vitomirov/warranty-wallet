import express from 'express';
import cookieParser from 'cookie-parser';
import warrantiesRouter from './warranties.js';
import { verifyToken, login, refreshToken, signup } from './auth.functions.js';

const app = express();

app.use(cookieParser());

const router = express.Router();

// Route to login and provide access and refresh tokens
router.post('/login', login);

// Route to refresh access token using refresh token from cookie
router.post('/refresh-token', refreshToken);

// Route to signup a new user
router.post('/signup', signup);

// Middleware function to verify JWT token
router.use(verifyToken);

// Add protected routes here

app.use(router);

app.use('/warranties', warrantiesRouter);

export default router;
import express from 'express'; // Framework for building web applications
import cors from 'cors'; // Middleware for enabling CORS
import cookieParser from 'cookie-parser'; // Middleware for parsing cookies
import dotenv from 'dotenv'; // For loading environment variables
import authRoutes from './routes/auth.js'; // Authentication routes
import warrantiesRoutes from './routes/warranties.js'; // Warranties management routes
import { dirname } from 'path'; // Utility for directory paths
import { fileURLToPath } from 'url'; // Utility for converting file URLs to paths
import multer from 'multer'; // Middleware for handling file uploads
import path from 'path'; // Utility for handling file and directory paths

const app = express(); // Create an express application

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'], // Allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  exposedHeaders: ['Authorization', 'Set-Cookie'], // Exposed headers to the frontend
  credentials: true, // Allow credentials
  maxAge: 3600 // Cache pre-flight response for 1 hour
}));

// Environment variables setup
const __filename = fileURLToPath(import.meta.url); // Get current file name
const __dirname = dirname(__filename); // Get current directory name
dotenv.config({ path: `${__dirname}/../../.env` }); // Load .env variables

const PORT = process.env.PORT || 3000; // Set the port for the server

app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Upload directory setup
const uploadDirectory = path.join(__dirname, 'uploads'); // Define upload directory
const upload = multer({ dest: uploadDirectory }); // Configure multer for uploads

app.use('/uploads', express.static(uploadDirectory)); // Serve static files from uploads

app.use('/warranties', upload.single('pdfFile'), warrantiesRoutes); // Warranties routes with file upload
app.use('/', authRoutes); // Authentication routes

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server start
});

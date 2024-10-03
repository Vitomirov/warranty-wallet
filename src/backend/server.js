import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'; // Import dotenv for environment variable management
import authRoutes from './routes/auth.js'; // Import authentication routes
import warrantiesRoutes from './routes/warranties.js'; // Import warranties routes
import { dirname } from 'path'; // Import dirname and join
import { fileURLToPath } from 'url'; // Import fileURLToPath

const app = express();
// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173'], // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  credentials: true,
  maxAge: 3600
})); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });
console.log(process.env.SECRET_KEY);

const PORT = process.env.PORT || 3000; // Use port from .env file or default to 3000

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes); // Define routes for authentication
app.use('/warranties', warrantiesRoutes); //// Define routes for warranties

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the port number the server is running on
});

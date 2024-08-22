import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Import dotenv for environment variable management
import authRoutes from './routes/auth.js'; // Import authentication routes
import warrantiesRoutes from './routes/warranties.js'; // Import warranties routes

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Use port from .env file or default to 3001

app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

app.use('/auth', authRoutes); // Define routes for authentication

// Apply token verification middleware only to warranty routes
app.use('/warranties', warrantiesRoutes); // Define routes for warranties

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the port number the server is running on
});

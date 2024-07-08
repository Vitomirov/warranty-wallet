import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import warrantiesRoutes from './routes/warranties.js';
import verifyToken from './routes/auth.js'; // Ovaj red dodan, da koristimo isti middleware

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes); // Dodajte rute za autentifikaciju
app.use('/warranties', verifyToken, warrantiesRoutes); // Dodajte rute za garancije sa zaštitom od verifyToken middleware-a

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

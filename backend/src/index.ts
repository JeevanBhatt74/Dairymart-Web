import express from 'express';
import cors from 'cors';
import { connectDatabase } from './database/mongodb';
import { PORT } from './config';
import authRoutes from "./routes/auth.route";

const app = express();

// Middleware
app.use(cors()); // Allow frontend to call backend
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('DairyMart API is Running');
});

// Start Server
const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();
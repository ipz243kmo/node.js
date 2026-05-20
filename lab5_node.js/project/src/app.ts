import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import recipeRoutes from "./routes/entity";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
        res.status(200).json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            status: 'error',
            database: 'disconnected'
        });
    }
});

app.use("/recipes", recipeRoutes);

app.use(errorHandler);

export default app;
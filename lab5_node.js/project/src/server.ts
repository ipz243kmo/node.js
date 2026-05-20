import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";
import { connectDB, closeDB } from "./config/database";

const PORT = process.env.PORT || 3000;
const breakMyCiPipeline: number = "Це текст, а не число!";

app.get('/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
        res.status(200).json({ status: 'ok', database: 'connected' });
    } else {
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});

const start = async () => {
    console.log("Запуск функції start()...");
    try {
        console.log("Підключення до бази даних...");
        await connectDB();
        console.log("База даних підключена успішно.");

        app.listen(PORT, () => {
            console.log(`Сервер працює на порту: ${PORT}`);
        });
    } catch (err) {
        console.error("КРИТИЧНА ПОМИЛКА ЗАПУСКУ:", err);
        process.exit(1);
    }
};

start();

process.on("SIGTERM", async () => {
    await closeDB();
    process.exit(0);
});

process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});
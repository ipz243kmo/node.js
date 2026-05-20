import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("Помилка: MONGODB_URI не визначено в .env");
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        console.error("Помилка з'єднання з MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB відключено");
    });

    try {

        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Не вдалося підключитися до MongoDB:", error);
        process.exit(1);
    }
};

export const closeDB = async () => {
    await mongoose.connection.close();
    console.log("З'єднання з базою даних закрите");
};
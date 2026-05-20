import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 'error',
            message: 'Помилка валідації даних (Zod)',
            details: err.issues.map(e => ({
                path: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            status: 'error',
            message: `Некоректний формат ідентифікатора: ${err.value}`,
            details: `Очікувався тип ${err.kind} для поля ${err.path}`
        });
    }


    if (err instanceof mongoose.Error.ValidationError) {
        const details = Object.values(err.errors).map((e: any) => ({
            path: e.path,
            message: e.message
        }));

        return res.status(400).json({
            status: 'error',
            message: 'Помилка валідації Mongoose',
            details
        });
    }


    if (err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Документ із такими даними вже існує',
            details: err.keyValue
        });
    }


    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Внутрішня помилка сервера'
    });
};
import { Request, Response, NextFunction } from 'express';

import { getAll, getByIngredient } from "../storage/recipe";


export const getRecipes = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { difficulty, title, sort, page = '1', limit = '10' } = req.query;


        const filters: any = {};
        if (difficulty) {
            filters.difficulty = difficulty;
        }
        if (title) {

            filters.title = { $regex: globalThis.String(title), $options: 'i' };
        }

        const sortOrder = sort
            ? globalThis.String(sort).split(',').join(' ')
            : '-createdAt';

        const currentPage = globalThis.parseInt(globalThis.String(page), 10) || 1;
        const itemsLimit = globalThis.parseInt(globalThis.String(limit), 10) || 10;

        const result = await getAll(
            filters,
            sortOrder,
            currentPage,
            itemsLimit
        );

        res.json(result);
    } catch (error) {
        _next(error);
    }
};


export const getRecipesByIngredient = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { ingredient } = req.params;

        const recipes = await getByIngredient(globalThis.String(ingredient));

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: "Рецепти з таким інгредієнтом не знайдені"
            });
        }

        res.json(recipes);
    } catch (error) {
        _next(error);
    }
};
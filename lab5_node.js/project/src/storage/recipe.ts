import { Recipe, IRecipe } from "../models/recipe.model";

export const getAll = async (filters: any, sort: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [data, total] = await globalThis.Promise.all([
        Recipe.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Recipe.countDocuments(filters)
    ]);


    return {
        data,
        pagination: {
            currentPage: page,
            limit,
            totalItems: total,
            totalPages: globalThis.Math.ceil(total / limit)
        }
    };
};

export const getById = async (id: string) => {
    return await Recipe.findById(id);
};

export const create = async (data: IRecipe) => {
    return await Recipe.create(data);
};


export const update = async (id: string, data: any) => {
    return await Recipe.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
};

export const remove = async (id: string) => {
    return await Recipe.findByIdAndDelete(id);
};


export const getByIngredient = async (ingredient: string) => {
    return await Recipe.find({
        ingredients: { $regex: new globalThis.RegExp(ingredient, 'i') }
    });
};
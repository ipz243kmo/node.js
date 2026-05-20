import { Recipe } from "../schemas/entity.schema";

const storage = new Map<string, Recipe>();

export const getAll = (filters?: {
    difficulty?: string;
    maxTime?: number;
}) => {
    let data = Array.from(storage.values());

    if (filters?.difficulty) {
        data = data.filter(r => r.difficulty === filters.difficulty);
    }


    const maxTime = filters?.maxTime;
    if (maxTime !== undefined) {
        data = data.filter(r => r.cookingTime <= maxTime);
    }

    return data;
};

export const getById = (id: string) => {
    return storage.get(id);
};

export const create = (recipe: Recipe) => {
    storage.set(recipe.id, recipe);
    return recipe;
};

export const update = (id: string, data: Partial<Recipe>) => {
    const existing = storage.get(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...data,
        updatedAt: new Date()
    };

    storage.set(id, updated);
    return updated;
};

export const remove = (id: string) => {
    return storage.delete(id);
};

export const reset = () => {
    storage.clear();
};
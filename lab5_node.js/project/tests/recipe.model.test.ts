import * as db from './setup';
import { Recipe } from '../src/models/recipe.model';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Recipe Model Unit Tests', () => {

    it('має створювати валідний рецепт з дефолтними значеннями', async () => {
        const validRecipe = {
            title: 'Борщ',
            ingredients: ['Буряк', "М'ясо"],
            cookingTime: 90,
            calories: 500
        };
        const savedRecipe = await Recipe.create(validRecipe);
        expect(savedRecipe.difficulty).toBe('medium');
        expect(savedRecipe.isPublished).toBe(false);
    });


    it('має видавати помилку, якщо назва коротша за 3 символи', async () => {
        const shortTitle = { title: 'А', ingredients: ['Тест'], cookingTime: 10, calories: 100 };
        await expect(Recipe.create(shortTitle)).rejects.toThrow();
    });


    it('має коректно працювати віртуальне поле cookingTimeHours', async () => {
        const recipe = new Recipe({ title: 'Суп', ingredients: ['Вода'], cookingTime: 75, calories: 100 });
        expect(recipe.cookingTimeHours).toBe('1 г 15 хв');
    });


    it('має видавати помилку, якщо масив інгредієнтів порожній', async () => {
        const noIngredients = { title: 'Тест', ingredients: [], cookingTime: 10, calories: 100 };
        await expect(Recipe.create(noIngredients)).rejects.toThrow();
    });


    it('має видавати помилку, якщо калорійність занадто висока (>5000)', async () => {
        const fattyRecipe = { title: 'Бекон', ingredients: ['Сало'], cookingTime: 10, calories: 6000 };
        await expect(Recipe.create(fattyRecipe)).rejects.toThrow();
    });


    it('має автоматично додавати поле createdAt при створенні', async () => {
        const recipe = await Recipe.create({ title: 'Тест', ingredients: ['X'], cookingTime: 1, calories: 1 });
        expect(recipe.createdAt).toBeInstanceOf(globalThis.Date);

    });
});
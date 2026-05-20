"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("./setup"));
const recipe_model_1 = require("../src/models/recipe.model");
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
        const savedRecipe = await recipe_model_1.Recipe.create(validRecipe);
        expect(savedRecipe.difficulty).toBe('medium');
        expect(savedRecipe.isPublished).toBe(false);
    });
    it('має видавати помилку, якщо назва коротша за 3 символи', async () => {
        const shortTitle = { title: 'А', ingredients: ['Тест'], cookingTime: 10, calories: 100 };
        await expect(recipe_model_1.Recipe.create(shortTitle)).rejects.toThrow();
    });
    it('має коректно працювати віртуальне поле cookingTimeHours', async () => {
        const recipe = new recipe_model_1.Recipe({ title: 'Суп', ingredients: ['Вода'], cookingTime: 75, calories: 100 });
        expect(recipe.cookingTimeHours).toBe('1 г 15 хв');
    });
    it('має видавати помилку, якщо масив інгредієнтів порожній', async () => {
        const noIngredients = { title: 'Тест', ingredients: [], cookingTime: 10, calories: 100 };
        await expect(recipe_model_1.Recipe.create(noIngredients)).rejects.toThrow();
    });
    it('має видавати помилку, якщо калорійність занадто висока (>5000)', async () => {
        const fattyRecipe = { title: 'Бекон', ingredients: ['Сало'], cookingTime: 10, calories: 6000 };
        await expect(recipe_model_1.Recipe.create(fattyRecipe)).rejects.toThrow();
    });
    it('має автоматично додавати поле createdAt при створенні', async () => {
        const recipe = await recipe_model_1.Recipe.create({ title: 'Тест', ingredients: ['X'], cookingTime: 1, calories: 1 });
        expect(recipe.createdAt).toBeInstanceOf(globalThis.Date);
    });
});

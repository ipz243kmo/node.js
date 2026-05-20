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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
const db = __importStar(require("./setup"));
const recipe_model_1 = require("../src/models/recipe.model");
// Використовуємо явні блоки {}, щоб допомогти IDE розпізнати типи
beforeAll(async () => {
    await db.connect();
});
afterEach(async () => {
    await db.clear();
});
afterAll(async () => {
    await db.close();
});
describe('Recipe API Integration Tests', () => {
    it('GET /api/recipes має повертати результати з пагінацією', async () => {
        await recipe_model_1.Recipe.create({ title: 'Р1', ingredients: ['А'], cookingTime: 10, calories: 100 });
        const res = await (0, supertest_1.default)(app_1.default).get('/api/recipes');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.pagination).toBeDefined();
    });
    it('POST /api/recipes має повертати 400 при некоректних даних', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/recipes').send({ title: '' });
        expect(res.status).toBe(400);
    });
    it('GET /api/recipes/:id має повертати 404 для неіснуючого ObjectId', async () => {
        const id = new mongoose_1.default.Types.ObjectId().toString();
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/recipes/${id}`);
        expect(res.status).toBe(404);
    });
    it('GET /api/recipes/:id має повертати 400 для некоректного формату ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/recipes/wrong-format');
        expect(res.status).toBe(400);
    });
    it('PATCH /api/recipes/:id має оновлювати дані', async () => {
        const recipe = await recipe_model_1.Recipe.create({ title: 'Стара', ingredients: ['А'], cookingTime: 1, calories: 1 });
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/recipes/${recipe._id.toString()}`)
            .send({ title: 'Нова' });
        expect(res.body.title).toBe('Нова');
    });
    it('DELETE /api/recipes/:id має видаляти рецепт', async () => {
        const recipe = await recipe_model_1.Recipe.create({ title: 'Видалити', ingredients: ['А'], cookingTime: 1, calories: 1 });
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/recipes/${recipe._id.toString()}`);
        expect(res.status).toBe(204);
        const check = await recipe_model_1.Recipe.findById(recipe._id);
        expect(check).toBeNull();
    });
    it('GET /api/recipes/ingredient/:ing має знаходити відповідні рецепти', async () => {
        await recipe_model_1.Recipe.create({ title: 'Омлет', ingredients: ['Яйця'], cookingTime: 5, calories: 200 });
        const res = await (0, supertest_1.default)(app_1.default).get('/api/recipes/ingredient/Яйця');
        expect(res.status).toBe(200);
        expect(res.body[0].title).toBe('Омлет');
    });
    it('GET /api/recipes має фільтрувати за складністю (difficulty)', async () => {
        await recipe_model_1.Recipe.create({ title: 'Легкий', difficulty: 'easy', ingredients: ['А'], cookingTime: 1, calories: 1 });
        const res = await (0, supertest_1.default)(app_1.default).get('/api/recipes?difficulty=easy');
        expect(res.body.data[0].difficulty).toBe('easy');
    });
});

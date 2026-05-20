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
const app_1 = __importDefault(require("../src/app"));
const storage = __importStar(require("../src/storage/entity"));
beforeEach(() => {
    storage.reset();
});
describe("Entity Routes", () => {
    it("GET /recipes returns 200", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/recipes");
        expect(res.status).toBe(200);
    });
});
// CREATE
it("POST /recipes -> create recipe", async () => {
    const res = await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("Soup");
});
//  validation
it("POST /recipes -> validation error", async () => {
    const res = await (0, supertest_1.default)(app_1.default).post("/recipes").send({});
    expect(res.status).toBe(400);
});
// GET ALL (empty)
it("GET /recipes -> empty array", async () => {
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
});
// GET ALL (with data)
it("GET /recipes -> returns data", async () => {
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});
// GET by id not found
it("GET /recipes/:id -> 404", async () => {
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes/unknown");
    expect(res.status).toBe(404);
});
// GET by id
it("GET /recipes/:id -> success", async () => {
    const create = await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    const res = await (0, supertest_1.default)(app_1.default).get(`/recipes/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(create.body.id);
});
// UPDATE
it("PATCH /recipes/:id -> update recipe", async () => {
    const create = await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    const res = await (0, supertest_1.default)(app_1.default)
        .patch(`/recipes/${create.body.id}`)
        .send({ title: "Updated Soup" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Soup");
});
// UPDATE not found
it("PATCH /recipes/:id -> 404", async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .patch("/recipes/unknown")
        .send({ title: "Test" });
    expect(res.status).toBe(404);
});
//  DELETE not found
it("DELETE /recipes/:id -> 404", async () => {
    const res = await (0, supertest_1.default)(app_1.default).delete("/recipes/unknown");
    expect(res.status).toBe(404);
});
// DELETE
it("DELETE /recipes/:id -> success", async () => {
    const create = await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    const res = await (0, supertest_1.default)(app_1.default).delete(`/recipes/${create.body.id}`);
    expect(res.status).toBe(204);
});
// FILTER by difficulty
it("GET /recipes?difficulty=easy", async () => {
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Steak",
        cookingTime: 60,
        difficulty: "hard"
    });
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes?difficulty=easy");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});
// FILTER by maxTime
it("GET /recipes?maxTime=30", async () => {
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Quick meal",
        cookingTime: 20,
        difficulty: "easy"
    });
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Slow meal",
        cookingTime: 60,
        difficulty: "medium"
    });
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes?maxTime=30");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});
// COMBINED FILTER
it("GET /recipes?difficulty=easy&maxTime=30", async () => {
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Soup",
        cookingTime: 20,
        difficulty: "easy"
    });
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Hard Soup",
        cookingTime: 20,
        difficulty: "hard"
    });
    const res = await (0, supertest_1.default)(app_1.default)
        .get("/recipes?difficulty=easy&maxTime=30");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});
// CUSTOM ROUTE
it("GET /recipes/quick", async () => {
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Fast",
        cookingTime: 20,
        difficulty: "easy"
    });
    await (0, supertest_1.default)(app_1.default).post("/recipes").send({
        title: "Slow",
        cookingTime: 60,
        difficulty: "easy"
    });
    const res = await (0, supertest_1.default)(app_1.default).get("/recipes/quick");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});

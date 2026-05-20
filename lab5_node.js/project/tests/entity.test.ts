
import request from "supertest";
import app from "../src/app";
import * as storage from "../src/storage/entity";

beforeEach(() => {
    storage.reset();
});

describe("Entity Routes", () => {
    it("GET /recipes returns 200", async () => {
        const res = await request(app).get("/recipes");
        expect(res.status).toBe(200);
    });
});

    it("POST /recipes -> create recipe", async () => {
        const res = await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.title).toBe("Soup");
    });


    it("POST /recipes -> validation error", async () => {
        const res = await request(app).post("/recipes").send({});
        expect(res.status).toBe(400);
    });


    it("GET /recipes -> empty array", async () => {
        const res = await request(app).get("/recipes");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });


    it("GET /recipes -> returns data", async () => {
        await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        const res = await request(app).get("/recipes");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });


    it("GET /recipes/:id -> 404", async () => {
        const res = await request(app).get("/recipes/unknown");
        expect(res.status).toBe(404);
    });


    it("GET /recipes/:id -> success", async () => {
        const create = await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        const res = await request(app).get(`/recipes/${create.body.id}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(create.body.id);
    });


    it("PATCH /recipes/:id -> update recipe", async () => {
        const create = await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        const res = await request(app)
            .patch(`/recipes/${create.body.id}`)
            .send({ title: "Updated Soup" });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Updated Soup");
    });


    it("PATCH /recipes/:id -> 404", async () => {
        const res = await request(app)
            .patch("/recipes/unknown")
            .send({ title: "Test" });

        expect(res.status).toBe(404);
    });


    it("DELETE /recipes/:id -> 404", async () => {
        const res = await request(app).delete("/recipes/unknown");
        expect(res.status).toBe(404);
    });


    it("DELETE /recipes/:id -> success", async () => {
        const create = await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        const res = await request(app).delete(`/recipes/${create.body.id}`);

        expect(res.status).toBe(204);
    });


    it("GET /recipes?difficulty=easy", async () => {
        await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        await request(app).post("/recipes").send({
            title: "Steak",
            cookingTime: 60,
            difficulty: "hard"
        });

        const res = await request(app).get("/recipes?difficulty=easy");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });


    it("GET /recipes?maxTime=30", async () => {
        await request(app).post("/recipes").send({
            title: "Quick meal",
            cookingTime: 20,
            difficulty: "easy"
        });

        await request(app).post("/recipes").send({
            title: "Slow meal",
            cookingTime: 60,
            difficulty: "medium"
        });

        const res = await request(app).get("/recipes?maxTime=30");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });


    it("GET /recipes?difficulty=easy&maxTime=30", async () => {
        await request(app).post("/recipes").send({
            title: "Soup",
            cookingTime: 20,
            difficulty: "easy"
        });

        await request(app).post("/recipes").send({
            title: "Hard Soup",
            cookingTime: 20,
            difficulty: "hard"
        });

        const res = await request(app)
            .get("/recipes?difficulty=easy&maxTime=30");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });

    it("GET /recipes/quick", async () => {
        await request(app).post("/recipes").send({
            title: "Fast",
            cookingTime: 20,
            difficulty: "easy"
        });

        await request(app).post("/recipes").send({
            title: "Slow",
            cookingTime: 60,
            difficulty: "easy"
        });

        const res = await request(app).get("/recipes/quick");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });

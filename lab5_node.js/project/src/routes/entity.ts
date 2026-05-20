import { Router, Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import * as storage from "../storage/entity";
import { validate } from "../middleware/validate";
import { createRecipeSchema, updateRecipeSchema } from "../schemas/entity.schema";

const router = Router();


interface GetAllQuery {
    difficulty?: string | string[];
    maxTime?: string | string[];
}

interface GetAllOptions {
    difficulty?: string;
    maxTime?: number;
}


function toString(q?: string | string[]): string | undefined {
    if (!q) return undefined;
    return Array.isArray(q) ? q[0] : q;
}

function toNumber(q?: string | string[]): number | undefined {
    const str = toString(q);
    if (!str) return undefined;
    const num = Number(str);
    return isNaN(num) ? undefined : num;
}


router.get(
    "/",
    (req: Request<{}, {}, {}, GetAllQuery>, res: Response) => {
        const options: GetAllOptions = {
            difficulty: toString(req.query.difficulty),
            maxTime: toNumber(req.query.maxTime),
        };

        const recipes = storage.getAll(options);
        res.json(recipes);
    }
);

router.get("/quick", (_req: Request, res: Response) => {
    const recipes = storage.getAll({ maxTime: 30 });
    res.json(recipes);
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    const recipe = storage.getById(req.params.id);
    if (!recipe) return res.sendStatus(404);
    res.json(recipe);
});

router.post(
    "/",
    validate(createRecipeSchema),
    (
        req: Request<{}, {}, z.infer<typeof createRecipeSchema>>,
        res: Response
    ) => {
        const now = new Date();
        const recipe = {
            ...req.body,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };
        storage.create(recipe);
        res.status(201).json(recipe);
    }
);


router.patch(
    "/:id",
    validate(updateRecipeSchema),
    (
        req: Request<{ id: string }, {}, z.infer<typeof updateRecipeSchema>>,
        res: Response
    ) => {
        const updated = storage.update(req.params.id, req.body);
        if (!updated) return res.sendStatus(404);
        res.json(updated);
    }
);

router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
    const ok = storage.remove(req.params.id);
    if (!ok) return res.sendStatus(404);
    res.sendStatus(204);
});

export default router;
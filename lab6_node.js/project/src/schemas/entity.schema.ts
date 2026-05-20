import { z } from "zod";

export const createRecipeSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    cookingTime: z.number().min(1).max(1000),
    difficulty: z.enum(["easy", "medium", "hard"]),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type RecipeInput = z.infer<typeof createRecipeSchema>;


export type Recipe = RecipeInput & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};
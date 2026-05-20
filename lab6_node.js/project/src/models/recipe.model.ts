import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe {
    title: string;
    ingredients: string[];
    cookingTime: number;
    calories: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    isPublished?: boolean;
}

export interface IRecipeDocument extends IRecipe, Document {
    createdAt: Date;
    updatedAt: Date;
    cookingTimeHours: string;
}

const recipeSchema = new Schema<IRecipeDocument>({
    title: { type: String, required: true, minlength: 3 },
    ingredients: {
        type: [String],
        validate: {

            validator: (v: string[]): boolean => Array.isArray(v) && v.length > 0,
            message: 'Потрібен хоча б один інгредієнт'
        }
    },
    cookingTime: { type: Number, required: true },
    calories: { type: Number, required: true, max: 5000 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    isPublished: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


recipeSchema.virtual('cookingTimeHours').get(function(this: IRecipeDocument) {
    const hours = Math.floor(this.cookingTime / 60);
    const mins = this.cookingTime % 60;
    return `${hours} г ${mins} хв`;
});

export const Recipe = mongoose.model<IRecipeDocument>('Recipe', recipeSchema);
declare const BASE_RECIPE: {
    pizzas: number;
    ingredients: {
        flour: {
            amount: number;
            unit: string;
            alternativeAmount: number;
            alternativeUnit: string;
        };
        water: {
            amount: number;
            unit: string;
            alternativeAmount: number;
            alternativeUnit: string;
        };
        yeast: {
            amount: number;
            unit: string;
            alternativeAmount: number;
            alternativeUnit: string;
        };
        salt: {
            amount: number;
            unit: string;
            alternativeAmount: number;
            alternativeUnit: string;
        };
    };
};
interface Ingredient {
    amount: number;
    unit: string;
    alternativeAmount?: number;
    alternativeUnit?: string;
}
interface Recipe {
    pizzas: number;
    ingredients: {
        [key: string]: Ingredient;
    };
}
declare const ingredientToggleState: {
    [key: string]: boolean;
};
declare function roundToNearestHalf(value: number): number;
declare function roundToNearest10(value: number): number;
declare function convertTspToTbsp(amount: number): {
    amount: number;
    unit: string;
};
declare function calculateIngredients(targetPizzas: number): Recipe;
declare function formatIngredient(ingredient: Ingredient, ingredientKey: string): string;
declare function toggleIngredient(ingredientKey: string): void;
declare function updateRecipeDisplay(): void;
declare function addIngredientClickHandlers(): void;

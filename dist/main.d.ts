declare const BASE_RECIPE: {
    pizzas: number;
    ingredients: {
        flour: {
            amount: number;
            unit: string;
        };
        water: {
            amount: number;
            unit: string;
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
declare function roundToNearestHalf(value: number): number;
declare function convertTspToTbsp(amount: number): {
    amount: number;
    unit: string;
};
declare function calculateIngredients(targetPizzas: number): Recipe;
declare function formatIngredient(ingredient: Ingredient): string;
declare function updateRecipeDisplay(): void;

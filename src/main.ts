// Base recipe for 6 pizzas
const BASE_RECIPE = {
  pizzas: 6,
  ingredients: {
    flour: { amount: 1000, unit: "g" },
    water: { amount: 7, unit: "dl" },
    yeast: {
      amount: 6,
      unit: "g",
      alternativeAmount: 2.5,
      alternativeUnit: "ml",
    },
    salt: { amount: 5, unit: "tsp" },
  },
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

// Round to nearest 0.5
function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function roundToNearest10(value: number): number {
  return Math.round(value / 10) * 10;
}

// Convert teaspoons to tablespoons if >= 3 tsp
function convertTspToTbsp(amount: number): { amount: number; unit: string } {
  if (amount >= 3) {
    const tbsp = amount / 3;
    return { amount: roundToNearestHalf(tbsp), unit: "tbsp" };
  }
  return { amount: roundToNearestHalf(amount), unit: "tsp" };
}

// Calculate ingredients for desired number of pizzas
function calculateIngredients(targetPizzas: number): Recipe {
  const multiplier = targetPizzas / BASE_RECIPE.pizzas;
  const calculatedIngredients: { [key: string]: Ingredient } = {};

  for (const [key, ingredient] of Object.entries(BASE_RECIPE.ingredients)) {
    const scaledAmount = ingredient.amount * multiplier;

    if (ingredient.unit === "tsp") {
      const converted = convertTspToTbsp(scaledAmount);
      calculatedIngredients[key] = {
        amount: converted.amount,
        unit: converted.unit,
      };
    } else if (ingredient.unit === "g") {
      calculatedIngredients[key] = {
        amount: roundToNearest10(scaledAmount),
        unit: ingredient.unit,
      };
    } else {
      calculatedIngredients[key] = {
        amount: roundToNearestHalf(scaledAmount),
        unit: ingredient.unit,
      };
    }

    // Preserve alternative measurements if they exist
    if (
      "alternativeAmount" in ingredient &&
      "alternativeUnit" in ingredient &&
      ingredient.alternativeAmount !== undefined &&
      ingredient.alternativeUnit !== undefined
    ) {
      calculatedIngredients[key].alternativeAmount = roundToNearestHalf(
        ingredient.alternativeAmount * multiplier
      );
      calculatedIngredients[key].alternativeUnit = ingredient.alternativeUnit;
    }
  }

  return {
    pizzas: targetPizzas,
    ingredients: calculatedIngredients,
  };
}

// Format ingredient display
function formatIngredient(ingredient: Ingredient): string {
  let display = `${ingredient.amount} ${ingredient.unit}`;

  //   if (ingredient.alternativeAmount && ingredient.alternativeUnit) {
  //     display += ` (${ingredient.alternativeAmount} ${ingredient.alternativeUnit})`;
  //   }

  return display;
}

// Update the recipe display
function updateRecipeDisplay(): void {
  const slider = document.getElementById("pizza-slider") as HTMLInputElement;
  const pizzaCount = parseInt(slider.value);

  // Update pizza count display
  const countDisplay = document.getElementById("pizza-count");
  if (countDisplay) {
    countDisplay.textContent = pizzaCount.toString();
  }

  // Calculate new recipe
  const recipe = calculateIngredients(pizzaCount);

  // Update ingredient displays
  const flourDisplay = document.getElementById("flour-amount");
  const waterDisplay = document.getElementById("water-amount");
  const yeastDisplay = document.getElementById("yeast-amount");
  const saltDisplay = document.getElementById("salt-amount");

  if (flourDisplay)
    flourDisplay.textContent = formatIngredient(recipe.ingredients.flour);
  if (waterDisplay)
    waterDisplay.textContent = formatIngredient(recipe.ingredients.water);
  if (yeastDisplay)
    yeastDisplay.textContent = formatIngredient(recipe.ingredients.yeast);
  if (saltDisplay)
    saltDisplay.textContent = formatIngredient(recipe.ingredients.salt);

  // Update pizza count label
  const pizzaCountLabel = document.getElementById("pizza-count-label");
  if (pizzaCountLabel) {
    pizzaCountLabel.textContent = pizzaCount === 1 ? "pizza" : "pizze";
  }
}

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("pizza-slider") as HTMLInputElement;

  if (slider) {
    // Set default value
    slider.value = "6";

    // Add event listener for slider changes
    slider.addEventListener("input", updateRecipeDisplay);

    // Initial display update
    updateRecipeDisplay();
  }
});

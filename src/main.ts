// Base recipe for 6 pizzas
const BASE_RECIPE = {
  pizzas: 6,
  ingredients: {
    flour: {
      amount: 1000,
      unit: "g",
      alternativeAmount: 16.6,
      alternativeUnit: "dl",
    },
    water: {
      amount: 7,
      unit: "dl",
      alternativeAmount: 700,
      alternativeUnit: "g",
    },
    yeast: {
      amount: 6,
      unit: "g",
      alternativeAmount: 2.5,
      alternativeUnit: "ml",
    },
    salt: {
      amount: 5,
      unit: "tsp",
      alternativeAmount: 30,
      alternativeUnit: "g",
    },
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

// Track which ingredients are showing alternative amounts
const ingredientToggleState: { [key: string]: boolean } = {
  flour: false,
  water: false,
  yeast: false,
  salt: false,
};

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
    } else if (scaledAmount > 100) {
      calculatedIngredients[key] = {
        amount: roundToNearest10(scaledAmount),
        unit: ingredient.unit,
      };
    } else if (scaledAmount > 10) {
      calculatedIngredients[key] = {
        amount: Math.round(scaledAmount),
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
      const scaledAltAmount = ingredient.alternativeAmount * multiplier;

      if (ingredient.alternativeUnit === "g") {
        calculatedIngredients[key].alternativeAmount =
          roundToNearest10(scaledAltAmount);
      } else {
        calculatedIngredients[key].alternativeAmount =
          roundToNearestHalf(scaledAltAmount);
      }
      calculatedIngredients[key].alternativeUnit = ingredient.alternativeUnit;
    }
  }

  return {
    pizzas: targetPizzas,
    ingredients: calculatedIngredients,
  };
}

// Format ingredient display based on toggle state
function formatIngredient(
  ingredient: Ingredient,
  ingredientKey: string
): string {
  const showAlternative = ingredientToggleState[ingredientKey];

  if (
    showAlternative &&
    ingredient.alternativeAmount &&
    ingredient.alternativeUnit
  ) {
    return `${ingredient.alternativeAmount} ${ingredient.alternativeUnit}`;
  }

  return `${ingredient.amount} ${ingredient.unit}`;
}

// Toggle ingredient display between main and alternative amounts
function toggleIngredient(ingredientKey: string): void {
  ingredientToggleState[ingredientKey] = !ingredientToggleState[ingredientKey];
  updateRecipeDisplay();
}

// Update the recipe display
function updateRecipeDisplay(): void {
  const slider = document.getElementById("pizza-slider") as HTMLInputElement;
  const pizzaCount = parseInt(slider.value);

  // Update title with pizza count
  const titleDisplay = document.getElementById("title");
  if (titleDisplay) {
    const pizzaText = pizzaCount === 1 ? "PIZZA" : "PIZZE";
    titleDisplay.textContent = `${pizzaCount} ${pizzaText}`;
  }

  // Calculate new recipe
  const recipe = calculateIngredients(pizzaCount);

  // Update ingredient displays
  const flourDisplay = document.getElementById("flour-amount");
  const waterDisplay = document.getElementById("water-amount");
  const yeastDisplay = document.getElementById("yeast-amount");
  const saltDisplay = document.getElementById("salt-amount");

  if (flourDisplay)
    flourDisplay.textContent = formatIngredient(
      recipe.ingredients.flour,
      "flour"
    );
  if (waterDisplay)
    waterDisplay.textContent = formatIngredient(
      recipe.ingredients.water,
      "water"
    );
  if (yeastDisplay)
    yeastDisplay.textContent = formatIngredient(
      recipe.ingredients.yeast,
      "yeast"
    );
  if (saltDisplay)
    saltDisplay.textContent = formatIngredient(recipe.ingredients.salt, "salt");
}

// Add click handlers for ingredient items
function addIngredientClickHandlers(): void {
  const ingredientItems = document.querySelectorAll(".ingredient-item");

  ingredientItems.forEach((item, index) => {
    const ingredientKeys = ["flour", "water", "yeast", "salt"];
    const ingredientKey = ingredientKeys[index];

    item.addEventListener("click", () => {
      toggleIngredient(ingredientKey);
    });

    // Add visual feedback
    item.addEventListener("mouseenter", () => {
      item.classList.add("ingredient-hover");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("ingredient-hover");
    });
  });
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

    // Add click handlers for ingredients
    addIngredientClickHandlers();
  }
});

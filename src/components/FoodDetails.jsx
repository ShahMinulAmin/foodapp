import { useEffect, useState } from "react";
import IngredientList from "./IngredientList";
import styles from "./fooddetails.module.css";

export default function FoodDetails({ foodId }) {
  const URL = `https://api.spoonacular.com/recipes/${foodId}/information`;
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  const [food, setFood] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [foodId]);

  async function fetchRecipe() {
    const res = await fetch(`${URL}?apiKey=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    setFood(data);
    setIsLoading(false);
  }

  return (
    <div>
      <div className={styles.recipeCard}>
        <h1 className={styles.recipeName}>{food.title}</h1>
        <img className={styles.recipeImage} src={food.image} />
        <div className={styles.recipeDetails}>
          <span>
            <strong>⏱️{food.readyInMinutes}</strong>
          </span>
          <span>
            <strong>🧑‍🤝‍🧑 Serves {food.servings}</strong>
          </span>
          <span>
            <strong>
              {food.vegetarian ? "🥕 Vegetarian" : "🍖 Non-vegetarian"}
            </strong>
          </span>
          <span>
            <strong>{food.vegan ? "🥗 Vegan" : ""}</strong>
          </span>
        </div>
        <div>
          <span>
            <strong>$ {food.pricePerServing / 100} Per serving</strong>
          </span>
        </div>

        <h2>Ingredients</h2>
        <IngredientList food={food} isLoading={isLoading} />

        <h2>Instructions</h2>
        <div className={styles.recipeInstructions}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            food.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

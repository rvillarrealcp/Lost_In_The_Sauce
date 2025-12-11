import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipe, deleteRecipe } from "../services/recipeService";

const RecipeDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipe(token, id);
        setRecipe(data);
        setScaleFactor(data.yield_amount);
      } catch (err) {
        setError("Failed to load recipe");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [token, id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(token, id);
      navigate("/recipes");
    } catch (err) {
      setError("Failed to delete recipe");
      console.error(err);
    }
  };

  const scaleQuantity = (quantity) => {
    if (!recipe || !quantity) return quantity;
    const scaled = (quantity * scaleFactor) / recipe.yield_amount;
    return Math.round(scaled * 100) / 100;
  };

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="alert alert-error m-8">{error}</div>;
  if (!recipe)
    return <div className="alert alert-warning m-8">Recipe not found</div>;

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-2-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/recipes" className="btn btn-ghost">
            &larr; Back to Recipes
          </Link>
          <div className="flex gap-2">
            <Link to={`/recipes/${id}/edit`} className="btn btn-outline">
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          {recipe.photo && (
            <figure>
              <img
                src={recipe.photo}
                alt={recipe.title}
                className="w-full h-64 object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>

            <div className="flex gap-6 text-sm text-gray-500 mt-2">
              <span>Yield: {recipe.yield_amount}</span>
              {recipe.prep_time_minutes && (
                <span>Prep: {recipe.prep_time_minutes} min</span>
              )}
              {recipe.cook_time_minutes && (
                <span>Cook: {recipe.cook_time_minutes} min</span>
              )}
            </div>
            {/*Scaling Slider */}
            <div className="form-control mt-6">
              <label className="label">
                <span className="label-text font-semibold">
                  Scale Recipe: {scaleFactor} servings
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(Number(e.target.value))}
                className="range range-primary"
              />
            </div>
            {/* Ingredients */}
            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <ul className="list-disc list-inside space-y-1">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index}>
                      {ing.ingredient_name} - {scaleQuantity(ing.quantity)}{" "}
                      {ing.unit}
                      {ing.prep_note && (
                        <span className="text-gray-500">, {ing.prep_note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Steps */}
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Steps</h2>
                <ol className="space-y-3">
                  {recipe.steps.map((step) => (
                    <li key={step.step_number} className="flex gap-4">
                      <span className="badge badge-primary badge-lg">
                        {step.step_number}
                      </span>
                      <div>
                        <p>{step.description}</p>
                        {step.timer_seconds && (
                          <span className="badge badge-outline mt-1">
                            {" "}
                            {formatTime(step.timer_seconds)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Instructions */}
            {recipe.instructions && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <p className="whitespace-pre-wrap">{recipe.instructions}</p>
              </div>
            )}

            {/* Chef Notes*/}
            {recipe.chef_notes && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Chef Notes</h2>
                <p className="whitespace-pre-wrap italic">
                  {recipe.chef_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail

import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { getPantryItems } from '../services/pantryService';
import { createRecipe } from '../services/recipeService';
import { findRecipesByIngredients, getRecipeDetails, searchClassicRecipes } from "../services/externalService";
import { Package, Search } from 'lucide-react';
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const Wizard = () => {
  const { token } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [classicResults, setClassicResults] = useState([]);
  const [searchingClassic, setSearchingClassic] = useState(false);
  const [classicSearch, setClassicSearch] = useState('');
  const [activeTab, setActiveTab] = useState('pantry');

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const data = await getPantryItems(token);
        setPantryItems(data);
      } catch (err) {
        setError("Failed to load pantry items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPantry();
  }, [token]);

  const toggleIngredient = (ingredientName) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient");
      return;
    }
    setError("");
    setSearching(true);
    try {
      const results = await findRecipesByIngredients(
        token,
        selectedIngredients
      );
      setSearchResults(results);
    } catch (err) {
      setError("Failed to find recipes");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleClassicSearch = async () => {
    if (!classicSearch.trim()) {
      setError('Please enter a search term');
      return;
    }
    setError('');
    setSearchingClassic(true);
    try{
      const results = await searchClassicRecipes(token, classicSearch);
      setClassicResults(results.meals || []);
    } catch (err) {
      setError('Failed to search classic recipes');
      console.error(err)
    }finally{
      setSearchingClassic(false);
    }
  };

  const handleImport = async (spoonacularId) => {
    setImporting(spoonacularId);
    setError("");
    setSuccess("");
    try {
      const details = await getRecipeDetails(token, spoonacularId);
      const recipeData = {
        title: details.title,
        yield_amount: details.servings || 4,
        prep_time_minutes: details.preparationMinutes || null,
        cook_time_minutes:
          details.cookingMinutes || details.readyInMinutes || null,
        instructions: details.instructions || "",
        chef_notes: `Imported from Spoonacular. Source: ${
          details.sourceUrl || "N/A"
        }`,
        ingredients:
          details.extendedIngredients?.map((ing) => ({
            ingredient_name: ing.name,
            quantity: ing.amount || 0,
            unit: ing.unt || "",
            prep_note: ing.original || "",
          })) || [],
        steps:
          details.analyzedInstructions?.[0]?.steps?.map((step) => ({
            step_number: step.number,
            description: step.step,
            timer_seconds: null,
          })) || {},
      };

      console.log('Recipe data to import:', recipeData)

      await createRecipe(token, recipeData);
      setSuccess(`"${details.title}" imported successfully!`);
    } catch (err) {
        console.error('Import error:', error.response?.data)
      setError("Failed to import recipe");
      console.error(err);
    } finally {
      setImporting(null);
    }
  };

  const handleImportClassic = async (meal) => {
    setImporting(meal.idMeal);
    setError('');
    setSuccess('');
    try{
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`]
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            ingredient_name: ingredient.trim(),
            quantity:0,
            unit: measure?.trim() || 'to taste',
            prep_note: ''
          });
        }
      }
      const instructionText = meal.strInstructions || '';
      const stepTexts = instructionText.split(/\r\n|\r|\n/).filter(s => s.trim());
      const steps = stepTexts.map((text, index) => ({
        step_number: index +1,
        description: text.trim(),
        timer_seconds: null
      }));
      const recipeData ={
        title: meal.strMeal,
        yield_amount: 4,
        prep_time_minutes: null,
        cook_time_minutes: null,
        instructions: meal.strInstructions || '',
        chef_notes: `Imported from TheMealDB. Category: ${meal.strCategory || 'N/A'}. Origin: ${meal.strArea || 'N/A'}`,
        ingredients,
        steps
      };

      await createRecipe(token, recipeData);
      setSuccess(`"${meal.strMeal}" imported successfully!`);
    }catch(err){
      setError('Failed to import recipe: ' + JSON.stringify(err.response?.data));
      console.error(err);
    } finally{
      setImporting(null)
    }
  };

  const filteredPantry = pantryItems.filter((item) =>
    item.ingredient_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />
  
    return (
      <div className="min-h-screen bg-base-200 p-8">
        <h1 className="text-3xl font-bold mb-8">Zero-Waste Wizard</h1>

        <ErrorAlert message={error} />
        {success && <div className="alert alert-success mb-4">{success}</div>}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`btn btn-lg ${
              activeTab === "pantry" ? "btn-primary" : "btn-outline btn-primary"
            }`}
            onClick={() => setActiveTab("pantry")}
          >
            <Package size={20} /> Use My Pantry
          </button>
          <button
            className={`btn btn-lg ${
              activeTab === "classic"
                ? "btn-primary"
                : "btn-outline btn-primary"
            }`}
            onClick={() => setActiveTab("classic")}
          >
            <Search size={20} /> Search Classic Recipes
          </button>
        </div>

        {activeTab === "pantry" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Pantry Selection */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Select Ingredients</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose ingredients from your pantry to find matching recipes.
                </p>

                <input
                  type="text"
                  placeholder="Search pantry..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered w-full mb-4"
                />

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredPantry.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedIngredients.includes(
                          item.ingredient_name
                        )}
                        onChange={() => toggleIngredient(item.ingredient_name)}
                      />
                      <span>{item.ingredient_name}</span>
                      <span className="text-sm text-gray-500">
                        ({item.quantity} {item.unit})
                      </span>
                    </label>
                  ))}
                </div>

                {filteredPantry.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No pantry items found.
                  </p>
                )}

                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-sm">
                    {selectedIngredients.length} selected
                  </span>
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary"
                    disabled={searching || selectedIngredients.length === 0}
                  >
                    {searching ? "Searching..." : "Find Recipes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Recipe Results */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Recipe Suggestions</h2>

                {searchResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Select ingredients and click "Find Recipes" to see
                    suggestions.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {searchResults.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="flex gap-4 p-4 bg-base-200 rounded-lg"
                      >
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{recipe.title}</h3>
                          <p className="text-sm text-gray-500">
                            Uses {recipe.usedIngredientCount} of your
                            ingredients
                          </p>
                          {recipe.missedIngredientCount > 0 && (
                            <p className="text-sm text-warning">
                              Missing {recipe.missedIngredientCount} ingredients
                            </p>
                          )}
                          <button
                            onClick={() => handleImport(recipe.id)}
                            className="btn btn-sm btn-primary mt-2"
                            disabled={importing === recipe.id}
                          >
                            {importing === recipe.id
                              ? "Importing..."
                              : "Import Recipe"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "classic" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Search */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Search Classic Recipes</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Search TheMealDB for classic recipes from around the world.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search recipes (e.g., pasta, curry, chicken)..."
                    value={classicSearch}
                    onChange={(e) => setClassicSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleClassicSearch()
                    }
                    className="input input-bordered flex-1"
                  />
                  <button
                    onClick={handleClassicSearch}
                    className="btn btn-primary"
                    disabled={searchingClassic}
                  >
                    {searchingClassic ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Classic Recipes</h2>

                {classicResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Search for classic recipes to see results.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {classicResults.map((meal) => (
                      <div
                        key={meal.idMeal}
                        className="flex gap-4 p-4 bg-base-200 rounded-lg"
                      >
                        {meal.strMealThumb && (
                          <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{meal.strMeal}</h3>
                          <p className="text-sm text-gray-500">
                            {meal.strCategory} • {meal.strArea}
                          </p>
                          <button
                            onClick={() => handleImportClassic(meal)}
                            className="btn btn-sm btn-primary mt-2"
                            disabled={importing === meal.idMeal}
                          >
                            {importing === meal.idMeal
                              ? "Importing..."
                              : "Import Recipe"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Wizard;
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipes, deleteRecipe} from '../services/recipeService';
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const Recipes  = () => {
    const {token} = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try{
                const data = await getRecipes(token);
                setRecipes(data);
            }catch(err){
                setError('Failed to load recipes');
                console.error(err);
            } finally{
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [token]);

    const handleDelete = async (id) => {
        if(!window.confirm('Are you sure you want to delete this recipe?')) return;
        try{
            await deleteRecipe(token, id);
            setRecipes(recipes.filter(recipe => recipe.id !== id));
        } catch(err){
            setError('Failed to delete recipe');
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner />

    return (
      <div className="min-h-screen bg-base-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <Link to="/recipes/new" className="btn btn-primary">
            Add New Recipe
          </Link>
        </div>

        <ErrorAlert message={error} />

        {recipes.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No recipes yet!</h2>
              <p>Start building your collection by adding your first recipe</p>
              <Link to="/recipes/new" className="btn btn-primary mt-4">
                Add Recipe
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="card bg-base-100 shadow-xl">
                {recipe.photo && (
                  <figure>
                    <mig
                      src={recipe.photo}
                      alt={recipe.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{recipe.title}</h2>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Yield: {recipe.yield_amount}</span>
                    {recipe.prep_time_minutes && (
                      <span>Prep:{recipe.prep_time_minutes}m</span>
                    )}
                    {recipe.cook_time_minutes && (
                      <span>Cook: {recipe.cook_time_minutes}m</span>
                    )}
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View
                    </Link>
                    <Link
                      to={`/recipes/${recipe.id}/edit`}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

export default Recipes;
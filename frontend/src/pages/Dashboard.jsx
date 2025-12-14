import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import { getRecipes } from "../services/recipeService";
import { getPantryItems } from "../services/pantryService";

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    recipes: 0,
    pantryItems: 0,
    expiringSoon: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const recipes = await getRecipes(token);
        const pantryItems = await getPantryItems(token);

        const today = new Date();
        const expiringSoon = pantryItems.filter((item) => {
          if (!item.expires_on) return false;
          const expDate = new Date(item.expires_on);
          const daysUntil = Math.ceil(
            (expDate - today) / (1000 * 60 * 60 * 24)
          );
          return daysUntil <= 7;
        });

        setStats({
          recipes: recipes.length,
          pantryItems: pantryItems.length,
          expiringSoon,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
    navigate("/login");
  };

  const getExpirationLabel = (expiresOn) => {
    const today = new Date();
    const expDate = new Date(expiresOn);
    const daysUntil = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { text: "Expired", class: "badge-error" };
    if (daysUntil === 0) return { text: "Today", class: "badge-error" };
    if (daysUntil === 1) return { text: "Tomorrow", class: "badge-warning" };
    return { text: `${daysUntil} days`, class: "badge-warning" };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline">
          Logout
        </button>
      </div>

      <p className="text-xl mb-8">Welcome, {user?.username}!</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/recipes"
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title">Total Recipes</h2>
            <p className="text-4xl font-bold">{stats.recipes}</p>
          </div>
        </Link>
        <Link
          to="/pantry"
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title">Pantry Items</h2>
            <p className="text-4xl font-bold">{stats.pantryItems}</p>
          </div>
        </Link>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Expiring Soon</h2>
            <p className="text-4xl font-bold">{stats.expiringSoon.length}</p>
          </div>
        </div>
      </div>

      {/* Expiring Soon Alerts */}
      {stats.expiringSoon.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-warning">⚠️ Expiring Soon</h2>
            <ul className="space-y-2">
              {stats.expiringSoon.map((item) => {
                const label = getExpirationLabel(item.expires_on);
                return (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.ingredient_name} ({item.quantity} {item.unit})
                    </span>
                    <span className={`badge ${label.class}`}>{label.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">What's for Dinner?</h2>
          <p>Use your pantry ingredients to find recipe ideas.</p>
          <div className="card-actions justify-end mt-4">
            <Link to="/wizard" className="btn btn-primary">
              Go to Zero-Waste Wizard
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <Link to="/recipes" className="btn btn-outline">
          My Recipes
        </Link>
        <Link to="/pantry" className="btn btn-outline">
          My Pantry
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

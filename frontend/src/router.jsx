import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";
import Pantry from "./pages/Pantry";
import Wizard from "./pages/Wizard";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/recipes/new",
        element: <RecipeForm />,
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetail />,
      },
      {
        path: "/recipes/:id/edit",
        element: <RecipeForm />,
      },
      {
        path: "/pantry",
        element: <Pantry />,
      },
      {
        path: "/wizard",
        element: <Wizard />,
      },
    ],
  },
]);

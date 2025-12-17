from django.urls import path
from .views import (
    RecipeListCreateView,
    RecipeDetailView,
    PantryListCreateView,
    PantryDetailView,
    FindRecipesByIngredientsView,
    GetRecipeDetailsView,
    SearchClassicRecipesView,
)

urlpatterns = [
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('pantry/', PantryListCreateView.as_view(), name='pantry-list'),
    path('pantry/<int:pk>/', PantryDetailView.as_view(), name='pantry-detail'),
    path('external/find-recipes/', FindRecipesByIngredientsView.as_view(), name='find-recipes'),
    path('external/recipe/<int:recipe_id>/', GetRecipeDetailsView.as_view(), name='recipe-details'),
    path('external/search-classic/', SearchClassicRecipesView.as_view(), name='search-classic'),
]
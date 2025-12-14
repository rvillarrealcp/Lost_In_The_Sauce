from django.urls import path
from .views import(
    RecipeListCreateView,
    RecipeDetailView,
    PantryListCreateView,
    PantryDetailView,
    find_recipes_by_ingredients,
    get_recipe_details
)

urlpatterns=[
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('pantry/', PantryListCreateView.as_view(), name='pantry-list'),
    path('pantry/<int:pk>/', PantryDetailView.as_view(), name='pantry-detail'),
    path('external/find-recipes/', find_recipes_by_ingredients, name='find-recipes'),
    path('external/recipe/<int:recipe_id>/', get_recipe_details, name='recipe-details'),
]
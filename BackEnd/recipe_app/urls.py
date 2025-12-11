from django.urls import path
from .views import(
    RecipeListCreateView,
    RecipeDetailView,
    PantryListCreateView,
    PantryDetailView
)

urlpatterns=[
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('pantry/', PantryListCreateView.as_view(), name='pantry-list'),
    path('pantry/<int:pk>/', PantryDetailView.as_view(), name='pantry-detail')
]
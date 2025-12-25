from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import requests
from django.conf import settings

from .models import Recipe, PantryItem
from .serializers import (
    RecipeListSerializer,
    RecipeDetailSerializer,
    RecipeCreateUpdateSerializer,
    PantryItemSerializer
)


class RecipeListCreateView(generics.ListCreateAPIView):
    """
    GET: List all recipes for the logged-in user
    POST: Create a new recipe
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecipeCreateUpdateSerializer
        return RecipeListSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single recipe with full details
    PUT/PATCH: Update a recipe
    DELETE: Delete a recipe    
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RecipeCreateUpdateSerializer
        return RecipeDetailSerializer


class PantryListCreateView(generics.ListCreateAPIView):
    """
    GET: List all pantry items for the user
    POST: Create a new pantry item
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PantryItemSerializer

    def get_queryset(self):
        return PantryItem.objects.filter(user=self.request.user).order_by('ingredient_name')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PantryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single pantry item
    PUT/PATCH: Update a pantry item
    DELETE: Delete a pantry item
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PantryItemSerializer

    def get_queryset(self):
        return PantryItem.objects.filter(user=self.request.user)


class FindRecipesByIngredientsView(APIView):
    """Proxy to Spoonacular findByIngredients endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ingredients = request.data.get('ingredients', [])
        
        if not ingredients:
            return Response(
                {'error': 'No ingredients provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ingredients_str = ','.join(ingredients)
        api_key = settings.SPOONACULAR_API_KEY

        url = 'https://api.spoonacular.com/recipes/findByIngredients'
        params = {
            'ingredients': ingredients_str,
            'number': 10,
            'ranking': 1,
            'ignorePantry': True,
            'apiKey': api_key
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return Response(response.json())
        except requests.RequestException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetRecipeDetailsView(APIView):
    """Proxy to Spoonacular get recipe information endpoint"""
    permission_classes = [IsAuthenticated]

    def get(self, request, recipe_id):
        api_key = settings.SPOONACULAR_API_KEY

        url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
        params = {'apiKey': api_key}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return Response(response.json())
        except requests.RequestException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchClassicRecipesView(APIView):
    """Proxy to TheMealDB search endpoint"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query:
            return Response(
                {'error': 'No search query provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = settings.THEMEALDB_API_KEY
        url = f'https://www.themealdb.com/api/json/v2/{api_key}/search.php'
        params = {'s': query}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return Response(response.json())
        except requests.RequestException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
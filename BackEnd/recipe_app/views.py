from rest_framework import generics, permissions
from .models import Recipe, PantryItem
from .serializers import (
    RecipeListSerializer,
    RecipeDetailSerializer,
    RecipeCreateUpdateSerializer,
    PantryItemSerializer
)
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class RecipeListCreateView(generics.ListCreateAPIView):
    """
    GET: List all recipes for the logged-in user
    POST: Create a new recipe
    """
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecipeCreateUpdateSerializer
        return RecipeListSerializer
    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single recipe with full details
    PUT: Update a recipe
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
    GET: List all pantry items for the user (if logged in)
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
    PUT: Update a pantry item
    DELETE: Delete a pantry item
    """

    permission_classes=[permissions.IsAuthenticated]
    serializer_class = PantryItemSerializer

    def get_queryset(self):
        return PantryItem.objects.filter(user=self.request.user)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def find_recipes_by_ingredients(request):
    """Proxy to Spponacular findByIngredients endpoint"""
    # print("Request data:", request.data)
    ingredients = request.data.get('ingredients', [])
    # print("Ingredients:", ingredients)
    if not ingredients:
        return Response({'error': 'No ingredients provided'}, status = 400)
    ingredients_str= ','.join(ingredients)
    api_key = settings.SPOONACULAR_API_KEY

    url = f'https://api.spoonacular.com/recipes/findByIngredients'
    params = {
        'ingredients': ingredients_str,
        'number': 10,
        'ranking': 1,
        'ignorePantry': True,
        'apiKey': api_key
    }

    try:
        response = requests.get(url, params=params)
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e)}, status = 500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recipe_details(request, recipe_id):
    """Proxy to Spoonacular get recipe information endpoint"""
    api_key = settings.SPOONACULAR_API_KEY

    url= f'https://api.spoonacular.com/recipes/{recipe_id}/information'
    params = {'apiKey': api_key}

    try:
        response = requests.get(url, params=params)
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e)}, status=500)

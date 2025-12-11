from rest_framework import generics, permissions
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
    

    

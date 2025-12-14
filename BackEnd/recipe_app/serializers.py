from rest_framework import serializers
from .models import Recipe, RecipeIngredient, RecipeStep, PantryItem

class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient_name', 'quantity', 'unit', 'prep_note']
        extra_kwargs = {
            'unit': {'allow_blank': True}
        }

class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ['id', 'step_number', 'description', 'timer_seconds']

class RecipeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'yield_amount', 'prep_time_minutes', 'cook_time_minutes', 'photo', 'created_at']

class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'yield_amount', 'prep_time_minutes', 'cook_time_minutes', 'instructions', 'chef_notes', 'photo', 'ingredients', 'steps', 'created_at']

class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, required=False)
    steps = RecipeStepSerializer(many=True, required=False)

    class Meta:
        model= Recipe
        fields=['id', 'title', 'yield_amount', 'prep_time_minutes', 'cook_time_minutes', 'instructions', 'chef_notes', 'photo', 'ingredients', 'steps']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients',[])
        steps_data = validated_data.pop('steps', [])
        recipe = Recipe.objects.create(**validated_data)

        for ingredient in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **ingredient)

        for step in steps_data:
            RecipeStep.objects.create(recipe=recipe, **step)

        return recipe
    
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        steps_data = validated_data.pop('steps', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save

        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient in ingredients_data:
                RecipeIngredient.objects.create(recipe=instance, **ingredient)

        if steps_data is not None:
            instance.steps.all().delete()
            for step in steps_data:
                RecipeStep.objects.create(recipe=instance, **step)
        return instance
    
class PantryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PantryItem
        fields = ['id', 'ingredient_name', 'quantity', 'unit', 'storage_location', 'expires_on', 'created_at']
        read_only_fields = ['id', 'created_at'] 
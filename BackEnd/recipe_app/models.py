from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Recipe(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    title=models.CharField(max_length=200)
    yield_amount=models.IntegerField(default=4)
    prep_time_minutes=models.IntegerField(null=True, blank=True)
    cook_time_minutes=models.IntegerField(null=True, blank=True)
    instructions=models.TextField(blank=True)
    chef_notes = models.TextField(blank=True)
    photo = models.ImageField(upload_to='recipes/', null=True, blank=True)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class RecipeIngredient(models.Model):
    recipe=models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient_name=models.CharField(max_length=100)
    quantity=models.DecimalField(max_digits=8, decimal_places=2)
    unit=models.CharField(max_length=20)
    prep_note=models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f'{self.quantity} {self.unit} {self.ingredient_name}'
    
class RecipeStep(models.Model):
    recipe=models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number=models.IntegerField()
    description=models.TextField()
    timer_seconds=models.IntegerField(null=True, blank=True)

    class Meta:
        ordering=['step_number']

    def __str__(self):
        return f'Step {self.step_number}: {self.description[:50]}'
    
class PantryItem(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='pantry_items')
    ingredient_name=models.CharField(max_length=100)
    quantity=models.DecimalField(max_digits=8, decimal_places=2)
    unit=models.CharField(max_length=20)
    storage_location=models.CharField(max_length=50, blank=True)
    expires_on=models.DateField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.ingredient_name} ({self.quantity} {self.unit})'
    
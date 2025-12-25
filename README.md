# 🍝 Lost in the Sauce

A full-stack recipe management and pantry tracking application designed for professional chefs and home cooks alike. Reduce food waste, discover new recipes, and manage your kitchen inventory all in one place.

![Dark Theme Kitchen App](./frontend/public/lits-logo.png)  

## 🎯 Problem Statement

Home cooks and professional chefs often have ingredients sitting in their pantry approaching expiration, with no clear idea of what to make. Lost in the Sauce solves this by:

- Tracking pantry inventory with expiration alerts
- Suggesting recipes based on ingredients you already have
- Importing recipes from external APIs
- Managing your personal recipe collection

## ✨ Features

### Core Features
- **User Authentication** - Secure registration, login, and logout with token-based authentication
- **Recipe Management** - Full CRUD operations for personal recipes with ingredients and steps
- **Pantry Tracking** - Track inventory with expiration dates and alerts
- **Recipe Scaling** - Dynamically adjust ingredient quantities based on servings

### Zero-Waste Wizard
- **Spoonacular Integration** - Find recipes based on your pantry ingredients
- **TheMealDB Integration** - Search and import classic recipes from around the world
- **One-Click Import** - Save external recipes directly to your collection

### Dashboard
- Recipe and pantry statistics
- Expiring soon alerts (items expiring within 7 days)
- Quick navigation to key features

## 🛠️ Tech Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - RESTful API development
- **PostgreSQL** - Database
- **dj-rest-auth** - Authentication endpoints

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **DaisyUI** - Component library
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Client-side routing

### External APIs
- **Spoonacular API** - Recipe search by ingredients
- **TheMealDB API** - Classic recipe database

## 📁 Project Structure

```
Personal_Project/
├── BackEnd/
│   ├── lost_in_the_sauce/     # Django project settings
│   ├── recipe_app/            # Main application
│   │   ├── models.py          # Recipe, RecipeIngredient, RecipeStep, PantryItem
│   │   ├── serializers.py     # DRF serializers with nested support
│   │   ├── views.py           # API views (class-based)
│   │   └── urls.py            # API routes
│   ├── .env                   # Environment variables
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ErrorAlert.jsx
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Recipes.jsx
    │   │   ├── RecipeDetail.jsx
    │   │   ├── RecipeForm.jsx
    │   │   ├── Pantry.jsx
    │   │   ├── Wizard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/          # API service functions
    │   ├── context/           # React context (Auth)
    │   ├── utils/             # Utility functions
    │   └── router.jsx         # Route configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/lost-in-the-sauce.git
cd lost-in-the-sauce/BackEnd
```

2. Create virtual environment
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create `.env` file
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/lits_db
SPOONACULAR_API_KEY=your-spoonacular-key
THEMEALDB_API_KEY=your-themealdb-key
```

5. Run migrations
```bash
python manage.py migrate
```

6. Start the server
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to frontend
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open http://localhost:5173

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/registration/` | Register new user |
| POST | `/api/auth/login/` | Login, returns token |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/user/` | Get current user |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes/` | List user's recipes |
| POST | `/api/recipes/` | Create recipe |
| GET | `/api/recipes/:id/` | Get recipe details |
| PUT | `/api/recipes/:id/` | Update recipe |
| DELETE | `/api/recipes/:id/` | Delete recipe |

### Pantry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pantry/` | List pantry items |
| POST | `/api/pantry/` | Create pantry item |
| GET | `/api/pantry/:id/` | Get pantry item |
| PUT | `/api/pantry/:id/` | Update pantry item |
| DELETE | `/api/pantry/:id/` | Delete pantry item |

### External APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/external/find-recipes/` | Search Spoonacular by ingredients |
| GET | `/api/external/recipe/:id/` | Get Spoonacular recipe details |
| GET | `/api/external/search-classic/` | Search TheMealDB |

## 🗄️ Database Schema

### Recipe
- `id` - Primary key
- `user` - Foreign key to User
- `title` - Recipe name
- `yield_amount` - Number of servings
- `prep_time_minutes` - Preparation time
- `cook_time_minutes` - Cooking time
- `instructions` - Cooking instructions
- `chef_notes` - Additional notes
- `photo` - Image URL
- `created_at` - Timestamp

### RecipeIngredient
- `id` - Primary key
- `recipe` - Foreign key to Recipe
- `ingredient_name` - Name of ingredient
- `quantity` - Amount needed
- `unit` - Unit of measurement
- `prep_note` - Preparation notes

### RecipeStep
- `id` - Primary key
- `recipe` - Foreign key to Recipe
- `step_number` - Order of step
- `description` - Step instructions
- `timer_seconds` - Optional timer

### PantryItem
- `id` - Primary key
- `user` - Foreign key to User
- `ingredient_name` - Name of ingredient
- `quantity` - Amount on hand
- `unit` - Unit of measurement
- `storage_location` - Where it's stored
- `expires_on` - Expiration date

## 🔮 Future Enhancements

- **Barcode Scanner** - Quick pantry inventory by scanning groceries
- **Coupon API Integration** - Find coupons for recipe ingredients
- **Meal Planning Calendar** - Schedule recipes for the week
- **Shopping List Generation** - Auto-generate lists from missing ingredients
- **Recipe Photo Uploads** - Cloud storage for recipe images

## 👨‍💻 Author

**Tony Villarreal**
- Code Platoon Full-Stack Development Bootcamp
- [GitHub](https://github.com/yourusername)
- [LinkedIn](https://linkedin.com/in/yourprofile)


## 🙏 Acknowledgments

- [Spoonacular API](https://spoonacular.com/food-api) for recipe data
- [TheMealDB](https://www.themealdb.com/) for classic recipes
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Lucide](https://lucide.dev/) for icons
- Code Platoon instructors and staff
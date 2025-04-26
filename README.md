# TravelMate

TravelMate is an AI-enhanced travel planning web application that simplifies trip organization by combining a modern React frontend with a robust Django backend. The application allows users to:

- **Sign up and log in** (with an option to choose between "Casual Traveler" and "Business Traveler").
- **Create and manage trips** (including destination, travel dates, activities, and packing lists).
- **View weather forecasts and clothing recommendations** based on the destination and traveler type.
- **Search for cities** with autocomplete to ensure valid destinations for weather data.
- **View key features and user stories** that showcase the app's benefits.
- **Interact with a responsive, modern user interface** powered by Material UI.

## Project Structure

The project is divided into two main parts:

### 1. Django Backend
- **Location:** Project root
- **Key Folders/Files:**
  - `manage.py`: Django management script.
  - `travelmate/`: Main Django project directory (contains `settings.py`, `urls.py`, `asgi.py`, and `wsgi.py`).
  - `trips/`: Django app containing models, views, serializers, and URL configurations.
    - `trips/services/`: Contains service modules for weather forecasting and geocoding.
    - `trips/templates/`: HTML templates for web views.
  - `requirements.txt`: List of Python dependencies.

### 2. React Frontend
- **Location:** `/travelmate-frontend/`
- **Key Folders/Files:**
  - `src/`: Contains the React source code.
    - `components/`: React components for UI elements.
    - `services/api.js`: Axios configuration for API calls.
  - `package.json`: NPM configuration file with React dependencies.

## Features

### Weather Forecast and Recommendations
- View detailed weather forecasts for trip destinations
- Get personalized clothing recommendations based on traveler type:
  - Casual travelers receive general clothing suggestions
  - Business travelers receive formal clothing recommendations
- Extended forecasts beyond the standard API limit (up to 16 days)
- Temperatures in Fahrenheit with color-coded display

### City Search
- Autocomplete city search using Open-Meteo geocoding API
- Ensures valid destinations with accurate coordinates
- Displays cities with their country and administrative region

## Setup and Running Instructions

### Prerequisites
- Python 3.8+ and pip
- Node.js 16+ and npm

### Step 1: Clone the Repository
```bash
git clone <github repo link>
```

### Step 2: Set Up the Django Backend

1. **(OPTIONAL) Create and activate a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Apply database migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Start the Django development server:**
```bash
python manage.py runserver
```
This will start the backend server at http://127.0.0.1:8000/

### Step 3: Set Up the React Frontend

1. **Navigate to the frontend directory:**
```bash
cd travelmate-frontend
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Start the React development server:**
```bash
npm start
```
This will start the frontend server at http://localhost:3000/

### Step 4: Using the Application

1. **Sign up for an account:**
   - Choose between "Casual Traveler" or "Business Traveler" account type
   - Log in with your credentials

2. **Create a trip:**
   - Click "Create a New Trip" from the dashboard
   - Search for and select a destination city (uses autocomplete)
   - Enter travel dates and other details
   - Submit the form

3. **View weather forecast:**
   - From the dashboard, select a trip
   - Click the "Weather" button on a trip card
   - View the weather forecast and clothing recommendations
   - Toggle between "Trip Days Only" and "All Available Days"

## API Endpoints

### Authentication
- `POST /token/`: Get JWT token for authentication

### Trip Management
- `GET/POST /api/trips/`: List/create trips
- `GET/PUT/DELETE /api/trips/<id>/`: Retrieve/update/delete a trip

### Weather API
- `GET /api/trips/<id>/weather/`: Get weather forecast for a trip
- `GET /api/trips/<id>/clothing-recommendations/`: Get clothing recommendations

### City Search
- `GET /api/cities/search/?q=<query>`: Search for cities

## Technology Stack

### Backend
- Django 5.2
- Django REST Framework
- JWT Authentication
- Open-Meteo APIs (Weather and Geocoding)

### Frontend
- React 19
- Material UI 7
- React Router
- Axios for API calls

## Weather Prediction Details

The application uses the Open-Meteo API for weather data, which provides:
- Current weather conditions
- Up to 16 days of forecast data
- Temperature in Fahrenheit
- Precipitation probability

For trips longer than 16 days, the application extends the forecast using:
- Statistical analysis of available weather data
- Pattern-based prediction with appropriate randomness
- Clear indication of predicted vs. API-provided data

## Notes

- Both servers (Django and React) need to be running simultaneously
- The backend runs on port 8000 and the frontend on port 3000
- Make sure to use the city search feature to ensure accurate weather data

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Django settings
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database settings (if using PostgreSQL)
DB_NAME=travelmate
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# API Keys (if using additional services)
OPENWEATHER_API_KEY=your-api-key  # Optional: for additional weather data
```

### Troubleshooting

Common issues and solutions:

1. **Database Migration Errors**
   ```bash
   python manage.py makemigrations
   python manage.py migrate --run-syncdb
   ```

2. **Node.js Dependencies Issues**
   ```bash
   cd travelmate-frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS Issues**
   - Ensure both servers are running
   - Check that the frontend is making requests to the correct backend URL
   - Verify CORS settings in Django settings.py

4. **Weather API Issues**
   - Verify your internet connection
   - Check if the Open-Meteo API is accessible
   - Ensure the city coordinates are valid

## Contributing

We welcome contributions to TravelMate! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Use ESLint and Prettier for JavaScript/React code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

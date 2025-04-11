# TravelMate

TravelMate is an AI-enhanced travel planning web application that simplifies trip organization by combining a modern React frontend with a robust Django backend. The application allows users to:

- **Sign up and log in** (with an option to choose between “Casual Traveler” and “Business Traveler”).
- **Create and manage trips** (including destination, travel dates, activities, and packing lists).
- **View key features and user stories** that showcase the app's benefits.
- **Interact with a responsive, modern user interface** powered by Material UI.

## Project Structure

The project is divided into two main parts:

### 1. Django Backend
- **Location:** `/travelmate-backend/` (project root)
- **Key Folders/Files:**
  - `manage.py`: Django management script.
  - `travelmate/`: Main Django project directory (contains `settings.py`, `urls.py`, `asgi.py`, and `wsgi.py`).
  - `trips/`: Django app containing models (Trip, KeyFeature, UserStory, Profile), views (API endpoints and page views), serializers, migrations, and URL configurations.
  - `requirements.txt`: (Optional) List of Python dependencies.

### 2. React Frontend
- **Location:** `/travelmate-frontend/`
- **Key Folders/Files:**
  - `src/`: Contains the React source code.
    - `components/`: React components such as `Navbar.js`, `TripDashboard.js`, `TripCard.js`, `TripDetails.js`, `Login.js`, and `Signup.js`.
    - `services/api.js`: Axios configuration file for connecting with the Django backend.
  - `package.json`: NPM configuration file with React dependencies (e.g., Material UI, React Router, Axios).

## Setup Instructions

### Django Backend Setup

1. **Clone the Repository and Navigate to the Project Root:**
   ```bash
   cd /path/to/TravelMate
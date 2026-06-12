# 🌱 Smart Sustainability Advisor

A full-stack web application designed to help users track their carbon footprint, manage resource usage, and receive personalized, AI-driven sustainability recommendations. 

The project features a sleek, interactive frontend powered by React and Vite, paired with a robust Django REST Framework backend backed by a Neon PostgreSQL database.

## 🚀 Features

- **Carbon Footprint Calculator:** Input your daily usage metrics (electricity, water, waste, transport, renewable energy) to instantly calculate your carbon footprint and sustainability score.
- **AI-Powered Advice:** Uses OpenAI's `gpt-4o-mini` model to generate personalized, actionable advice tailored to your exact resource usage patterns.
- **Credit System:** AI analysis consumes "credits". The app features a full ledger and transaction history system, and an Admin dashboard to recharge user credits.
- **History Tracking:** Logs all previous analyses, letting users track their sustainability progress over time.
- **Secure Authentication:** Secure JWT-based registration and login system ensuring user data is private and safe.

## 🏗️ Architecture

This repository is built using a decoupled architecture, divided into two main components:

### 1. Frontend (`/sustainability-advisor`)
- **Framework:** React + Vite
- **Styling:** TailwindCSS + Vanilla CSS for dynamic glassmorphism aesthetics.
- **Key Libraries:** `react-markdown` (rendering AI advice), Charting libraries.
- **Environment:** Requires a `.env` file containing `VITE_API_URL=http://localhost:5000`.

### 2. Backend (`/sustainability-backend-django`)
- **Framework:** Django + Django REST Framework (DRF)
- **Database:** PostgreSQL (Hosted on Neon)
- **Authentication:** `djangorestframework-simplejwt`
- **Key APIs:** `openai` (for generating advice)

---

## 💻 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.9+)
- A PostgreSQL Database URL (e.g., [Neon](https://neon.tech/))
- An [OpenAI API Key](https://platform.openai.com/)

### Setting up the Backend

1. Navigate to the backend directory:
   ```bash
   cd sustainability-backend-django
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `sustainability-backend-django` folder with your secrets:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
   OPENAI_API_KEY=sk-your-openai-api-key
   JWT_SECRET=your-secure-jwt-secret-key
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the Django server:
   ```bash
   python manage.py runserver 5000
   ```

### Setting up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd sustainability-advisor
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will start (usually on `http://localhost:5173`) and automatically communicate with the Django backend running on port 5000.

## 🛡️ Admin Access

To use the Admin Panel (to recharge user credits), you must log in with a user account that has the `admin` role and superuser privileges.

You can create an admin user directly from your backend terminal:
```bash
cd sustainability-backend-django
.\venv\Scripts\activate
python manage.py createsuperuser
```
*Note: Make sure to set their `role` to `'admin'` in the database or via the Django Admin panel at `http://localhost:5000/admin/`.*

## 📄 License

This project is open-source and available under the ISC License.

# Savraedu - School Management & Analytics Ecosystem

Savraedu is a high-fidelity, interactive dashboard designed for school administrators. It provides real-time insights into teacher performance, classroom engagement, and overall school activity through a premium, data-driven interface.

## 🚀 Key Features

- **Interactive Dashboard**: KPI cards for active teachers, lessons, and assessments with weekly activity charts.
- **Teacher Performance Tracking**: Detailed profiles for teachers including engagement scores, class-wise breakdowns, and performance status.
- **Classroom Overviews**: Comparative analytics across different grade levels.
- **Unified Search & Filtering**: Real-time filtering by teacher name, subject, or grade across all views.
- **Selection-Based Analytics**: All data updates dynamically based on Grade and Subject selectors in the header.
- **Professional Data Export**:
  - **CSV**: Download structured data for teachers and performance tables.
  - **PDF**: Generate clean, professional reports for classrooms and summaries using specialized print styles.
- **AI Pulse Summary**: Context-aware insights generated from live school data.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Modern component-based architecture.
- **Recharts**: High-performance charting and visualization.
- **Axios**: Seamless interaction with the backend API.
- **Vanilla CSS**: Custom, premium design system with dark mode accents and glassmorphism.

### Backend
- **FastAPI**: High-performance Python web framework.
- **SQLAlchemy**: Powerful ORM for database interactions.
- **SQLite**: Reliable local database.
- **Query Filtering**: Parameterized endpoints for grade and subject-specific analytics.

## 📁 Project Structure

```text
Savraedu/
├── backend/            # FastAPI Application
│   ├── main.py         # Entry point and API routes
│   ├── insights.py     # Aggregation and analytics logic
│   ├── models.py       # SQLAlchemy database schemas
│   ├── crud.py         # Database operations
│   └── activities.db   # SQLite database
├── frontend/           # React Application
│   ├── src/
│   │   ├── App.jsx     # Main application logic and routing
│   │   ├── App.css     # Custom design system and print styles
│   │   └── assets/      # Media and static files
│   └── package.json    # Frontend dependencies
└── README.md           # Project documentation
```

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Ensure you have Python installed.
3. (Optional) Create and activate a virtual environment.
4. Install dependencies: `pip install fastapi uvicorn sqlalchemy pandas openpyxl`
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📄 Reporting & Analytics

Savraedu supports professional reporting natively:
- **CSV Exports**: Click export buttons on any table or teacher view to download raw data.
- **PDF Reports**: Use the "PDF Summary" or "Export PDF" buttons to open a print-ready view. The system automatically hides sidebars and navigation for a clean, professional finish.


---


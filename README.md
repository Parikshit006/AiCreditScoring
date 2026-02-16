# AI Credit Scoring Platform - Barclays Hackathon Prototype

## Overview
This platform uses machine learning (XGBoost) and alternative financial signals to assess creditworthiness for unbanked and under-banked individuals. It features SHAP-based explainability and an interactive "What-If" simulator.

## Features
- **AI Credit Assessment**: Real-time default probability prediction.
- **Explainable AI**: Top risk drivers identified using SHAP values.
- **Credit Coach**: Actionable suggestions to improve credit score.
- **What-If Simulator**: Interactive sliders to simulate financial improved scenarios.
- **Fairness Dashboard**: Metrics on disparate impact and subgroup accuracy.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: FastAPI, Uvicorn
- **ML**: XGBoost, SHAP, Scikit-learn, Pandas

## 🚀 Quick Start Guide

To run the full prototype, you need to open **two separate terminals** (command prompts).

### Terminal 1: Backend API
1. Open a new terminal.
2. Navigate to the **backend** folder:
   ```bash
   cd c:/Users/parik/OneDrive/Desktop/barclays/backend
   ```
3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Note: Ensure you have installed requirements first: `pip install -r requirements.txt` (inside backend folder)*

### Terminal 2: Frontend App
1. Open a **second** terminal.
2. Navigate to the **frontend** folder:
   ```bash
   cd c:/Users/parik/OneDrive/Desktop/barclays/frontend
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- Prediction: `http://localhost:8000/api/v1/predict`
- Documentation: `http://localhost:8000/docs`

## Access the App
Open your browser and visit: `http://localhost:5173`

## License
MIT

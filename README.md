# 🏦 Barclays AI Credit Scoring Platform

> **AI-powered credit scoring for the underbanked** — using alternative data (transaction history, utility payments, business activity) to extend credit to individuals without traditional credit bureau records.

---

## 🎯 Problem Statement

Over 1.4 billion adults globally lack access to formal credit due to absence of traditional credit scores (CIBIL, FICO). This platform demonstrates how **alternative data + AI** can bridge that gap — enabling fair, explainable, and inclusive credit decisions.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Static HTML)            │
│                                                     │
│  index.html ─── Landing Page                        │
│  apply.html ─── Credit Application Form             │
│  result.html ── Decision Display + Risk Gauge       │
│  reason.html ── SHAP Explainability + What-If       │
│  dashboard.html  Model Performance Dashboard        │
│  fairness.html ─ Bias & Fairness Metrics            │
│  audit.html ──── Decision Audit Logs                │
│                                                     │
│  Data Flow: localStorage (creditAuditLog)           │
└─────────────────┬───────────────────────────────────┘
                  │ REST API (fetch)
                  ▼
┌─────────────────────────────────────────────────────┐
│               BACKEND (FastAPI + Uvicorn)            │
│                                                     │
│  POST /api/v1/apply     → Heuristic Scoring         │
│  POST /api/v1/predict   → XGBoost ML Prediction     │
│  POST /api/v1/what-if   → Simulation Engine         │
│  GET  /api/v1/model-metrics    → AUC/Precision/F1   │
│  GET  /api/v1/fairness-metrics → Bias Metrics       │
│                                                     │
│  CORS enabled for all origins                       │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│               ML MODEL (XGBoost + SHAP)              │
│                                                     │
│  Training:  ml/train_model.py                       │
│  Dataset:   ml/credit.xls (150K records)            │
│  Output:    backend/app/model/model.pkl             │
│  Explainer: SHAP TreeExplainer                      │
│  Imbalance: SMOTE oversampling                      │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🤖 AI & ML
- **XGBoost Classifier** trained on real credit data (150K records)
- **SMOTE** for handling class imbalance
- **SHAP Explainability** — top 3 risk factors for every decision
- **What-If Simulator** — adjust inputs and see how decisions change in real-time

### 📊 Alternative Data Scoring
- Transaction behaviour score (cash-flow stability)
- Utility payment history (electricity, mobile, rent)
- Business activity score (sales volume, digital activity)
- Savings buffer analysis
- Rent payment reliability

### 🏛️ Governance & Compliance
- **Model Performance Dashboard** — AUC, Precision, Recall, F1, Accuracy (live from model metrics API)
- **Confusion Matrix** — computed from real application decisions
- **Bias & Fairness Monitoring** — Demographic Parity, Equal Opportunity, Disparate Impact ratios
- **Full Audit Trail** — every decision logged with timestamp, risk score, and model version
- **Credit Coach** — personalized recommendations for improving creditworthiness

### 🎨 Design
- Premium glassmorphism dark theme
- Animated charts, ring gauges, and risk meters
- Responsive layout across all devices
- Google Fonts (Outfit, Inter)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip

### 1. Clone the Repository
```bash
git clone https://github.com/Parikshit006/AiCreditScoring.git
cd AiCreditScoring
```

### 2. Set Up Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Train the Model (Optional — pre-trained model included)
```bash
python ml/train_model.py
```

### 4. Start the Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```

### 5. Open the Frontend
Open `frontend/index.html` in your browser, or serve it:
```bash
# Using Python's built-in server
python -m http.server 5500 --directory frontend
```
Then visit: `http://localhost:5500`

---

## 📁 Project Structure

```
barclays/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS
│   │   ├── api/
│   │   │   └── endpoints.py     # All API routes
│   │   ├── core/
│   │   │   └── model.py         # Model loader + SHAP explainer
│   │   └── model/
│   │       └── model.pkl        # Trained XGBoost model (136KB)
│   ├── requirements.txt
│   └── Dockerfile
├── ml/
│   ├── train_model.py           # Model training pipeline
│   ├── credit.xls               # Training dataset (150K records)
│   └── ai_credit_scoring.ipynb  # Jupyter notebook (EDA + training)
├── frontend/
│   ├── index.html               # Landing page
│   ├── apply.html               # Application form
│   ├── result.html              # Decision result page
│   ├── reason.html              # Explainability + What-If simulator
│   ├── dashboard.html           # Model performance dashboard
│   ├── fairness.html            # Bias & fairness metrics
│   └── audit.html               # Decision audit log
├── .gitignore
└── README.md
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/apply` | POST | Submit credit application (alternative data) |
| `/api/v1/predict` | POST | ML prediction using XGBoost model |
| `/api/v1/what-if` | POST | What-if simulation (same as predict) |
| `/api/v1/model-metrics` | GET | Model AUC, Precision, Recall |
| `/api/v1/fairness-metrics` | GET | Bias and fairness ratios |

### Example: Submit Application
```bash
curl -X POST http://localhost:8000/api/v1/apply \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "APP-001",
    "applicant_type": "individual",
    "monthly_income": 25000,
    "savings_balance": 15000,
    "transaction_score": 85,
    "utility_payment_score": 90,
    "business_activity_score": 50,
    "rent_payment_score": 75
  }'
```

---

## 🛡️ Responsible AI

- **No protected attributes** (gender, religion, caste, ethnicity) used in scoring
- **SHAP-based explainability** for every decision — users see exactly why they were approved/rejected
- **Fairness metrics** actively monitored (Demographic Parity, Equal Opportunity, Disparate Impact)
- **Full audit trail** maintained for regulatory compliance (RBI guidelines)
- **Credit Coach** provides actionable recommendations for rejected/reviewed applicants

---

## 🔒 Security Measures

### Input Validation & Sanitization
- **Pydantic schema validation** on all API endpoints — rejects malformed or missing fields before processing
- **Type enforcement** — numeric fields (income, scores) are strictly typed; no string injection possible
- **Range constraints** — behavioural scores capped at 0–100, risk probabilities clamped between 0.0–1.0

### API Security
- **CORS middleware** — Cross-Origin Resource Sharing configured to control which domains can access the API
- **Error handling** — all endpoints wrapped in try/catch blocks; internal errors return sanitized HTTP 500 responses without exposing stack traces or model internals
- **No raw SQL / No database injection** — the prototype uses in-memory model inference only; no database queries exposed to user input

### Data Privacy
- **No PII storage on server** — the backend is stateless; it processes requests and returns results without persisting any personal data
- **Client-side data only** — audit logs stored in browser `localStorage`, giving users full control over their data
- **No protected attributes collected** — the application form does not ask for gender, religion, caste, or ethnicity

### Model Security
- **Serialized model** (`model.pkl`) is pre-trained and read-only — cannot be modified via API
- **SHAP explainer** runs server-side only — model internals (weights, trees) are never exposed to the frontend
- **Heuristic scoring** uses server-side weighted calculation — scoring logic is not visible to end users

### Frontend Security
- **No inline user-generated content** rendered without escaping
- **HTTPS enforced** on deployed endpoints (Render provides automatic SSL/TLS)
- **No third-party tracking** — only Google Fonts and Font Awesome CDN loaded

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Python, FastAPI, Uvicorn |
| ML Model | XGBoost, scikit-learn, SHAP |
| Data | pandas, NumPy, imbalanced-learn (SMOTE) |
| Styling | Glassmorphism, CSS Variables, Font Awesome |
| Fonts | Google Fonts (Outfit, Inter) |

---

## 👥 Team

Built for the Barclays AI Hackathon — demonstrating how AI + alternative data can democratize credit access for underbanked populations.

---

## 📄 License

This project is built for educational and hackathon demonstration purposes.

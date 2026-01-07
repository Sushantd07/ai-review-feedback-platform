# Fynd AI Intern – Take Home Assessment 2.0

This repository contains my submission for the **Fynd AI Intern – Take Home Assessment 2.0**, consisting of two independent tasks:

- **Task 1:** Rating prediction for Yelp reviews using prompt engineering
- **Task 2:** A production-style, two-dashboard AI feedback system

Both tasks are implemented, documented, and deployed according to the assessment requirements.

---

## 📂 Repository Structure

```text
fynd-ai-intern-assessment/
│
├── README.md
├── (REPORT.pdf)
│
├── Task 1/
│   ├── rating_prediction.ipynb
│   ├── prompts/
│   │   ├── prompt_v1.txt
│   │   ├── prompt_v2.txt
│   │   └── prompt_v3.txt
│   └── results/
│       └── evaluation_summary.csv
│
├── Task2/
│   ├── client/          # React frontend (User & Admin dashboards)
│   └── server/          # Express backend with LLM integration
│
└── .gitignore
```

## 🧠 Task 1 – Rating Prediction via Prompting

### Objective
Classify Yelp reviews into 1–5 star ratings using prompt engineering only, without any model fine-tuning.

### Key Details
- **Dataset:** Yelp Reviews dataset from Kaggle
- **Sample size:** ~200 reviews
- **Output format:**
  ```json
  {
    "predicted_stars": 4,
    "explanation": "Brief reasoning for the assigned rating."
  }
  ```

### Prompting Approaches
1. **Baseline Prompt:** Simple instruction with strict JSON output
2. **Rule-Based Prompt:** Explicit sentiment-to-rating mapping
3. **Step-by-Step Prompt:** Sentiment identification → intensity → rating

### Evaluation Metrics
- Accuracy (exact match with ground truth)
- JSON validity rate
- Reliability across runs

Detailed results, comparison table, and discussion are included in `REPORT.pdf`.

---

## 🧩 Task 2 – Two-Dashboard AI Feedback System

### System Overview
A production-style web application with:

**User Dashboard (Public):**
- Select star rating (1–5)
- Submit written feedback
- Receive AI-generated response
- Clear loading, success, and error states

**Admin Dashboard (Internal):**
- View all submissions
- See AI-generated summaries
- See AI-suggested recommended actions
- Basic analytics and filtering

Both dashboards read from and write to the same persistent MongoDB database.

### 🏗️ Architecture

**Frontend**
- React (Vite)
- Tailwind CSS
- Deployed on Netlify
- Environment-based backend URL configuration

**Backend**
- Node.js + Express
- MongoDB for persistence
- Deployed on Render / Railway

**LLM Integration**
- All LLM calls are server-side only
- OpenRouter used as the LLM gateway
- Stable open-source LLM selected for production reliability
- Explicit JSON schemas and graceful fallback handling

### ⚠️ Edge Case Handling
The system explicitly handles:
- Empty reviews: Polite fallback without unnecessary LLM calls
- Long reviews: Input truncation before model invocation
- LLM / API failures: Graceful fallback responses with no UX breakage

This ensures robustness in real-world usage.

### 🚀 Deployment Links
- **User Dashboard:** (add deployed URL)
- **Admin Dashboard:** (add deployed URL)

Both deployments:
- Load successfully
- Persist data across refreshes
- Work without any local setup

### 🔐 Environment Variables & Security
- Secrets (API keys, database URIs) are never committed
- Environment variables are managed via deployment platforms
- `.env` files are excluded using `.gitignore`

## 📄 Report
A detailed technical report covering:
- Overall approach
- Prompt iterations and improvements
- Evaluation methodology and results (Task 1)
- System design, trade-offs, and limitations (Task 2)

is included as `REPORT.pdf` in this repository.

# 🧠 Math Note AI – AI-Powered Math Canvas App

This project is a clone of Apple’s iPad Math Notes using **React, FastAPI**, and **Google Gemini AI**. It lets users draw math expressions, which are then processed by AI to render beautiful LaTeX and solve equations.

---

## ✨ Features

- ✍️ Draw mathematical expressions using canvas
- 🤖 Process and evaluate drawings using Gemini 1.5 Flash
- 📐 Display LaTeX-rendered answers on screen
- 🧠 Assign and reuse variables like `x = 5`
- 🗂️ View and reuse history of calculations
- 🎨 Theme toggle (light/dark)
- 🎹 Keyboard shortcuts (Ctrl+R, Enter, etc.)

---

## 🖥️ Frontend Tech Stack

- React + TypeScript
- TailwindCSS + ShadCN UI + Mantine
- MathJax (for LaTeX rendering)
- react-draggable (for moving LaTeX blocks)
- Axios (for API calls)

---

## ⚙️ Backend Tech Stack

- FastAPI (Python)
- Pillow (image decoding)
- Google Gemini API (AI reasoning)
- dotenv for environment variables

---

## 🚀 Getting Started

### 📦 Clone the Repo

```bash
git clone https://github.com/DevPatel2020/math_ai.git
cd math_ai
```

---

## 🔧 Backend Setup

```bash
cd backend
venv\Scripts\activate
python main.py
```

Backend will be running at:
```
http://localhost:8900
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:
```
http://localhost:5173
```

---

## 🎹 Keyboard Shortcuts

| Key             | Action               |
|-----------------|----------------------|
| Ctrl + R        | Reset canvas         |
| Enter           | Run calculation      |
| Ctrl + H        | Toggle history       |
| Shift + ?       | Show help modal      |
| Escape          | Close panels         |

---

## 📁 Project Structure

```
math_ai/
├── frontend/        # Frontend (React + Vite)
├── backend/         # Backend (FastAPI + Gemini API)
```

---

## 🧠 AI Prompting Logic (Backend)

Gemini receives a smart prompt to:
- Follow PEMDAS
- Solve math or assign variables
- Understand graphical or abstract problems
- Output JSON that is parsed and rendered in frontend

---

## 👤 Author

Made by [DevPatel2020](https://github.com/DevPatel2020)

---

## 📄 License

This project is for educational/demo purposes only. Not for commercial use.
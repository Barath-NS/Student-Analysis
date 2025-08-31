# Student Performance AI

AI-powered student performance analysis and prediction system that uses machine learning to predict exam performance based on historical data.

## Features

- **File Upload**: Upload Exam 1 data in CSV or Excel format
- **AI Model Training**: Train machine learning models using Random Forest algorithms  
- **Performance Prediction**: Generate Exam 2 predictions based on Exam 1 results
- **Student Analytics**: Individual student performance analysis and insights
- **Interactive Dashboard**: Modern web interface with charts and visualizations
- **AI Chatbot**: Intelligent assistant for performance queries and insights

## Requirements

- Python 3.8 or higher
- All dependencies listed in `requirements.txt`

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Method 1: Using main.py (Recommended)
```bash
python main.py
```

### Method 2: Using uvicorn directly
```bash
uvicorn students:app --host 127.0.0.1 --port 8000 --reload
```

### Method 3: Using VSCode
- Open the project in VSCode
- Press `Ctrl+Shift+P` and select "Tasks: Run Task"
- Choose "Start FastAPI Server"

## Usage

1. **Start the server** using one of the methods above
2. **Open your browser** and navigate to `http://127.0.0.1:8000`
3. **Upload Exam 1 data**: Use the dashboard to upload your exam data file
4. **Train Models**: Click "Train Models" to create AI prediction models
5. **Generate Predictions**: Upload Exam 2 student IDs to generate predictions
6. **Analyze Results**: Use the Students and Analytics sections to explore insights
7. **Ask the AI**: Use the chatbot for performance queries and recommendations

## File Format Requirements

### Exam 1 Data
- CSV or Excel file with columns: `student_id`, `physics`, `maths`, `english`, `chemistry`, `computer`
- Marks should be numeric values (0-100)

### Exam 2 Student IDs
- CSV or Excel file with column: `student_id`
- List of student IDs for which to generate predictions

## API Endpoints

- `GET /`: Main application interface
- `POST /upload_exam1/`: Upload Exam 1 data
- `POST /train_models/`: Train prediction models
- `POST /predict_exam2/`: Generate Exam 2 predictions
- `GET /student_marks_data/{student_id}`: Get individual student data
- `GET /student_marks_chart/{student_id}`: Get student performance chart

## Technology Stack

- **Backend**: FastAPI, Python
- **Machine Learning**: scikit-learn, pandas, numpy
- **Data Processing**: pandas, openpyxl
- **Visualization**: matplotlib, Chart.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Server**: uvicorn

## No Authentication Required

This application runs **without any login requirements**. Simply start the server and access the application directly in your browser.

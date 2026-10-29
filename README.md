# 📊 Statistical Quality Control Analyzer

A web-based **Statistical Quality Control (SQC) Analyzer** designed to help monitor manufacturing processes, analyze quality data, detect abnormal process behavior, and provide actionable quality recommendations.

The system provides interactive statistical control charts along with **Western Electric rule detection, issue analysis, smart recommendations, analysis history, and textile blend optimization**.

---

## 🚀 Project Overview

The SQC Analyzer allows users to upload or enter process-quality data and analyze it using different statistical control charts.

The application can:

- Calculate control limits
- Visualize process variation
- Detect out-of-control points
- Identify abnormal statistical patterns
- Analyze possible quality issues
- Generate recommendations
- Optimize textile material blends
- Maintain analysis history

The project is particularly useful for **textile and yarn manufacturing quality analysis**, where monitoring process variation and material quality is important.

---

## ✨ Features

### 📈 Control Charts

The application supports:

- **X̄-R Chart** – Monitors process mean and range.
- **X̄-S Chart** – Monitors process mean and standard deviation.
- **P Chart** – Monitors the proportion of defective items.

The charts display:

- Center Line (CL)
- Upper Control Limit (UCL)
- Lower Control Limit (LCL)
- Process measurements
- Out-of-control points

---

### ⚠️ Western Electric Rules

The system automatically analyzes control-chart data for abnormal patterns, including:

- Points outside control limits
- Process shifts
- Consecutive points on one side of the center line
- Increasing or decreasing trends
- Unusual clustering patterns

This helps identify potential process instability before it becomes a major quality problem.

---

### 🔍 Issue Analysis

Detected process abnormalities are analyzed and presented with:

- Issue description
- Severity
- Affected measurements
- Possible causes
- Recommended actions

This makes statistical results easier for quality engineers to understand.

---

### 💡 Smart Recommendations

The recommendation engine provides possible corrective actions based on detected quality issues.

Examples include:

- Checking machine settings
- Inspecting equipment condition
- Monitoring environmental conditions
- Checking raw-material quality
- Reviewing production procedures
- Increasing process monitoring
- Performing preventive maintenance

---

### 🧵 Textile Blend Optimization

The project includes a blend optimization module designed for textile applications.

It can analyze different material combinations based on factors such as:

- Material percentage
- Material quality
- Cost
- Target quality
- Process variability

The system provides optimized blend suggestions to help balance **quality and cost**.

---

### 📂 Data Upload

Users can upload quality data and analyze it through the application.

Supported formats include:

- CSV
- XLSX

The system also provides sample data for testing and demonstration.

---

### 📊 Analysis History

Previous analyses can be viewed through the history dashboard, allowing users to review earlier SQC results.

---

## 🛠️ Technologies Used

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **React Router**
- **Lucide React**
- **PapaParse**
- **SheetJS (XLSX)**

---

# ⚙️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/Sachin31-1/STATISTICAL-QUALITY-CONTROL-FOR-TEXTILE.git
```

## 2. Navigate to the Project

```bash
cd STATISTICAL-QUALITY-CONTROL-FOR-TEXTILE
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Development Server

```bash
npm run dev
```

The terminal will display a local URL similar to:

```text
http://localhost:5173/
```

Open that URL in your browser.

---

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# 🔄 Application Workflow

```text
        Start
          ↓
   Select Chart Type
          ↓
    Enter / Upload Data
          ↓
   Configure Parameters
          ↓
  Calculate Control Limits
          ↓
     Generate Chart
          ↓
 Detect Statistical Issues
          ↓
 Apply Western Electric Rules
          ↓
    Issue Analysis
          ↓
 Smart Recommendations
          ↓
 View / Save Results
```

---

# 🎯 Applications

The SQC Analyzer can be used for:

- Textile manufacturing
- Yarn quality monitoring
- Manufacturing process control
- Statistical Process Control (SPC)
- Defect monitoring
- Quality engineering
- Process improvement
- Academic and industrial demonstrations

---

# 📁 Main Project Structure

```text
STATISTICAL-QUALITY-CONTROL-FOR-TEXTILE/
│
├── public/
├── src/
│   └── app/
│       ├── components/
│       ├── context/
│       ├── screens/
│       └── utils/
│           ├── sqc-calculations.ts
│           ├── western-electric-rules.ts
│           ├── recommendations-engine.ts
│           ├── blend-optimization.ts
│           └── file-upload.ts
│
├── package.json
├── package-lock.json
├── vite.config.ts
├── index.html
├── .gitignore
└── README.md
```

---

# 🔮 Future Enhancements

- Real-time IoT sensor integration
- Machine-learning-based anomaly detection
- Predictive quality analysis
- Automated quality reports
- Real-time production monitoring
- Process capability analysis
- AI-based root-cause analysis
- Cloud deployment
- Database integration

---

## 👨‍💻 Project

**Statistical Quality Control Analyzer for Textile Manufacturing**

A smart quality-analysis platform combining **Statistical Process Control, automated pattern detection, recommendations, and textile blend optimization** into a single web application.

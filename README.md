# 📊 SQC Analyzer

A modern **Statistical Quality Control (SQC) Analyzer** designed to simplify process monitoring, control-chart analysis, and quality improvement.

The application helps users analyze manufacturing and process data using statistical control charts, automatically detect abnormal patterns, identify potential process issues, and generate actionable recommendations.

## 🚀 Features

- **X̄-R Control Chart** – Analyze process mean and range variation.
- **X̄-S Control Chart** – Analyze process mean and standard deviation.
- **P Chart** – Monitor the proportion of defective items.
- **Western Electric Rules** – Automatically detect out-of-control patterns and process shifts.
- **Smart Recommendations** – Generate corrective and preventive actions based on detected issues.
- **Process Status Analysis** – Identify whether a process is in control or requires attention.
- **CSV/XLSX Data Upload** – Import quality-control data directly into the application.
- **Sample Data Generation** – Generate sample datasets for testing and demonstration.
- **Analysis History** – Store and review previous SQC analyses.
- **Data Export** – Export analysis results for further use.
- **Blend Optimization** – Suggest optimized material blends based on quality and cost.
- **Textile/Yarn Focus** – Includes recommendations and blend-analysis features suitable for textile manufacturing.
- **Interactive Charts** – Visualize process measurements, control limits, and detected issues.
- **Responsive UI** – Clean interface suitable for desktop and presentation/demo use.

## 🧠 SQC Analysis

The application supports:

### X̄-R Chart
Used for monitoring the **process average and range** of variable/continuous data, particularly for smaller subgroup sizes.

### X̄-S Chart
Uses the **standard deviation** to monitor process variation and is useful for larger subgroup sizes.

### P Chart
Used to monitor the **proportion of defective units** in samples.

## ⚠️ Western Electric Rules

The analyzer detects common statistical patterns such as:

- Points beyond control limits
- Shifts in the process mean
- Consecutive points on one side of the center line
- Increasing or decreasing trends
- Points clustered within one-sigma limits
- Alternating patterns
- Mixture patterns

Detected issues are categorized by **High, Medium, or Low impact**.

## 💡 Smart Recommendations

After detecting process issues, the system generates recommendations such as:

- Investigating machine settings and calibration
- Checking raw-material quality
- Monitoring temperature and humidity
- Inspecting equipment for wear
- Reviewing sampling procedures
- Increasing process monitoring
- Performing preventive maintenance
- Improving operator procedures

## 🧵 Blend Optimization

The textile-focused blend optimization module evaluates material combinations based on:

- Material quality
- Material cost
- Current blend percentage
- Target quality
- Expected cost change
- Expected quality improvement
- Variability reduction

It can suggest adjustments to improve quality or reduce cost while maintaining acceptable process performance.

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **React Router**
- **Lucide React**
- **PapaParse**
- **SheetJS / XLSX**
- **Motion**
- **Radix UI**

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/
│   ├── context/
│   ├── screens/
│   ├── utils/
│   │   ├── sqc-calculations.ts
│   │   ├── western-electric-rules.ts
│   │   ├── recommendations-engine.ts
│   │   ├── blend-optimization.ts
│   │   └── file-upload.ts
│   ├── App.tsx
│   └── routes.tsx
├── styles/
└── main.tsx
```

## ⚙️ Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd sqc
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

## 📈 Workflow

```text
Select Chart Type
       ↓
Enter / Upload Quality Data
       ↓
Configure Parameters
       ↓
Calculate Control Charts
       ↓
Detect Out-of-Control Patterns
       ↓
Apply Western Electric Rules
       ↓
Generate Recommendations
       ↓
View Results & History
```

## 🎯 Applications

This project can be used for:

- Manufacturing quality control
- Textile and yarn production
- Process monitoring
- Defect analysis
- Statistical process control education
- Quality engineering demonstrations
- Industrial process improvement

## 🔮 Future Enhancements

- Real-time IoT sensor integration
- Machine-learning-based anomaly detection
- Predictive quality analysis
- Automated PDF report generation
- Database-backed analysis history
- Real-time production dashboards
- Advanced process capability analysis
- AI-powered root-cause analysis
- Cloud deployment and multi-user support

## 👨‍💻 Project

Developed as a **Statistical Quality Control and Process Analytics** project with a focus on making traditional SPC analysis more interactive, automated, and actionable.

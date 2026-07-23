# 🩺 AMAP — Autonomous Medical AI Platform (v1.0)

> **Enterprise-Grade AI-Powered Clinical Decision Support & Medical Image Diagnostic Platform**

![AMAP Banner](https://img.shields.io/badge/AMAP-v1.0.0-blue?style=for-the-badge&logo=prezi&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)
![DICOM Compliant](https://img.shields.io/badge/DICOM-3.0_Standard-0052CC?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Compliance-HIPAA_%7C_HL7_FHIR-purple?style=for-the-badge)
![AI Models](https://img.shields.io/badge/AI_Core-Vision_Transformer_%7C_Grad--CAM-ff69b4?style=for-the-badge)

---

## 📋 Overview

**AMAP (Autonomous Medical AI Platform)** is a state-of-the-art, high-performance web dashboard engineered for radiologists, oncologists, and healthcare professionals. Designed with a sleek, dark-themed clinical UI, AMAP integrates real-time medical image processing (CT, MRI, X-Ray, Ultrasound, Histopathology), 13-stage AI analysis pipelines, explainable AI (Grad-CAM heatmaps & SHAP feature metrics), interactive slice viewers, multi-gauge risk prediction, and an intelligent AI Doctor Copilot.

---

## 🌟 Key Features

### 1. 📊 Real-Time Clinical KPI Dashboard
- **8 Dynamic Metric Cards**: Tracks Today's Patients (+12%), Images Processed (+8%), Pending Reports (-21%), Critical Alerts (+2), Average AI Confidence (96.8%), Hospital Accuracy (98.2%), GPU Utilization (74%), and Processing Speed (1.8s).
- **Custom Canvas Sparklines**: Smooth, real-time mini trend charts for all key indicators.
- **Animated Number Counters**: Smooth rolling numerical animations upon section load.

### 2. 📥 Multi-Modality DICOM Upload Center
- **Drag-and-Drop Ingestion**: Supports DICOM (.dcm), NIfTI (.nii), PNG, JPEG, and TIFF files.
- **Modality Selector Chips**: Instant filtering across CT, MRI, X-Ray, Ultrasound, and Histopathology modalities.
- **Upload Progress Tracker**: Simulated real-time file upload percentage, file metadata breakdown, patient IDs, study dates, and scanner information.

### 3. 🔄 13-Stage AI Processing Pipeline
- Live animated visualization mapping patient data ingestion through DICOM PACS storage, preprocessing, organ segmentation, lesion detection, deep classification, risk prediction, explainable AI generation, doctor copilot review, and clinical report output.

### 4. 🖼️ Interactive DICOM Medical Image Viewer
- **Diagnostic Controls**: Tools for Zoom, Pan, Rotation, Windowing/Leveling (WL/WW), Measurement rulers, 3D Reconstruction toggle, and Slice Navigation.
- **AI Overlays & Segmentation Masks**: Bounding box indicators, confidence badges, tumor outlines, and heatmaps.
- **Axial Slice Scrubber**: Smooth range slider traversing CT/MRI slice series (e.g. Slice 128 / 256).

### 5. 🔬 AI Diagnostic Results & Risk Assessment
- **Clinical Grading Card**: Detection breakdown highlighting disease identification (e.g., Pulmonary Nodule), confidence scores (94.7%), severity rating (High), nodule dimensions (12.4 mm), staging (Stage IA), and classification (Adenocarcinoma).
- **Multi-Level Severity Scale**: Visual color-coded severity gradient (Benign -> Low -> Moderate -> High -> Critical).

### 6. 🧠 Explainable AI (XAI) Suite
- **Grad-CAM Heatmaps**: Visual attention heatmaps depicting deep neural network activation regions in lung CT scans.
- **SHAP Feature Importance**: Horizontal bar charts displaying morphological weightings (Irregular Margins, Solid Component, Spiculation, etc.).
- **Vision Transformer Attention**: Saliency mapping overlays for transparent AI diagnostic reasoning.

### 7. 🎯 Patient Risk Prediction Gauges
- **Triple SVG Gauges**: High-resolution circular gauges for 30-Day Readmission Risk (18%), Malignancy Probability (87%), and Treatment Response Rate (92%).
- **Interactive Risk Breakdown Cards**: Clinical triaging categories for Urgent Care, Routine Monitoring, and High-Risk Oncology Follow-ups.

### 8. 💬 AI Doctor Copilot Chatbot
- **Interactive Clinical Assistant**: Powered by specialized medical LLM dialog simulation.
- **Quick Action Chips**: One-click prompt suggestions ("Explain Grad-CAM attention", "Differential Diagnosis", "Treatment Recommendations").
- **Clinical Citation Badges**: Embedded literature references (RadioGraphics 2024, Lancet Oncol 2023).

### 9. 📄 Automated Clinical Report Generator
- Structured template producing patient demographics, diagnostic summaries, AI findings, and radiologist approval sign-offs.

### 10. 📈 Hospital Analytics & System Metrics
- **Disease Distribution Chart**: Doughnut chart categorizing oncology & diagnostic case distributions.
- **Weekly Hospital Workload**: Bar chart displaying daily scan ingestion volumes.
- **Diagnosis Time Reduction**: Multi-line trends tracking efficiency improvements over 12 months.
- **Model Accuracy Trajectory**: Performance tracking comparing ViT-L/16, ResNet-152, and DenseNet-201 architectures.

---

## 💻 Tech Stack & Architecture

- **Frontend Core**: HTML5 Semantic Markup, Vanilla JavaScript (ES6+)
- **Styling & Design System**: Custom Modular CSS3 (Design Tokens, Glassmorphic Cards, HSL Color Palette, Flexbox & Grid layouts)
- **Data Visualization**: Custom HTML5 Canvas Chart Engine (`js/charts.js`) with custom sparklines, line charts, bar charts, horizontal feature charts, and doughnut renderings.
- **Animations & Micro-Interactions**: IntersectionObserver API, requestAnimationFrame loops, smooth CSS Keyframes (`js/animations.js`).
- **Dependencies**: 0 External JS Libraries — Zero npm build dependencies required! Light, fast, and secure.

---

## 📁 Repository Structure

```
MedicalAI/
├── index.html              # Main application single-page interface (16 clinical sections)
├── css/
│   ├── design-system.css   # Color palette, CSS custom variables, typography & resets
│   ├── layout.css          # Top navigation, responsive sidebar, grid systems
│   ├── components.css      # Buttons, badges, cards, progress bars, toggle switches
│   └── sections.css        # Section-specific styles (Viewer, XAI, Pipeline, Gauges, Copilot)
├── js/
│   ├── app.js              # Application controller & state initialization
│   ├── charts.js           # Lightweight custom HTML5 Canvas charting engine
│   └── animations.js      # Scroll animations, counter rollups & pipeline dot movement
├── assets/
│   ├── ct-scan.png         # High-resolution clinical CT scan asset
│   └── gradcam.png        # Grad-CAM heatmap visualization overlay asset
└── README.md               # System documentation & usage guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
No node modules or build steps required. Any modern web browser (Chrome, Edge, Firefox, Safari) can launch the application instantly.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/melvin-ph/MedicalAI.git
   cd MedicalAI
   ```

2. **Open `index.html` in your browser:**
   - **Directly**: Double-click `index.html` or drag it into any web browser.
   - **VS Code Live Server**: Right-click `index.html` -> `Open with Live Server`.
   - **Python HTTP Server**:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`.

---

## 🔒 Medical Disclaimer & Compliance

> **IMPORTANT**: AMAP is an artificial intelligence research prototype and clinical decision support demonstration interface. It is intended to assist medical professionals and radiologists. It is **not** certified for autonomous diagnostic usage without physician oversight under FDA / CE-Mark medical device regulations.

- **Data Privacy**: Built to conform with HIPAA data privacy guidelines.
- **Interoperability**: Designed for integration with DICOM 3.0 standards and PACS servers (e.g. Orthanc).

---

## 👥 Authors & License

Developed with ❤️ for Advanced Healthcare & Clinical AI Research.

- **Repository**: [github.com/melvin-ph/MedicalAI](https://github.com/melvin-ph/MedicalAI)
- **License**: MIT License - free for educational and clinical research usage.

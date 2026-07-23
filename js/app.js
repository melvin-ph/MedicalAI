/* ============================================================
   AMAP App — Main application init, sidebar, navigation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebar();
  initKPIDashboard();
  initUploadCenter();
  initViewerControls();
  initCopilotChat();
  initAnalytics();
  initRiskGauges();
  initExplainableAI();
  Animations.initScrollAnimations();
  Animations.initPipelineAnimation();
  Animations.staggerChildren('.kpi-grid', 80);
  Animations.staggerChildren('.risk-grid', 100);
  Animations.staggerChildren('.modal-grid', 80);
  Animations.staggerChildren('.tech-grid', 40);

  // Directly animate KPI counters on load (they are above the fold)
  setTimeout(() => {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      Animations.animateCounter(el, target, 1800, suffix);
    });
    // Also directly trigger risk gauges
    document.querySelectorAll('.gauge-fill[data-percentage]').forEach(circle => {
      const pct = parseFloat(circle.getAttribute('data-percentage'));
      Animations.animateGauge(circle, pct);
    });
  }, 300);
});

/* ---- Navigation ---- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const target = link.getAttribute('data-section');
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ---- Sidebar ---- */
function initSidebar() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const target = item.getAttribute('data-section');
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ---- KPI Dashboard ---- */
function initKPIDashboard() {
  const sparklineData = {
    patients:    [42, 38, 45, 52, 48, 55, 61, 58, 64, 67, 72, 78],
    images:      [120, 135, 128, 142, 155, 148, 162, 170, 165, 178, 185, 192],
    reports:     [12, 15, 11, 18, 14, 16, 13, 17, 15, 12, 14, 11],
    alerts:      [3, 5, 2, 4, 3, 6, 2, 3, 4, 2, 3, 4],
    confidence:  [92, 93, 91, 94, 93, 95, 94, 96, 95, 96, 97, 96.8],
    accuracy:    [94, 95, 94, 96, 95, 97, 96, 97, 96, 98, 97, 98.2],
    gpu:         [65, 72, 68, 75, 78, 82, 76, 80, 74, 78, 72, 74],
    processing:  [2.8, 2.5, 2.9, 2.3, 2.6, 2.2, 2.4, 2.1, 2.3, 2.0, 2.2, 1.8],
  };

  const colors = {
    patients:   '#3B82F6',
    images:     '#10B981',
    reports:    '#F59E0B',
    alerts:     '#EF4444',
    confidence: '#8B5CF6',
    accuracy:   '#10B981',
    gpu:        '#06B6D4',
    processing: '#3B82F6',
  };

  Object.keys(sparklineData).forEach(key => {
    const canvas = document.getElementById(`sparkline-${key}`);
    if (canvas) {
      Charts.drawSparkline(canvas, sparklineData[key], colors[key]);
    }
  });

  // Animate counters
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(el => {
    // They'll be triggered by intersection observer
  });
}

/* ---- Upload Center ---- */
function initUploadCenter() {
  const uploadZone = document.getElementById('upload-zone');
  if (!uploadZone) return;

  ['dragenter', 'dragover'].forEach(event => {
    uploadZone.addEventListener(event, (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(event => {
    uploadZone.addEventListener(event, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
    });
  });

  uploadZone.addEventListener('click', () => {
    // Simulate file picker
    const progressSection = document.getElementById('upload-progress');
    if (progressSection) {
      progressSection.style.display = 'block';
      simulateUpload();
    }
  });
}

function simulateUpload() {
  const fill = document.querySelector('#upload-progress .progress-fill');
  const pctText = document.getElementById('upload-pct');
  if (!fill) return;

  let pct = 0;
  fill.style.transition = 'none';
  fill.style.width = '0%';

  const interval = setInterval(() => {
    pct += Math.random() * 8 + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      if (pctText) pctText.textContent = '100%';
      fill.style.width = '100%';
      // Show completion
      setTimeout(() => {
        const badge = document.getElementById('upload-status-badge');
        if (badge) {
          badge.textContent = 'Uploaded';
          badge.className = 'badge badge-success';
        }
      }, 300);
    } else {
      if (pctText) pctText.textContent = Math.round(pct) + '%';
      fill.style.width = pct + '%';
    }
    fill.style.transition = 'width 0.3s ease';
  }, 200);
}

/* ---- Viewer Controls ---- */
function initViewerControls() {
  const toolBtns = document.querySelectorAll('.viewer-toolbar .tool-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state for non-grouped tools
      if (!btn.classList.contains('no-toggle')) {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Toggle switches
  const toggles = document.querySelectorAll('.toggle-switch');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });

  // Slice slider
  const slider = document.getElementById('slice-slider');
  const sliceLabel = document.getElementById('slice-label');
  if (slider && sliceLabel) {
    slider.addEventListener('input', () => {
      sliceLabel.textContent = `Slice: ${slider.value} / 256`;
    });
  }
}

/* ---- Copilot Chat ---- */
function initCopilotChat() {
  const input = document.getElementById('copilot-input');
  const sendBtn = document.getElementById('copilot-send');
  const messages = document.getElementById('copilot-messages');

  if (!input || !sendBtn || !messages) return;

  function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : 'ai'}`;
    msg.innerHTML = `
      <div class="msg-avatar">${isUser ? 'DR' : 'AI'}</div>
      <div class="msg-bubble">${text}</div>
    `;
    msg.style.animation = 'fadeInUp 0.3s ease-out both';
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  const aiResponses = [
    `Based on the CT scan analysis, I've identified a <strong>12mm ground-glass nodule</strong> in the right upper lobe. The morphological features suggest a <strong>high probability (87.3%)</strong> of early-stage adenocarcinoma. I recommend PET-CT for staging confirmation.<div class="msg-citations"><span class="msg-citation">[1] RadioGraphics 2024</span><span class="msg-citation">[2] Lancet Oncol 2023</span></div>`,
    `The Grad-CAM visualization highlights the <strong>posterior segment of RUL</strong> as the primary region of interest. Feature analysis shows irregular margins (score: 0.89) and partial solid morphology (score: 0.82) as the most influential diagnostic features.`,
    `For differential diagnosis, consider: 1) <strong>Primary lung adenocarcinoma</strong> (87.3%), 2) <strong>Atypical adenomatous hyperplasia</strong> (8.2%), 3) <strong>Organizing pneumonia</strong> (3.1%), 4) <strong>Benign granuloma</strong> (1.4%).`,
  ];
  let responseIdx = 0;

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';

    // Simulate AI thinking
    setTimeout(() => {
      addMessage(aiResponses[responseIdx % aiResponses.length]);
      responseIdx++;
    }, 800);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  // Suggestion buttons
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent.trim();
      sendBtn.click();
    });
  });
}

/* ---- Analytics ---- */
function initAnalytics() {
  // Disease Distribution Doughnut
  const doughnutCanvas = document.getElementById('chart-disease');
  if (doughnutCanvas) {
    Charts.drawDoughnut(
      doughnutCanvas,
      [342, 278, 195, 156, 89, 45],
      ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
      ['Lung', 'Breast', 'Brain', 'Liver', 'Kidney', 'Other']
    );
  }

  // Hospital Workload Bar
  const barCanvas = document.getElementById('chart-workload');
  if (barCanvas) {
    Charts.drawBarChart(
      barCanvas,
      [145, 178, 162, 190, 210, 185, 198],
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '#3B82F6'
    );
  }

  // Diagnosis Time Line Chart
  const lineCanvas = document.getElementById('chart-diagnosis-time');
  if (lineCanvas) {
    Charts.drawLineChart(
      lineCanvas,
      [
        { data: [45, 42, 38, 35, 32, 28, 24, 22, 20, 18, 16, 14], color: '#3B82F6' },
        { data: [60, 55, 52, 48, 45, 40, 38, 35, 32, 30, 28, 25], color: '#64748B' },
      ],
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    );
  }

  // Model Performance Line Chart
  const perfCanvas = document.getElementById('chart-model-perf');
  if (perfCanvas) {
    Charts.drawLineChart(
      perfCanvas,
      [
        { data: [88, 90, 91, 92, 93, 94, 95, 96, 96, 97, 97, 98], color: '#10B981' },
        { data: [85, 87, 88, 90, 91, 92, 93, 93, 94, 95, 95, 96], color: '#3B82F6' },
        { data: [82, 84, 86, 88, 89, 90, 91, 92, 93, 93, 94, 95], color: '#F59E0B' },
      ],
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    );
  }
}

/* ---- Risk Gauges ---- */
function initRiskGauges() {
  // Gauges are animated via intersection observer in Animations.js
}

/* ---- Explainable AI Charts ---- */
function initExplainableAI() {
  // Feature importance
  const featureCanvas = document.getElementById('chart-feature-importance');
  if (featureCanvas) {
    Charts.drawHorizontalBar(
      featureCanvas,
      [0.92, 0.85, 0.78, 0.71, 0.63, 0.55, 0.42],
      ['Irregular Margins', 'Solid Component', 'Nodule Size', 'Spiculation', 'Ground Glass', 'Location (RUL)', 'Vessel Proximity'],
      ['#EF4444', '#F59E0B', '#F59E0B', '#3B82F6', '#3B82F6', '#10B981', '#10B981']
    );
  }

  // Confidence distribution
  const confCanvas = document.getElementById('chart-confidence-dist');
  if (confCanvas) {
    Charts.drawConfidenceDistribution(confCanvas);
  }
}

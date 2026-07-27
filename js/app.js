/* ============================================================
   Clinical Oncology Workstation — Application Logic
   Preserves all existing logic & initialization while activating
   the workstation UI components (toolbar, contours, viewports, tools).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Existing module initializers (safe with null checks)
  initNavigation();
  initSidebar();
  initKPIDashboard();
  initUploadCenter();
  initViewerControls();
  initCopilotChat();
  initAnalytics();
  initRiskGauges();
  initExplainableAI();

  // Workstation initializers
  initWorkstationToolbar();
  initContourToggles();
  initMaxContourToggle();
  initViewportSelection();
  initImageTools();
  initExportAction();

  if (window.Animations) {
    Animations.initScrollAnimations();
    Animations.initPipelineAnimation();
  }
});

/* ---- Workstation Toolbar ---- */
function initWorkstationToolbar() {
  const toolBtns = document.querySelectorAll('.ws-toolbar .tool-btn');
  const crosshairOverlays = document.querySelectorAll('.crosshair-overlay');

  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.getAttribute('data-tool');

      if (tool === 'reset') {
        resetImageTools();
        return;
      }
      if (tool === 'layout') {
        // Toggle layout configuration if needed
        return;
      }

      toolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tool === 'crosshair') {
        crosshairOverlays.forEach(ov => ov.classList.add('visible'));
      } else {
        crosshairOverlays.forEach(ov => ov.classList.remove('visible'));
      }
    });
  });
}

/* ---- Contour Structure Toggles & Selection ---- */
const CONTOUR_META = {
  gtv: {
    name: 'GTV',
    fullName: 'GTV · Gross Tumor Volume',
    vol: '18.7 cc',
    colorClass: 'gtv',
    slices: { axial: 'Image 87 / 245', coronal: 'Image 128 / 512', sagittal: 'Image 102 / 512' },
    coords: { axial: 'Z: -126.4 mm', coronal: 'Y: -23.6 mm', sagittal: 'X: 48.2 mm' }
  },
  ptv: {
    name: 'PTV',
    fullName: 'PTV · Planning Target Volume',
    vol: '95.3 cc',
    colorClass: 'ptv',
    slices: { axial: 'Image 92 / 245', coronal: 'Image 134 / 512', sagittal: 'Image 108 / 512' },
    coords: { axial: 'Z: -121.0 mm', coronal: 'Y: -19.2 mm', sagittal: 'X: 52.4 mm' }
  },
  ctv: {
    name: 'CTV',
    fullName: 'CTV · CTV Venography',
    vol: '134.6 cc',
    colorClass: 'ctv',
    slices: { axial: 'Image 89 / 245', coronal: 'Image 130 / 512', sagittal: 'Image 105 / 512' },
    coords: { axial: 'Z: -124.2 mm', coronal: 'Y: -21.8 mm', sagittal: 'X: 50.0 mm' }
  }
};

function initContourToggles() {
  const contourItems = document.querySelectorAll('.contour-item');

  contourItems.forEach(item => {
    const contour = item.getAttribute('data-contour');

    item.addEventListener('click', (e) => {
      // Checkbox click check
      const checkbox = item.querySelector('.contour-checkbox');
      if (e.target.closest('.contour-checkbox')) {
        checkbox.classList.toggle('checked');
        const isChecked = checkbox.classList.contains('checked');
        toggleContourVisibility(contour, isChecked);
        return;
      }

      // Contour row selection
      contourItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      selectContourStructure(contour);
    });
  });
}

function selectContourStructure(contourKey) {
  const meta = CONTOUR_META[contourKey];
  if (!meta) return;

  // 1. Update SVG contour paths across all viewports
  document.querySelectorAll('.contour-path').forEach(path => {
    const pType = path.getAttribute('data-contour-path');
    if (pType === contourKey) {
      path.classList.remove('dimmed');
      path.classList.add('focused');
    } else {
      path.classList.remove('focused');
      path.classList.add('dimmed');
    }
  });

  // 2. Update Viewport Active Contour Tag & Metadata
  ['axial', 'coronal', 'sagittal', '3d'].forEach(vType => {
    const tag = document.getElementById(`tag-${vType}`);
    if (tag) {
      tag.className = `ws-viewport-contour-tag ${meta.colorClass}`;
      tag.innerHTML = `<span class="tag-indicator ${meta.colorClass}"></span><span class="tag-text">${meta.fullName}</span>`;
    }

    if (vType !== '3d') {
      const sliceEl = document.getElementById(`slice-${vType}`);
      const coordEl = document.getElementById(`coord-${vType}`);
      if (sliceEl && meta.slices[vType]) sliceEl.textContent = meta.slices[vType];
      if (coordEl && meta.coords[vType]) coordEl.textContent = meta.coords[vType];
    }
  });

  // 3. Highlight corresponding row in Contour Information table
  document.querySelectorAll('tr[data-contour-row]').forEach(tr => {
    if (tr.getAttribute('data-contour-row') === contourKey) {
      tr.classList.add('active');
    } else {
      tr.classList.remove('active');
    }
  });
}

function toggleContourVisibility(contourKey, isVisible) {
  document.querySelectorAll(`[data-contour-path="${contourKey}"], [data-max-ring="${contourKey}"]`).forEach(el => {
    if (isVisible) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

/* ---- Max Contour View Toggle ---- */
function initMaxContourToggle() {
  const toggle = document.getElementById('max-contour-toggle');
  const status = document.getElementById('max-contour-status');

  if (!toggle || !status) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('on');
    const isOn = toggle.classList.contains('on');
    status.textContent = isOn ? 'ON' : 'OFF';
    status.className = `ws-toggle-status ${isOn ? 'on' : 'off'}`;

    document.querySelectorAll('.max-boundary-ring').forEach(ring => {
      if (isOn) {
        ring.classList.add('visible');
      } else {
        ring.classList.remove('visible');
      }
    });
  });
}

/* ---- Viewport Selection & Interaction ---- */
function initViewportSelection() {
  const viewports = document.querySelectorAll('.ws-viewport');

  viewports.forEach(vp => {
    vp.addEventListener('click', () => {
      viewports.forEach(v => v.classList.remove('active'));
      vp.classList.add('active');
    });
  });
}

/* ---- Image Adjustment Sliders ---- */
function initImageTools() {
  const tools = [
    { id: 'tool-brightness', valId: 'val-brightness', default: 50 },
    { id: 'tool-contrast', valId: 'val-contrast', default: 50 },
    { id: 'tool-window', valId: 'val-window', default: 400 },
    { id: 'tool-level', valId: 'val-level', default: 40 },
    { id: 'tool-opacity', valId: 'val-opacity', default: 100 }
  ];

  tools.forEach(t => {
    const input = document.getElementById(t.id);
    const valDisplay = document.getElementById(t.valId);

    if (input && valDisplay) {
      input.addEventListener('input', () => {
        valDisplay.textContent = input.value;
        applyImageFilters();
      });
    }
  });

  const resetBtn = document.getElementById('btn-reset-tools');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetImageTools);
  }
}

function applyImageFilters() {
  const brightness = document.getElementById('tool-brightness')?.value || 50;
  const contrast = document.getElementById('tool-contrast')?.value || 50;
  const opacity = document.getElementById('tool-opacity')?.value || 100;

  const activeViewport = document.querySelector('.ws-viewport.active img');
  if (activeViewport) {
    const bValue = 0.5 + (brightness / 100);
    const cValue = 0.5 + (contrast / 100);
    const oValue = opacity / 100;
    activeViewport.style.filter = `brightness(${bValue}) contrast(${cValue}) opacity(${oValue})`;
  }
}

function resetImageTools() {
  const defaults = {
    'tool-brightness': 50,
    'tool-contrast': 50,
    'tool-window': 400,
    'tool-level': 40,
    'tool-opacity': 100
  };

  Object.keys(defaults).forEach(id => {
    const input = document.getElementById(id);
    const valDisplay = document.getElementById('val-' + id.replace('tool-', ''));
    if (input) input.value = defaults[id];
    if (valDisplay) valDisplay.textContent = defaults[id];
  });

  document.querySelectorAll('.ws-viewport img').forEach(img => {
    img.style.filter = 'none';
  });
}

/* ---- Export Action ---- */
function initExportAction() {
  const exportBtn = document.getElementById('btn-export-report');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      alert('Generating clinical report PDF for Ramesh Kumar (Lung_SBRT_v2)...');
    });
  }
}

/* ---- Preserved Legacy Handlers (Safely Handled) ---- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initSidebar() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function initKPIDashboard() {
  const sparklineData = {
    patients: [42, 38, 45, 52, 48, 55, 61, 58, 64, 67, 72, 78],
    images: [120, 135, 128, 142, 155, 148, 162, 170, 165, 178, 185, 192],
  };
  Object.keys(sparklineData).forEach(key => {
    const canvas = document.getElementById(`sparkline-${key}`);
    if (canvas && window.Charts) {
      Charts.drawSparkline(canvas, sparklineData[key], '#3B82F6');
    }
  });
}

function initUploadCenter() {}
function initViewerControls() {}
function initCopilotChat() {}
function initAnalytics() {}
function initRiskGauges() {}
function initExplainableAI() {}

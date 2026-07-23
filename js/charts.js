/* ============================================================
   AMAP Charts — Canvas-based sparklines, gauges, charts
   ============================================================ */

const Charts = (() => {
  // Color palette
  const COLORS = {
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    info: '#06B6D4',
    textDim: '#64748B',
    textMuted: '#94A3B8',
    border: 'rgba(148,163,184,0.10)',
    gridLine: 'rgba(148,163,184,0.08)',
  };

  /* ---- Sparkline ---- */
  function drawSparkline(canvas, data, color = COLORS.accent) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = w / (data.length - 1);

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // End dot
    const lastX = (data.length - 1) * stepX;
    const lastY = h - ((data[data.length - 1] - min) / range) * (h * 0.8) - h * 0.1;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /* ---- Doughnut Chart ---- */
  function drawDoughnut(canvas, data, colors, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 20;
    const innerRadius = radius * 0.62;
    const total = data.reduce((a, b) => a + b, 0);

    let currentAngle = -Math.PI / 2;
    data.forEach((value, i) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      const midAngle = currentAngle + sliceAngle / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      // Label
      if (labels && value / total > 0.08) {
        const labelR = radius + 16;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = COLORS.textMuted;
        ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], lx, ly);
      }

      currentAngle += sliceAngle;
    });

    // Center text
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString(), cx, cy - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = COLORS.textDim;
    ctx.fillText('Total', cx, cy + 14);
  }

  /* ---- Bar Chart ---- */
  function drawBarChart(canvas, data, labels, color = COLORS.accent) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.15;
    const barW = Math.min(cw / data.length * 0.55, 28);
    const gap = cw / data.length;

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + ch - (i / 4) * ch;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = COLORS.textDim;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round((max * i) / 4), padding.left - 8, y);
    }

    // Bars
    data.forEach((v, i) => {
      const x = padding.left + i * gap + gap / 2 - barW / 2;
      const barH = (v / max) * ch;
      const y = padding.top + ch - barH;
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '60');

      // Bar with rounded top
      ctx.beginPath();
      const r = Math.min(barW / 2, 6);
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // X labels
      if (labels) {
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = COLORS.textDim;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(labels[i], padding.left + i * gap + gap / 2, padding.top + ch + 8);
      }
    });
  }

  /* ---- Line Chart ---- */
  function drawLineChart(canvas, datasets, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    // Find global max
    let globalMax = 0;
    datasets.forEach(ds => {
      ds.data.forEach(v => { if (v > globalMax) globalMax = v; });
    });
    globalMax *= 1.1;

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + ch - (i / 4) * ch;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = COLORS.textDim;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round((globalMax * i) / 4), padding.left - 8, y);
    }

    // X labels
    if (labels) {
      const stepX = cw / (labels.length - 1);
      labels.forEach((label, i) => {
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = COLORS.textDim;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, padding.left + i * stepX, padding.top + ch + 8);
      });
    }

    // Lines
    datasets.forEach(ds => {
      const stepX = cw / (ds.data.length - 1);
      ctx.beginPath();
      ds.data.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + ch - (v / globalMax) * ch;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Dots
      ds.data.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + ch - (v / globalMax) * ch;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = ds.color;
        ctx.fill();
      });
    });
  }

  /* ---- Horizontal Bar Chart (Feature Importance) ---- */
  function drawHorizontalBar(canvas, data, labels, colors) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 20, bottom: 10, left: 120 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.1;
    const barH = Math.min(ch / data.length * 0.6, 18);
    const gap = ch / data.length;

    data.forEach((v, i) => {
      const y = padding.top + i * gap + gap / 2 - barH / 2;
      const barW = (v / max) * cw;
      const clr = colors ? colors[i] : COLORS.accent;

      // Label
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = COLORS.textMuted;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], padding.left - 12, y + barH / 2);

      // Bar
      const grad = ctx.createLinearGradient(padding.left, 0, padding.left + barW, 0);
      grad.addColorStop(0, clr + 'CC');
      grad.addColorStop(1, clr);

      ctx.beginPath();
      const r = Math.min(barH / 2, 6);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + barW - r, y);
      ctx.quadraticCurveTo(padding.left + barW, y, padding.left + barW, y + r);
      ctx.lineTo(padding.left + barW, y + barH - r);
      ctx.quadraticCurveTo(padding.left + barW, y + barH, padding.left + barW - r, y + barH);
      ctx.lineTo(padding.left, y + barH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Value
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'left';
      ctx.fillText((v * 100).toFixed(0) + '%', padding.left + barW + 8, y + barH / 2);
    });
  }

  /* ---- Confidence Distribution ---- */
  function drawConfidenceDistribution(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    // Generate gaussian-like distribution
    const bars = 20;
    const data = [];
    for (let i = 0; i < bars; i++) {
      const x = (i - bars * 0.75) / (bars * 0.15);
      data.push(Math.exp(-x * x / 2) * 100);
    }
    const max = Math.max(...data) * 1.15;
    const barW = cw / bars * 0.8;
    const gap = cw / bars;

    // Grid
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + ch - (i / 3) * ch;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    data.forEach((v, i) => {
      const x = padding.left + i * gap + gap / 2 - barW / 2;
      const barH = (v / max) * ch;
      const y = padding.top + ch - barH;
      const pct = i / bars;
      let clr;
      if (pct < 0.3) clr = COLORS.danger;
      else if (pct < 0.5) clr = COLORS.warning;
      else if (pct < 0.7) clr = COLORS.success;
      else clr = COLORS.accent;

      ctx.beginPath();
      const r = Math.min(barW / 2, 4);
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.closePath();
      ctx.fillStyle = clr + 'AA';
      ctx.fill();
    });

    // X labels
    const xlabels = ['0%', '25%', '50%', '75%', '100%'];
    xlabels.forEach((l, i) => {
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = COLORS.textDim;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(l, padding.left + (i / 4) * cw, padding.top + ch + 8);
    });
  }

  return {
    drawSparkline,
    drawDoughnut,
    drawBarChart,
    drawLineChart,
    drawHorizontalBar,
    drawConfidenceDistribution,
    COLORS,
  };
})();

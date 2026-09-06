/* ==========================================================================
   NEXVORA AI - Analytics Interactive Chart Module
   Lightweight SVG/Canvas interactive time-series chart with hover tooltips
   ========================================================================== */

(function() {
  'use strict';

  const chartDataSets = {
    weekly: [
      { day: "Mon", value: 12400, formatted: "12,400 tasks", efficiency: "+18%" },
      { day: "Tue", value: 16800, formatted: "16,800 tasks", efficiency: "+24%" },
      { day: "Wed", value: 21500, formatted: "21,500 tasks", efficiency: "+32%" },
      { day: "Thu", value: 19200, formatted: "19,200 tasks", efficiency: "+29%" },
      { day: "Fri", value: 26800, formatted: "26,800 tasks", efficiency: "+41%" },
      { day: "Sat", value: 14600, formatted: "14,600 tasks", efficiency: "+15%" },
      { day: "Sun", value: 18900, formatted: "18,900 tasks", efficiency: "+27%" }
    ],
    monthly: [
      { day: "Week 1", value: 72000, formatted: "72,000 tasks", efficiency: "+22%" },
      { day: "Week 2", value: 94000, formatted: "94,000 tasks", efficiency: "+31%" },
      { day: "Week 3", value: 118000, formatted: "118,000 tasks", efficiency: "+44%" },
      { day: "Week 4", value: 142000, formatted: "142,000 tasks", efficiency: "+56%" }
    ]
  };

  const chartSvg = document.getElementById('analytics-svg');
  const tooltip = document.getElementById('chart-tooltip');
  const timeBtns = document.querySelectorAll('.chart-time-btn');

  if (!chartSvg || !tooltip) return;

  let currentSet = 'weekly';
  renderChart(chartDataSets[currentSet]);

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const timeFrame = btn.getAttribute('data-time') || 'weekly';
      currentSet = timeFrame;
      renderChart(chartDataSets[currentSet] || chartDataSets.weekly);
    });
  });

  function renderChart(data) {
    const width = 600;
    const height = 200;
    const paddingX = 40;
    const paddingY = 30;

    const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
    const minVal = Math.min(...data.map(d => d.value)) * 0.85;

    const stepX = (width - paddingX * 2) / (data.length - 1);

    const points = data.map((d, i) => {
      const x = paddingX + i * stepX;
      const y = height - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
      return { x, y, data: d };
    });

    // Build SVG Path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Smooth cubic bezier curves
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    // Render SVG Inner Content
    chartSvg.innerHTML = `
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      </defs>

      <!-- Horizontal Grid Lines -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="${paddingX}" y1="${height / 2}" x2="${width - paddingX}" y2="${height / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(255,255,255,0.1)"/>

      <!-- Shaded Area -->
      <path d="${areaD}" fill="url(#chartGradient)"/>

      <!-- Glowing Line -->
      <path d="${pathD}" fill="none" stroke="url(#strokeGradient)" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Interactive Data Circles -->
      ${points.map((pt, idx) => `
        <circle 
          cx="${pt.x}" 
          cy="${pt.y}" 
          r="4.5" 
          fill="#060d21" 
          stroke="#38bdf8" 
          stroke-width="2.5" 
          class="chart-point"
          data-idx="${idx}"
        />
        <text 
          x="${pt.x}" 
          y="${height - 10}" 
          fill="#64748b" 
          font-size="11" 
          font-weight="500" 
          text-anchor="middle"
          font-family="Plus Jakarta Sans, sans-serif"
        >${pt.data.day}</text>
      `).join('')}
    `;

    // Tooltip listeners
    const pointElements = chartSvg.querySelectorAll('.chart-point');
    pointElements.forEach(ptEl => {
      ptEl.addEventListener('mouseenter', (e) => {
        const idx = parseInt(ptEl.getAttribute('data-idx'), 10);
        const pt = points[idx];
        const rect = chartSvg.getBoundingClientRect();

        tooltip.innerHTML = `<strong>${pt.data.day}</strong>: ${pt.data.formatted} <span style="color: #10b981;">(${pt.data.efficiency})</span>`;
        tooltip.style.left = `${(pt.x / width) * 100}%`;
        tooltip.style.top = `${(pt.y / height) * 100}%`;
        tooltip.classList.add('visible');
      });

      ptEl.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }
})();

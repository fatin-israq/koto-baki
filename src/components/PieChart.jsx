import React, { useState } from 'react';

/**
 * PieChart component for visualising ledger transaction breakdown
 * (Cash Sale vs Baki Given vs Baki Poroshod)
 */
export default function PieChart({ ledger = [], title = "লেনদেনের পাই চার্ট" }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Compute breakdown by type
  const totals = {
    sale: 0,
    baki: 0,
    poroshod: 0
  };

  const counts = {
    sale: 0,
    baki: 0,
    poroshod: 0
  };

  ledger.forEach((item) => {
    const amt = Number(item.amount) || 0;
    if (item.type === 'sale') {
      totals.sale += amt;
      counts.sale += 1;
    } else if (item.type === 'baki') {
      totals.baki += amt;
      counts.baki += 1;
    } else if (item.type === 'poroshod') {
      totals.poroshod += amt;
      counts.poroshod += 1;
    }
  });

  const slicesData = [
    {
      key: 'sale',
      label: 'ক্যাশ বিক্রি',
      value: totals.sale,
      count: counts.sale,
      color: '#1e8e3e', // Green
      hoverColor: '#137333'
    },
    {
      key: 'baki',
      label: 'বাকি দেওয়া',
      value: totals.baki,
      count: counts.baki,
      color: '#d93025', // Red
      hoverColor: '#a50e0e'
    },
    {
      key: 'poroshod',
      label: 'বাকি পরিশোধ',
      value: totals.poroshod,
      count: counts.poroshod,
      color: '#1a73e8', // Blue/Navy
      hoverColor: '#1557b0'
    }
  ];

  const grandTotal = slicesData.reduce((sum, s) => sum + s.value, 0);

  // Calculate slice angles
  let startAngle = 0;
  const slicesWithAngles = slicesData.map((slice) => {
    const percentage = grandTotal > 0 ? (slice.value / grandTotal) * 100 : 0;
    const angle = grandTotal > 0 ? (slice.value / grandTotal) * 360 : 0;
    const endAngle = startAngle + angle;
    const itemWithAngle = {
      ...slice,
      percentage,
      startAngle,
      endAngle
    };
    startAngle = endAngle;
    return itemWithAngle;
  });

  // SVG helper to create arc path
  const getArcPath = (start, end, radius = 40, cx = 50, cy = 50) => {
    // Convert angles from degrees to radians (-90deg offset so 0 is top)
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((end - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArcFlag = end - start > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  };

  const activeSlice = hoveredSlice !== null ? slicesWithAngles[hoveredSlice] : null;

  return (
    <div className="pie-chart-card">
      <div className="pie-chart-header">
        <h3 className="pie-chart-title">📊 {title}</h3>
        <span className="pie-chart-total-badge">মোট ৳{grandTotal.toLocaleString('bn-BD')}</span>
      </div>

      <div className="pie-chart-content">
        <div className="pie-svg-container">
          <svg viewBox="0 0 100 100" className="pie-svg">
            {grandTotal === 0 ? (
              <circle cx="50" cy="50" r="40" fill="#e0e0e0" />
            ) : (
              slicesWithAngles.map((slice, index) => {
                const angleSpan = slice.endAngle - slice.startAngle;
                if (angleSpan <= 0) return null;

                const isFullCircle = angleSpan >= 359.9;
                const isHovered = hoveredSlice === index;

                if (isFullCircle) {
                  return (
                    <circle
                      key={slice.key}
                      cx="50"
                      cy="50"
                      r={isHovered ? 42 : 40}
                      fill={isHovered ? slice.hoverColor : slice.color}
                      className="pie-slice"
                      onMouseEnter={() => setHoveredSlice(index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                }

                const pathData = getArcPath(slice.startAngle, slice.endAngle, isHovered ? 43 : 40);

                return (
                  <path
                    key={slice.key}
                    d={pathData}
                    fill={isHovered ? slice.hoverColor : slice.color}
                    className={`pie-slice ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })
            )}
            {/* Center Donut Hole */}
            <circle cx="50" cy="50" r="22" className="pie-donut-hole" />
            <text x="50" y="47" textAnchor="middle" className="pie-center-text-val">
              {activeSlice ? `৳${activeSlice.value}` : `৳${grandTotal}`}
            </text>
            <text x="50" y="56" textAnchor="middle" className="pie-center-text-lbl">
              {activeSlice ? activeSlice.label : 'মোট লেনদেন'}
            </text>
          </svg>
        </div>

        <div className="pie-legend">
          {slicesWithAngles.map((slice, index) => (
            <div
              key={slice.key}
              className={`legend-item ${hoveredSlice === index ? 'active' : ''}`}
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="legend-color-indicator" style={{ backgroundColor: slice.color }} />
              <div className="legend-info">
                <span className="legend-label">{slice.label}</span>
                <span className="legend-count">({slice.count}টি)</span>
              </div>
              <div className="legend-val-group">
                <span className="legend-val">৳{slice.value.toLocaleString('bn-BD')}</span>
                <span className="legend-pct">{slice.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

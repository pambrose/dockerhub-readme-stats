const { formatNumber, escapeXml, normalizeColor } = require("./utils");

function renderBadge(stats, options = {}) {
  const { label = "Docker Pulls", color, label_color, style = "flat" } = options;

  const valueColor = normalizeColor(color, "#066da5");
  const labelColor = normalizeColor(label_color, "#555555");

  const value = formatNumber(stats.pullCount);
  const labelText = escapeXml(label);

  const labelWidth = measureText(labelText) + 10;
  const valueWidth = measureText(value) + 10;
  const totalWidth = labelWidth + valueWidth;

  if (style === "for-the-badge") {
    return renderForTheBadge(labelText, value, labelWidth, valueWidth, totalWidth, labelColor, valueColor);
  }

  return renderFlat(labelText, value, labelWidth, valueWidth, totalWidth, labelColor, valueColor);
}

function measureText(text) {
  // Approximate character width for sans-serif at 11px
  return text.length * 6.8 + 10;
}

function renderFlat(label, value, labelWidth, valueWidth, totalWidth, labelColor, valueColor) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" viewBox="0 0 ${totalWidth} 20">
  <linearGradient id="smooth" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="round">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#round)">
    <rect width="${labelWidth}" height="20" fill="${labelColor}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${valueColor}"/>
    <rect width="${totalWidth}" height="20" fill="url(#smooth)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
    <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)">${label}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${value}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)">${value}</text>
  </g>
</svg>`.trim();
}

function renderForTheBadge(label, value, labelWidth, valueWidth, totalWidth, labelColor, valueColor) {
  const height = 28;
  const upperLabel = label.toUpperCase();
  const upperValue = value.toUpperCase();
  const ftbLabelWidth = labelWidth + 10;
  const ftbValueWidth = valueWidth + 10;
  const ftbTotal = ftbLabelWidth + ftbValueWidth;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${ftbTotal}" height="${height}" viewBox="0 0 ${ftbTotal} ${height}">
  <clipPath id="round">
    <rect width="${ftbTotal}" height="${height}" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#round)">
    <rect width="${ftbLabelWidth}" height="${height}" fill="${labelColor}"/>
    <rect x="${ftbLabelWidth}" width="${ftbValueWidth}" height="${height}" fill="${valueColor}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100">
    <text x="${(ftbLabelWidth / 2) * 10}" y="185" fill="#010101" fill-opacity=".3" transform="scale(.1)" font-weight="bold" textLength="${(ftbLabelWidth - 20) * 10}">${upperLabel}</text>
    <text x="${(ftbLabelWidth / 2) * 10}" y="175" transform="scale(.1)" font-weight="bold" textLength="${(ftbLabelWidth - 20) * 10}">${upperLabel}</text>
    <text x="${(ftbLabelWidth + ftbValueWidth / 2) * 10}" y="185" fill="#010101" fill-opacity=".3" transform="scale(.1)" font-weight="bold" textLength="${(ftbValueWidth - 20) * 10}">${upperValue}</text>
    <text x="${(ftbLabelWidth + ftbValueWidth / 2) * 10}" y="175" transform="scale(.1)" font-weight="bold" textLength="${(ftbValueWidth - 20) * 10}">${upperValue}</text>
  </g>
</svg>`.trim();
}

module.exports = { renderBadge };

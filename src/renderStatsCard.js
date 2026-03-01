const { themes } = require("./themes");
const { formatNumber, escapeXml, formatDate } = require("./utils");

const DOCKER_ICON = `<path fill="currentColor" d="M6.94 14.844h2.632v-2.38H6.94v2.38zm3.158 0h2.632v-2.38h-2.632v2.38zm0-2.907h2.632V9.556h-2.632v2.381zm3.158 2.907h2.632v-2.38h-2.632v2.38zm0-2.907h2.632V9.556h-2.632v2.381zm3.158 2.907h2.632v-2.38h-2.632v2.38zm0-2.907h2.632V9.556h-2.632v2.381zm-9.474-2.908h2.632V6.648H6.94v2.381zm3.158 0h2.632V6.648h-2.632v2.381zm3.158 0h2.632V6.648h-2.632v2.381zm3.158 0h2.632V6.648h-2.632v2.381zm3.158 2.908h2.632V9.556h-2.632v2.381zM27.35 13.1c-.592-.378-1.233-.567-1.651-.614.144-.473.18-.993.09-1.512-.297-1.704-1.58-3.063-2.345-3.751l-.315-.283-.31.29c-.815.763-1.435 1.822-1.588 2.9h-.937V6.648h-2.632V3.74h-2.632v2.907h-5.789V3.74H6.61V6.648H3.977v2.381H1.345v2.908H.5l-.06.506a10.18 10.18 0 0 0 .638 4.727c.578 1.397 1.473 2.42 2.66 3.04 1.33.695 3.5 1.09 5.918 1.09 1.1 0 2.235-.095 3.376-.284a13.41 13.41 0 0 0 3.878-1.322c1.09-.607 2.072-1.376 2.92-2.287a12.517 12.517 0 0 0 2.163-3.2h.189c1.173 0 1.899-.473 2.327-.867.284-.26.503-.57.658-.916l.09-.265-.257-.165z"/>`;

const DOWNLOAD_ICON = `<path fill="currentColor" d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/>`;
const STAR_ICON = `<path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`;
const CLOCK_ICON = `<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>`;

function renderStatsCard(stats, options = {}) {
  const {
    theme: themeName = "default",
    title_color,
    text_color,
    icon_color,
    bg_color,
    border_color,
    hide_border = false,
    hide_title = false,
    hide = "",
    custom_title,
    border_radius = 4.5,
    width = 400,
  } = options;

  const theme = themes[themeName] || themes.default;

  const colors = {
    titleColor: `#${title_color || theme.titleColor.replace("#", "")}`,
    textColor: `#${text_color || theme.textColor.replace("#", "")}`,
    iconColor: `#${icon_color || theme.iconColor.replace("#", "")}`,
    bgColor: `#${bg_color || theme.bgColor.replace("#", "")}`,
    borderColor: `#${border_color || theme.borderColor.replace("#", "")}`,
  };

  const hiddenStats = hide.split(",").map((s) => s.trim().toLowerCase());

  const title = escapeXml(
    custom_title || `${stats.fullName} Stats`
  );

  const statItems = [];

  if (!hiddenStats.includes("pulls")) {
    statItems.push({
      icon: DOWNLOAD_ICON,
      label: "Total Pulls",
      value: formatNumber(stats.pullCount),
    });
  }

  if (!hiddenStats.includes("stars")) {
    statItems.push({
      icon: STAR_ICON,
      label: "Stars",
      value: formatNumber(stats.starCount),
    });
  }

  if (!hiddenStats.includes("updated")) {
    statItems.push({
      icon: CLOCK_ICON,
      label: "Last Updated",
      value: formatDate(stats.lastUpdated),
    });
  }

  const titleHeight = hide_title ? 0 : 30;
  const headerHeight = 45;
  const lineHeight = 30;
  const padding = 20;
  const height =
    headerHeight + titleHeight + statItems.length * lineHeight + padding;

  const statsContent = statItems
    .map((item, index) => {
      const y = titleHeight + 45 + index * lineHeight;
      return `
      <g transform="translate(25, ${y})">
        <svg viewBox="0 0 24 24" width="16" height="16" color="${colors.iconColor}">
          ${item.icon}
        </svg>
        <text x="26" y="12.5" fill="${colors.textColor}" font-size="14" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif">
          ${escapeXml(item.label)}:
        </text>
        <text x="${width - 55}" y="12.5" fill="${colors.textColor}" font-size="14" font-weight="bold" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" text-anchor="end">
          ${escapeXml(item.value)}
        </text>
      </g>`;
    })
    .join("");

  const titleSection = hide_title
    ? ""
    : `
    <g transform="translate(25, 35)">
      <svg viewBox="0 0 28 24" width="20" height="20" color="${colors.iconColor}">
        ${DOCKER_ICON}
      </svg>
      <text x="28" y="15" fill="${colors.titleColor}" font-size="16" font-weight="600" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif">
        ${title}
      </text>
    </g>`;

  const borderStyle = hide_border
    ? ""
    : `stroke="${colors.borderColor}" stroke-width="1" stroke-opacity="1"`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif; fill: ${colors.titleColor}; animation: fadeInAnimation 0.8s ease-in-out forwards; }
    @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
  </style>
  <rect x="0.5" y="0.5" rx="${border_radius}" height="99%" width="99%" fill="${colors.bgColor}" ${borderStyle}/>
  ${titleSection}
  ${statsContent}
</svg>
`.trim();
}

module.exports = { renderStatsCard };

const { fetchStats } = require("../src/fetchStats");
const { renderStatsCard } = require("../src/renderStatsCard");
const { parseBoolean, escapeXml } = require("../src/utils");

module.exports = async (req, res) => {
  const {
    image,
    theme,
    title_color,
    text_color,
    icon_color,
    bg_color,
    border_color,
    hide_border,
    hide_title,
    hide,
    custom_title,
    border_radius,
    cache_seconds,
    width,
    label,
  } = req.query;

  try {
    if (!image) {
      return res
        .status(400)
        .send("Missing required query parameter: ?image=namespace/repository");
    }

    const stats = await fetchStats(image);

    const cacheSeconds = Math.max(
      1800,
      Math.min(parseInt(cache_seconds) || 1800, 86400)
    );

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", `public, max-age=${cacheSeconds}`);

    const svg = renderStatsCard(stats, {
      theme,
      title_color,
      text_color,
      icon_color,
      bg_color,
      border_color,
      hide_border: parseBoolean(hide_border),
      hide_title: parseBoolean(hide_title),
      hide,
      custom_title,
      border_radius: parseFloat(border_radius) || 4.5,
      width: parseInt(width) || 400,
      label,
    });

    return res.send(svg);
  } catch (error) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const errorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120" fill="none">
  <rect x="0.5" y="0.5" rx="4.5" height="99%" width="99%" fill="#fffbeb" stroke="#f59e0b" stroke-width="1"/>
  <text x="200" y="45" fill="#92400e" font-size="14" font-weight="600" font-family="'Segoe UI', sans-serif" text-anchor="middle">Error fetching Docker Hub stats</text>
  <text x="200" y="75" fill="#92400e" font-size="12" font-family="'Segoe UI', sans-serif" text-anchor="middle">${escapeXml(error.message)}</text>
</svg>`.trim();

    return res.send(errorSvg);
  }
};

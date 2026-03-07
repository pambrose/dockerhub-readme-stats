const { fetchStats } = require("../src/fetchStats");
const { renderBadge } = require("../src/renderBadge");
const { escapeXml } = require("../src/utils");

module.exports = async (req, res) => {
  const {
    image,
    label,
    color,
    label_color,
    style,
    type,
    cache_seconds,
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

    // type=stars to show star count instead of pulls
    const badgeLabel =
      label || (type === "stars" ? "Docker Stars" : "Docker Pulls");

    const badgeStats =
      type === "stars" ? { pullCount: stats.starCount } : stats;

    const svg = renderBadge(badgeStats, {
      label: badgeLabel,
      color,
      label_color,
      style,
    });

    return res.send(svg);
  } catch (error) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><text x="5" y="14" font-size="11" font-family="Verdana">Error: ${escapeXml(error.message)}</text></svg>`
    );
  }
};

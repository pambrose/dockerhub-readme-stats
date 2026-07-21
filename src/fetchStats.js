const axios = require("axios");

const DOCKERHUB_API = "https://hub.docker.com/v2/repositories";

// Version-looking tags only: 1.31.3, 18.4, v3.7.8. Deliberately excludes
// prereleases like 19beta2 and 2.0.0-rc1, which must never win.
const VERSION_TAG = /^v?\d+(\.\d+)+$/;

// Normalize: "nginx" -> "library/nginx", "user/repo" stays as-is
function normalizeImage(image) {
  const normalizedImage = image.includes("/") ? image : `library/${image}`;
  const [namespace, repository] = normalizedImage.split("/");
  return { normalizedImage, namespace, repository };
}

async function fetchStats(image) {
  if (!image) {
    throw new Error("Image parameter is required");
  }

  const { normalizedImage, namespace, repository } = normalizeImage(image);

  const url = `${DOCKERHUB_API}/${namespace}/${repository}/`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    return {
      name: data.name,
      namespace: data.namespace,
      fullName: `${data.namespace}/${data.name}`,
      description: data.description || "",
      pullCount: data.pull_count || 0,
      starCount: data.star_count || 0,
      lastUpdated: data.last_updated || null,
      isOfficial: data.namespace === "library",
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Image not found: ${normalizedImage}`);
    }
    throw new Error(`Failed to fetch stats for ${normalizedImage}: ${error.message}`);
  }
}

/**
 * Best-effort lookup of the version `:latest` currently points to.
 *
 * Resolves by digest rather than by picking the highest version number:
 * "highest number" gets postgres wrong (its release tags are two-part, and
 * the 19beta2 prerelease would win) and invents a version for repos that
 * never tagged one. Matching latest's digest answers the narrower, correct
 * question — which version tag is an alias of what :latest serves.
 *
 * Returns null rather than throwing. The version is decorative; a card that
 * renders without it is fine, a card that 500s is not.
 */
async function fetchLatestVersion(image) {
  if (!image) return null;

  const { namespace, repository } = normalizeImage(image);
  const url = `${DOCKERHUB_API}/${namespace}/${repository}/tags/?page_size=100&ordering=last_updated`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const tags = (response.data && response.data.results) || [];

    const latest = tags.find((tag) => tag.name === "latest");
    if (!latest || !latest.digest) return null;

    const versions = tags
      .filter(
        (tag) =>
          tag.name !== "latest" &&
          tag.digest === latest.digest &&
          VERSION_TAG.test(tag.name)
      )
      .map((tag) => tag.name)
      // Prefer the most specific alias: 1.31.3 over 1.31 over 1
      .sort((a, b) => b.split(".").length - a.split(".").length);

    return versions[0] || null;
  } catch (error) {
    return null;
  }
}

module.exports = { fetchStats, fetchLatestVersion, DOCKERHUB_API };

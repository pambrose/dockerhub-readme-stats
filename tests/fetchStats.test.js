const axios = require("axios");
const { fetchStats, fetchLatestVersion } = require("../src/fetchStats");

jest.mock("axios");

describe("fetchStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches stats for namespaced image", async () => {
    axios.get.mockResolvedValue({
      data: {
        name: "nginx",
        namespace: "library",
        description: "Official Nginx image",
        pull_count: 1000000000,
        star_count: 1500,
        last_updated: "2024-01-15T10:30:00Z",
      },
    });

    const stats = await fetchStats("library/nginx");

    expect(axios.get).toHaveBeenCalledWith(
      "https://hub.docker.com/v2/repositories/library/nginx/",
      { timeout: 5000 }
    );
    expect(stats).toEqual({
      name: "nginx",
      namespace: "library",
      fullName: "library/nginx",
      description: "Official Nginx image",
      pullCount: 1000000000,
      starCount: 1500,
      lastUpdated: "2024-01-15T10:30:00Z",
      isOfficial: true,
    });
  });

  test("auto-prefixes library/ for short image names", async () => {
    axios.get.mockResolvedValue({
      data: {
        name: "nginx",
        namespace: "library",
        description: "",
        pull_count: 500,
        star_count: 10,
        last_updated: null,
      },
    });

    await fetchStats("nginx");

    expect(axios.get).toHaveBeenCalledWith(
      "https://hub.docker.com/v2/repositories/library/nginx/",
      { timeout: 5000 }
    );
  });

  test("throws error when image is not found", async () => {
    axios.get.mockRejectedValue({
      response: { status: 404 },
    });

    await expect(fetchStats("nonexistent/image")).rejects.toThrow(
      "Image not found: nonexistent/image"
    );
  });

  test("throws error when image param is missing", async () => {
    await expect(fetchStats()).rejects.toThrow("Image parameter is required");
    await expect(fetchStats("")).rejects.toThrow("Image parameter is required");
  });

  test("throws error on network failure", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchStats("library/nginx")).rejects.toThrow(
      "Failed to fetch stats for library/nginx"
    );
  });
});

describe("fetchLatestVersion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tagsResponse = (results) => ({ data: { results } });

  test("returns the version tag sharing the digest of :latest", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:aaa" },
        { name: "1.31.3", digest: "sha256:aaa" },
        { name: "1.30.4", digest: "sha256:bbb" },
      ])
    );

    await expect(fetchLatestVersion("library/nginx")).resolves.toBe("1.31.3");
    expect(axios.get).toHaveBeenCalledWith(
      "https://hub.docker.com/v2/repositories/library/nginx/tags/?page_size=100&ordering=last_updated",
      { timeout: 5000 }
    );
  });

  test("prefers the most specific alias", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:aaa" },
        { name: "1", digest: "sha256:aaa" },
        { name: "1.31", digest: "sha256:aaa" },
        { name: "1.31.3", digest: "sha256:aaa" },
      ])
    );

    await expect(fetchLatestVersion("nginx")).resolves.toBe("1.31.3");
  });

  test("accepts two-part and v-prefixed versions", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:aaa" },
        { name: "18.4", digest: "sha256:aaa" },
      ])
    );
    await expect(fetchLatestVersion("postgres")).resolves.toBe("18.4");

    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:ccc" },
        { name: "v3.7.8", digest: "sha256:ccc" },
      ])
    );
    await expect(fetchLatestVersion("traefik")).resolves.toBe("v3.7.8");
  });

  test("ignores prerelease tags", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:aaa" },
        { name: "19beta2", digest: "sha256:aaa" },
        { name: "2.0.0-rc1", digest: "sha256:aaa" },
      ])
    );

    await expect(fetchLatestVersion("postgres")).resolves.toBeNull();
  });

  test("returns null when the repo has no :latest tag", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([{ name: "3.9.0", digest: "sha256:aaa" }])
    );

    await expect(fetchLatestVersion("bitnami/kafka")).resolves.toBeNull();
  });

  test("returns null when no version tag aliases :latest", async () => {
    axios.get.mockResolvedValue(
      tagsResponse([
        { name: "latest", digest: "sha256:aaa" },
        { name: "nanoserver-ltsc2025", digest: "sha256:aaa" },
      ])
    );

    await expect(fetchLatestVersion("hello-world")).resolves.toBeNull();
  });

  test("returns null instead of throwing when the tags API fails", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchLatestVersion("library/nginx")).resolves.toBeNull();
  });

  test("returns null when no image is given", async () => {
    await expect(fetchLatestVersion()).resolves.toBeNull();
    expect(axios.get).not.toHaveBeenCalled();
  });
});

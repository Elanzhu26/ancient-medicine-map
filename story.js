(function () {
  const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  const CHAPTER_ORDER = ["greece", "egypt", "arab", "india", "china", "maya"];
  const REGION_COUNTRIES = {
    greece: [300],
    egypt: [818],
    arab: [682, 784, 368, 760, 400],
    india: [356],
    china: [156],
    maya: [484, 320, 340]
  };
  const REGION_TINTS = {
    greece: "#536b78",
    egypt: "#b8955f",
    arab: "#63806b",
    india: "#b77a55",
    china: "#9a615d",
    maya: "#7b6685"
  };
  const FALLBACK_CONTINENTS = [
    "M154 98c45-38 112-44 164-20 33 15 47 42 37 71-8 25-34 37-55 52-22 16-28 38-23 65 7 39-18 76-58 81-45 6-74-24-90-60-14-31-45-48-62-76-22-37 11-83 87-113z",
    "M241 285c25 17 51 47 54 82 3 38-21 73-42 102-27-27-48-70-47-109 0-31 13-56 35-75z",
    "M428 106c39-20 103-25 150-15 41 8 56 34 38 62-16 24-58 19-82 39-28 22-10 55-23 85-12 28-50 34-79 21-25-11-38-36-33-63 5-29-25-48-20-79 3-20 20-36 49-50z",
    "M504 224c34-11 71 6 90 39 22 38 15 96-16 136-31 39-81 43-108 8-24-31-18-78-2-111 12-26 10-58 36-72z",
    "M574 121c62-41 181-35 270 13 49 26 68 64 42 91-28 30-87 17-128 35-43 19-45 61-86 77-47 19-95-10-103-57-6-37-45-58-48-94-2-25 17-47 53-65z",
    "M791 318c35-17 91-2 117 31 25 32 6 67-30 68-41 1-75-31-93-67-7-13-5-25 6-32z"
  ];

  const regions = defaultRegions();
  const chaptersEl = document.querySelector("#storyChapters");
  const countryLayer = document.querySelector("#storyCountryLayer");
  const markerLayer = document.querySelector("#storyMarkerLayer");
  const mapLabel = document.querySelector("#storyMapLabel");
  const sphere = document.querySelector("#storySphere");
  const graticule = document.querySelector("#storyGraticule");
  let projection = null;
  let path = null;
  let countryPaths = [];

  function trackStoryEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  if (!chaptersEl || !countryLayer || !markerLayer) return;

  renderChapters();
  renderStoryMap().then(() => activateRegion(CHAPTER_ORDER[0]));
  observeChapters();

  function defaultRegions() {
    if (typeof REGIONS !== "undefined") return REGIONS;
    return window.REGIONS || {};
  }

  function renderChapters() {
    chaptersEl.innerHTML = CHAPTER_ORDER.map((regionId, index) => {
      const region = regions[regionId];
      if (!region) return "";
      const firstPractice = region.practices[0] || {};
      const tags = region.practices
        .slice(0, 5)
        .map((practice) => `<span class="story-tag">● ${escapeHtml(practice.title)}</span>`)
        .join("");
      const chapterClass = index % 2 === 1 ? "story-chapter chapter-even" : "story-chapter";

      return `
        <article class="${chapterClass}" data-region="${regionId}" style="--story-tint: ${REGION_TINTS[regionId]};">
          <div class="story-chapter-bg"></div>
          <div class="story-chapter-inner">
            <div class="story-copy">
              <h2>${escapeHtml(region.name)}</h2>
              <div class="story-rule" aria-hidden="true"></div>
              <p class="story-era">Civilization · ${escapeHtml(firstPractice.timePeriod || "Ancient period")}</p>
              <p class="story-intro">${escapeHtml(truncate(firstPractice.ancientUse || "", 150))}</p>
              <div class="story-tags">${tags}</div>
              <button class="story-explore" type="button" data-region="${regionId}">Explore this region →</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".story-explore").forEach((button) => {
      button.addEventListener("click", () => exploreRegion(button.dataset.region));
    });
  }

  async function renderStoryMap() {
    configureProjection();
    if (!window.d3 || !window.topojson || !path) {
      renderFallbackMap();
      return;
    }

    sphere.setAttribute("d", path({ type: "Sphere" }));
    graticule.setAttribute("d", path(d3.geoGraticule10()));

    try {
      const atlas = await d3.json(WORLD_ATLAS_URL);
      const countries = topojson.feature(atlas, atlas.objects.countries).features;
      countryLayer.innerHTML = "";
      countryPaths = countries.map((country) => {
        const countryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        countryPath.setAttribute("d", path(country));
        countryPath.dataset.countryId = Number(country.id);
        countryLayer.appendChild(countryPath);
        return countryPath;
      });
    } catch (error) {
      console.warn("Story map could not load world-atlas data.", error);
      renderFallbackMap();
    }
  }

  function configureProjection() {
    if (!window.d3) return;
    projection = d3
      .geoNaturalEarth1()
      .fitExtent(
        [
          [35, 50],
          [965, 450]
        ],
        { type: "Sphere" }
      );
    path = d3.geoPath(projection);
  }

  function renderFallbackMap() {
    projection = null;
    path = null;
    sphere.setAttribute("d", "");
    graticule.setAttribute("d", "M0 125H1000M0 250H1000M0 375H1000M250 0V500M500 0V500M750 0V500");
    countryLayer.innerHTML = "";
    countryPaths = FALLBACK_CONTINENTS.map((continentPath) => {
      const fallbackPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      fallbackPath.setAttribute("d", continentPath);
      countryLayer.appendChild(fallbackPath);
      return fallbackPath;
    });
  }

  function observeChapters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activateRegion(entry.target.dataset.region);
        entry.target.classList.add("story-active");
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".story-chapter").forEach((chapter) => observer.observe(chapter));
  }

  function activateRegion(regionId) {
    const region = regions[regionId];
    if (!region) return;
    const countryIds = REGION_COUNTRIES[regionId] || [];

    countryPaths.forEach((countryPath) => {
      const isActive = countryIds.includes(Number(countryPath.dataset.countryId));
      countryPath.classList.toggle("story-country-active", isActive);
    });

    markerLayer.innerHTML = "";
    const point = project(region.coordinates || { lat: 0, lng: 0 });
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
    marker.classList.add("story-map-marker");
    marker.style.setProperty("--story-marker-color", region.color || "#c9a84c");
    marker.innerHTML = `
      <circle class="story-map-marker-ring" cx="${point.x}" cy="${point.y}" r="18"></circle>
      <circle class="story-map-marker-dot" cx="${point.x}" cy="${point.y}" r="8"></circle>
    `;
    markerLayer.appendChild(marker);
    mapLabel.textContent = region.name;
  }

  function project({ lat, lng }) {
    if (projection) {
      const point = projection([Number(lng), Number(lat)]);
      if (point) return { x: point[0], y: point[1] };
    }
    return {
      x: ((Number(lng) + 180) / 360) * 1000,
      y: ((90 - Number(lat)) / 180) * 500
    };
  }

  function exploreRegion(regionId) {
    trackStoryEvent("explore_click", { region_name: regionId });
    document.querySelector(".site-header").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const marker = document.querySelector(`.marker[data-region="${regionId}"]`);
      if (marker) marker.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    }, 700);
  }

  function truncate(value, maxLength) {
    return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();

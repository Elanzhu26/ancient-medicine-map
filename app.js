(async function () {
  const STORAGE_KEY = "ancientMedicineData";
  const DB_NAME = "ancientMedicineMapDb";
  const DB_STORE = "entries";
  const DB_KEY = "regions";
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 500;
  const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  const IMAGE_SOURCE_TEXT = "Wikimedia Commons";
  const IS_ADMIN = new URLSearchParams(window.location.search).get("admin") === "true";
  const IMAGE_SOURCE_OVERRIDES = {
    siddha: "Indian Systems of Medicine",
    unani: "NCISM ELECTIVES",
    "egyptian-dental": "Historicaleve -",
    enkoimesis: "SARAH JANES - Medium",
    "maya-dentistry": "La Brújula Verde",
    "maya-psychiatry": "ResearchGate"
  };
  const REGION_COUNTRIES = {
    greece: [300],
    egypt: [818],
    arab: [682, 784, 368, 760, 400],
    india: [356],
    china: [156],
    maya: [484, 320, 340]
  };
  const REGION_MORANDI_COLORS = {
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
  const regionFields = [
    { name: "name", label: "Region Name", type: "text", required: true },
    { name: "color", label: "Marker Color", type: "color", required: true },
    { name: "lat", label: "Latitude", type: "number", required: true, step: "0.01" },
    { name: "lng", label: "Longitude", type: "number", required: true, step: "0.01" }
  ];
  const practiceFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "timePeriod", label: "Time Period", type: "text" },
    { name: "ancientUse", label: "Ancient Use", type: "textarea" },
    { name: "historicalContext", label: "Historical Context", type: "textarea" },
    { name: "modernEvaluation", label: "Modern Evaluation", type: "textarea" },
    { name: "stillUsed", label: "Still Used Today?", type: "textarea" },
    { name: "limitation", label: "Limitations", type: "textarea" },
    { name: "notUsed", label: "No Longer Used Because", type: "textarea" },
    { name: "imageUrl", label: "Image URL", type: "url" },
    { name: "source", label: "Source", type: "url" }
  ];

  const els = {
    countryLayer: document.querySelector("#countryLayer"),
    graticulePath: document.querySelector("#graticulePath"),
    atlasShell: document.querySelector(".atlas-shell"),
    markerLayer: document.querySelector("#markerLayer"),
    spherePath: document.querySelector("#spherePath"),
    worldMap: document.querySelector("#worldMap"),
    sidebar: document.querySelector("#sidebar"),
    sidebarHeader: document.querySelector(".sidebar-header"),
    sidebarBgInput: document.querySelector("#sidebarBgInput"),
    regionTitle: document.querySelector("#regionTitle"),
    regionSubtitle: document.querySelector("#regionSubtitle"),
    practiceList: document.querySelector("#practiceList"),
    closeSidebar: document.querySelector("#closeSidebar"),
    goBackStoryButton: document.querySelector("#goBackStoryButton"),
    addPracticeButton: document.querySelector("#addPracticeButton"),
    addRegionButton: document.querySelector("#addRegionButton"),
    resetDataButton: document.querySelector("#resetDataButton"),
    formModal: document.querySelector("#formModal"),
    modalTitle: document.querySelector("#modalTitle"),
    closeModal: document.querySelector("#closeModal"),
    cancelForm: document.querySelector("#cancelForm"),
    entryForm: document.querySelector("#entryForm"),
    formFields: document.querySelector("#formFields")
  };

  let data = {};
  let activeRegionId = null;
  let formMode = null;
  let mapProjection = null;
  let geoPath = null;
  let mapCountries = [];
  let currentRotation = [0, 0, 0];
  let rotationFrame = 0;
  let isFocusedGlobe = false;

  document.body.classList.toggle("admin-mode", IS_ADMIN);
  document.querySelectorAll(".admin-only").forEach((element) => {
    element.hidden = !IS_ADMIN;
  });

  function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultRegions() {
    if (typeof REGIONS !== "undefined") return REGIONS;
    return window.REGIONS || {};
  }

  async function loadData() {
    const saved = (await readIndexedData()) || readStoredData();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          migrateApitherapyToEgypt(parsed);
          normalizeImageSources(parsed);
          mergeDefaultImages(parsed);
          return parsed;
        }
      } catch (error) {
        console.warn("Saved ancient medicine data could not be parsed.", error);
      }
    }
    const defaults = clone(defaultRegions());
    migrateApitherapyToEgypt(defaults);
    normalizeImageSources(defaults);
    return defaults;
  }

  function mergeDefaultImages(targetData) {
    const defaults = defaultRegions();
    Object.entries(defaults).forEach(([regionId, defaultRegion]) => {
      const targetRegion = targetData[regionId];
      if (!targetRegion || !Array.isArray(targetRegion.practices)) return;

      defaultRegion.practices.forEach((defaultPractice) => {
        if (!defaultPractice.image) return;
        const targetPractice = targetRegion.practices.find((practice) => practice.id === defaultPractice.id);
        if (targetPractice) targetPractice.image = defaultPractice.image;
      });
    });
  }

  async function saveData() {
    const serialized = JSON.stringify(data);
    let saved = false;
    try {
      await writeIndexedData(serialized);
      saved = true;
    } catch (error) {
      console.warn("IndexedDB storage is unavailable in this view.", error);
    }

    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      saved = true;
    } catch (error) {
      console.warn("Browser storage is unavailable, so edits will not persist in this view.", error);
    }
    return saved;
  }

  function readStoredData() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Browser storage is unavailable in this view.", error);
      return null;
    }
  }

  async function clearStoredData() {
    try {
      await deleteIndexedData();
    } catch (error) {
      console.warn("IndexedDB storage is unavailable in this view.", error);
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Browser storage is unavailable in this view.", error);
    }
  }

  function openStorageDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is not available."));
        return;
      }

      const request = indexedDB.open(DB_NAME, 1);
      request.addEventListener("upgradeneeded", () => {
        request.result.createObjectStore(DB_STORE);
      });
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async function readIndexedData() {
    const db = await openStorageDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readonly");
      const store = transaction.objectStore(DB_STORE);
      const request = store.get(DB_KEY);
      request.addEventListener("success", () => resolve(request.result || null));
      request.addEventListener("error", () => reject(request.error));
      transaction.addEventListener("complete", () => db.close());
    });
  }

  async function writeIndexedData(value) {
    const db = await openStorageDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      const store = transaction.objectStore(DB_STORE);
      const request = store.put(value, DB_KEY);
      request.addEventListener("success", () => resolve(true));
      request.addEventListener("error", () => reject(request.error));
      transaction.addEventListener("complete", () => db.close());
    });
  }

  async function deleteIndexedData() {
    const db = await openStorageDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      const store = transaction.objectStore(DB_STORE);
      const request = store.delete(DB_KEY);
      request.addEventListener("success", () => resolve(true));
      request.addEventListener("error", () => reject(request.error));
      transaction.addEventListener("complete", () => db.close());
    });
  }

  function normalizeImageSources(regions) {
    Object.values(regions).forEach((region) => {
      (region.practices || []).forEach((practice) => {
        practice.imageSource = imageSourceFor(practice);
      });
    });
  }

  function migrateApitherapyToEgypt(regions) {
    const arabPractices = regions.arab?.practices || [];
    const egyptPractices = regions.egypt?.practices || [];
    const arabHoneyIndex = arabPractices.findIndex((practice) => practice.id === "honey");
    const egyptHoneyIndex = egyptPractices.findIndex((practice) => practice.id === "honey");

    if (arabHoneyIndex === -1) return;

    const [honeyPractice] = arabPractices.splice(arabHoneyIndex, 1);
    if (egyptHoneyIndex === -1) {
      egyptPractices.push(honeyPractice);
      return;
    }

    const egyptHoney = egyptPractices[egyptHoneyIndex];
    egyptPractices[egyptHoneyIndex] = {
      ...honeyPractice,
      ...egyptHoney,
      image: egyptHoney.image || honeyPractice.image,
      imageSource: egyptHoney.imageSource || honeyPractice.imageSource,
      sidebarBackground: egyptHoney.sidebarBackground || honeyPractice.sidebarBackground
    };
  }

  function slugify(value) {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return slug || `entry-${Date.now()}`;
  }

  function uniqueKey(base, collection) {
    let key = base;
    let index = 2;
    while (collection[key]) {
      key = `${base}-${index}`;
      index += 1;
    }
    return key;
  }

  function configureProjection() {
    if (!window.d3) return;
    isFocusedGlobe = false;
    currentRotation = [0, 0, 0];
    mapProjection = d3
      .geoNaturalEarth1()
      .fitExtent(
        [
          [28, 24],
          [MAP_WIDTH - 28, MAP_HEIGHT - 24]
        ],
        { type: "Sphere" }
      );
    mapProjection.rotate(currentRotation);
    geoPath = d3.geoPath(mapProjection);
  }

  async function renderWorldMap() {
    configureProjection();
    if (!window.d3 || !window.topojson || !geoPath) {
      renderFallbackMap();
      renderMarkers();
      return;
    }

    els.spherePath.setAttribute("d", geoPath({ type: "Sphere" }));
    els.graticulePath.setAttribute("d", geoPath(d3.geoGraticule10()));

    try {
      const atlas = await d3.json(WORLD_ATLAS_URL);
      mapCountries = topojson.feature(atlas, atlas.objects.countries).features;
      els.countryLayer.innerHTML = "";
      mapCountries.forEach((country) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", geoPath(country));
        path.setAttribute("data-country-id", country.id || "");
        const regionId = regionIdForCountry(country.id);
        if (regionId && data[regionId]) {
          path.classList.add("region-country-fill");
          path.style.fill = mixWithWhite(data[regionId].color || "#c9a84c", 0.72);
        }
        els.countryLayer.appendChild(path);
      });
    } catch (error) {
      console.warn("Unable to load world-atlas country data.", error);
      renderFallbackMap();
    }

    renderMarkers();
  }

  function redrawProjectedMap() {
    if (!geoPath) return;
    els.spherePath.setAttribute("d", geoPath({ type: "Sphere" }));
    els.graticulePath.setAttribute("d", geoPath(d3.geoGraticule10()));
    Array.from(els.countryLayer.children).forEach((countryPath, index) => {
      if (mapCountries[index]) countryPath.setAttribute("d", geoPath(mapCountries[index]));
    });
    renderMarkers();
  }

  function rotateMapToRegion(regionId) {
    if (!mapProjection || !geoPath || !data[regionId]) return;
    const { lng, lat } = data[regionId].coordinates || { lat: 0, lng: 0 };
    isFocusedGlobe = true;
    const start = currentRotation.slice();
    const target = [-Number(lng), -Number(lat), 0];
    const startScale = 260;
    const targetScale = 760;
    const targetTranslate = [330, MAP_HEIGHT / 2];
    const duration = 760;
    const startedAt = performance.now();

    cancelAnimationFrame(rotationFrame);
    els.worldMap.classList.add("map-rotating");
    els.worldMap.classList.add("map-globe-focused");
    mapProjection = d3
      .geoOrthographic()
      .clipAngle(90)
      .precision(0.35)
      .scale(startScale)
      .translate(targetTranslate)
      .rotate(start);
    geoPath = d3.geoPath(mapProjection);

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOutCubic(progress);
      currentRotation = start.map((value, index) => value + (target[index] - value) * eased);
      mapProjection.rotate(currentRotation);
      mapProjection.scale(startScale + (targetScale - startScale) * eased);
      redrawProjectedMap();
      if (progress < 1) {
        rotationFrame = requestAnimationFrame(animate);
      } else {
        els.worldMap.classList.remove("map-rotating");
      }
    };

    rotationFrame = requestAnimationFrame(animate);
  }

  function resetMapRotation() {
    if (!mapProjection || !geoPath) return;
    const start = currentRotation.slice();
    const target = [0, 0, 0];
    const startScale = isFocusedGlobe && mapProjection.scale ? mapProjection.scale() : 760;
    const targetScale = 260;
    const duration = 520;
    const startedAt = performance.now();

    cancelAnimationFrame(rotationFrame);
    els.worldMap.classList.add("map-rotating");

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOutCubic(progress);
      currentRotation = start.map((value, index) => value + (target[index] - value) * eased);
      mapProjection.rotate(currentRotation);
      if (isFocusedGlobe && mapProjection.scale) {
        mapProjection.scale(startScale + (targetScale - startScale) * eased);
      }
      redrawProjectedMap();
      if (progress < 1) {
        rotationFrame = requestAnimationFrame(animate);
      } else {
        els.worldMap.classList.remove("map-globe-focused");
        els.worldMap.classList.remove("map-rotating");
        configureProjection();
        redrawProjectedMap();
      }
    };

    rotationFrame = requestAnimationFrame(animate);
  }

  function easeInOutCubic(value) {
    return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function renderFallbackMap() {
    mapProjection = null;
    geoPath = null;
    els.spherePath.setAttribute("d", "");
    els.graticulePath.setAttribute("d", "M0 125H1000M0 250H1000M0 375H1000M250 0V500M500 0V500M750 0V500");
    els.countryLayer.innerHTML = "";
    FALLBACK_CONTINENTS.forEach((continentPath) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", continentPath);
      path.setAttribute("class", "fallback-continent");
      els.countryLayer.appendChild(path);
    });
  }

  function regionIdForCountry(countryId) {
    const id = Number(countryId);
    return Object.entries(REGION_COUNTRIES).find(([, ids]) => ids.includes(id))?.[0] || "";
  }

  function mixWithWhite(hex, whiteRatio) {
    const normalized = hex.replace("#", "");
    const value = normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized;
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    const mix = (channel) => Math.round(channel * (1 - whiteRatio) + 255 * whiteRatio);
    return `rgb(${mix(red)}, ${mix(green)}, ${mix(blue)})`;
  }

  function project({ lat, lng }) {
    if (mapProjection) {
      const point = mapProjection([Number(lng), Number(lat)]);
      if (point) return { x: point[0], y: point[1] };
    }

    return {
      x: ((Number(lng) + 180) / 360) * MAP_WIDTH,
      y: ((90 - Number(lat)) / 180) * MAP_HEIGHT
    };
  }

  function renderMarkers() {
    els.markerLayer.innerHTML = "";
    Object.entries(data).forEach(([regionId, region]) => {
      const { x, y } = project(region.coordinates || { lat: 0, lng: 0 });
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
      marker.classList.add("marker");
      if (regionId === activeRegionId) marker.classList.add("active");
      marker.setAttribute("tabindex", "0");
      marker.setAttribute("role", "button");
      marker.setAttribute("aria-label", `Open ${region.name}`);
      marker.dataset.region = regionId;
      marker.innerHTML = `
        <title>${escapeHtml(region.name)}</title>
        <circle class="marker-ring" cx="${x}" cy="${y}" r="17"></circle>
        <circle class="marker-dot" cx="${x}" cy="${y}" r="8" fill="${region.color || "#a0522d"}"></circle>
      `;
      marker.addEventListener("click", (event) => {
        event.stopPropagation();
        trackEvent("region_click", { region_name: regionId });
        openRegion(regionId);
      });
      marker.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          trackEvent("region_click", { region_name: regionId });
          openRegion(regionId);
        }
      });
      els.markerLayer.appendChild(marker);
    });
  }

  function openRegion(regionId) {
    activeRegionId = regionId;
    const region = data[regionId];
    els.regionTitle.textContent = region.name;
    els.regionSubtitle.textContent = `${region.practices.length} practices in this collection`;
    updateGoBackLink(regionId, region.name);
    els.sidebar.style.setProperty("--sidebar-region-color", REGION_MORANDI_COLORS[regionId] || "#ede5d0");
    els.sidebar.style.setProperty("--sidebar-region-soft", mixWithWhite(REGION_MORANDI_COLORS[regionId] || region.color || "#c9a84c", 0.58));
    applySidebarBackground(region);
    els.sidebar.classList.add("open");
    els.atlasShell.classList.add("region-open");
    els.sidebar.setAttribute("aria-hidden", "false");
    renderMarkers();
    rotateMapToRegion(regionId);
    renderPractices();
    trackVisiblePractices(regionId);
  }

  function trackVisiblePractices(regionId) {
    const region = data[regionId];
    if (!region) return;

    region.practices.forEach((practice) => {
      trackEvent("practice_view", {
        practice_title: practice.title,
        region_name: regionId
      });
    });
  }

  function applySidebarBackground(region) {
    if (region.sidebarBackground) {
      els.sidebar.classList.add("has-sidebar-bg");
      els.sidebar.style.setProperty("--sidebar-bg-image", `url("${region.sidebarBackground}")`);
    } else {
      els.sidebar.classList.remove("has-sidebar-bg");
      els.sidebar.style.removeProperty("--sidebar-bg-image");
    }
  }

  function uploadSidebarBackground(file) {
    const region = data[activeRegionId];
    if (!region || !file) return;

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      region.sidebarBackground = await compressImage(reader.result);
      const saved = await saveData();
      if (!saved) {
        alert("This browser view could not save the sidebar background. Try localhost or a smaller image.");
      }
      applySidebarBackground(region);
    });
    reader.readAsDataURL(file);
  }

  function closeSidebar() {
    activeRegionId = null;
    els.sidebar.classList.remove("open");
    els.atlasShell.classList.remove("region-open");
    els.sidebar.setAttribute("aria-hidden", "true");
    renderMarkers();
    resetMapRotation();
  }

  function updateGoBackLink(regionId, regionName) {
    const chapter = document.querySelector(`.story-chapter[data-region="${regionId}"]`);
    if (!chapter) {
      els.goBackStoryButton.hidden = true;
      return;
    }

    els.goBackStoryButton.hidden = false;
    els.goBackStoryButton.textContent = `← Go back to ${regionName}`;
    els.goBackStoryButton.dataset.region = regionId;
  }

  function goBackToStory() {
    const regionId = els.goBackStoryButton.dataset.region || activeRegionId;
    const chapter = document.querySelector(`.story-chapter[data-region="${regionId}"]`);
    if (!chapter) return;

    closeSidebar();
    setTimeout(() => {
      chapter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }

  function renderPractices() {
    const region = data[activeRegionId];
    els.practiceList.innerHTML = "";
    if (!region) return;

    region.practices.forEach((practice) => {
      const card = document.createElement("article");
      card.className = "practice-card expanded";
      card.dataset.practiceId = practice.id;
      card.innerHTML = `
        <div class="practice-summary">
          <h3>${escapeHtml(practice.title)}</h3>
          <span class="time-period">${escapeHtml(practice.timePeriod || "Time period unknown")}</span>
          <p class="one-line">${escapeHtml(firstLine(practice.ancientUse || practice.historicalContext || ""))}</p>
        </div>
        <div class="practice-detail">
          ${imagePanel(practice)}
          ${detailRow("Ancient Use", practice.ancientUse)}
          ${detailRow("Historical Context", practice.historicalContext)}
          ${detailRow("Modern Evaluation", practice.modernEvaluation)}
          ${detailRow("Still Used Today?", practice.stillUsed)}
          ${detailRow("Limitations", practice.limitation)}
          ${detailRow("No Longer Used Because", practice.notUsed)}
          ${sourceRow(practice.source)}
          <div class="card-actions">
            <button class="icon-button edit-practice" type="button" title="Edit" aria-label="Edit ${escapeHtml(practice.title)}">✎</button>
            <button class="icon-button delete-practice" type="button" title="Delete" aria-label="Delete ${escapeHtml(practice.title)}">🗑</button>
          </div>
        </div>
      `;

      const imageUpload = card.querySelector(".image-upload");
      if (imageUpload) {
        imageUpload.addEventListener("change", (event) => {
          uploadPracticeImage(practice.id, event.target.files[0]);
        });
      }
      const imageUrlInput = card.querySelector(".image-url-input");
      if (imageUrlInput) {
        imageUrlInput.addEventListener("input", (event) => {
          updatePracticeImageUrl(practice.id, event.target.value, { rerender: false });
        });
        imageUrlInput.addEventListener("change", (event) => {
          updatePracticeImageUrl(practice.id, event.target.value);
        });
      }
      card.querySelector(".edit-practice").addEventListener("click", () => openPracticeForm(practice));
      card.querySelector(".delete-practice").addEventListener("click", () => deletePractice(practice.id));
      els.practiceList.appendChild(card);
    });
  }

  function firstLine(value) {
    return value.length > 118 ? `${value.slice(0, 115)}...` : value || "No description yet.";
  }

  function detailRow(label, value) {
    if (!value) return "";
    return `<div class="detail-row"><strong>${label}</strong><p>${escapeHtml(value)}</p></div>`;
  }

  function imagePanel(practice) {
    const inputId = `image-${escapeHtml(practice.id)}`;
    const urlInputId = `image-url-${escapeHtml(practice.id)}`;
    const imageSrc = practice.image || practice.imageUrl || "";
    const imageMarkup = imageSrc
      ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(practice.title)} reference" />`
      : `<div class="image-placeholder">Add image</div>`;

    return `
      <div class="practice-image-panel">
        <label
          class="practice-image-frame ${imageSrc ? "has-image" : ""}"
          for="${inputId}"
          title="${imageSrc ? "Click image to replace with local file" : "Add image URL below or upload local file"}"
        >
          ${imageMarkup}
        </label>
        <input class="image-upload" id="${inputId}" type="file" accept="image/*" />
        <label class="image-url-label" for="${urlInputId}">Image URL</label>
        <input
          class="image-url-input"
          id="${urlInputId}"
          type="url"
          value="${escapeHtml(practice.imageUrl || "")}"
          placeholder="Paste image URL here"
        />
        <div class="image-controls">
          <label class="upload-button" for="${inputId}">Upload local image instead</label>
        </div>
        <p class="image-source-text">Image Source: ${escapeHtml(imageSourceFor(practice))}</p>
      </div>
    `;
  }

  function imageSourceFor(practice) {
    return IMAGE_SOURCE_OVERRIDES[practice.id] || practice.imageSource || IMAGE_SOURCE_TEXT;
  }

  function sourceRow(source) {
    if (!source) return "";
    const safe = escapeHtml(source);
    const href = /^https?:\/\//i.test(source) ? safe : "#";
    return `<div class="detail-row"><strong>Source</strong><p><a href="${href}" target="_blank" rel="noreferrer">${safe}</a></p></div>`;
  }

  async function deletePractice(practiceId) {
    const region = data[activeRegionId];
    if (!region || !confirm("Are you sure?")) return;
    region.practices = region.practices.filter((practice) => practice.id !== practiceId);
    await saveData();
    openRegion(activeRegionId);
  }

  function findPractice(practiceId) {
    const region = data[activeRegionId];
    if (!region) return null;
    return region.practices.find((practice) => practice.id === practiceId) || null;
  }

  function uploadPracticeImage(practiceId, file) {
    const practice = findPractice(practiceId);
    if (!practice || !file) return;

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      practice.image = await compressImage(reader.result);
      practice.imageUrl = "";
      const saved = await saveData();
      if (!saved) {
        alert("This browser view could not save the image. Try opening the page through localhost or use a smaller image.");
      }
      renderPractices();
      expandPractice(practiceId);
    });
    reader.readAsDataURL(file);
  }

  async function updatePracticeImageUrl(practiceId, value, options = {}) {
    const practice = findPractice(practiceId);
    if (!practice) return;
    practice.imageUrl = value.trim();
    await saveData();
    if (options.rerender === false) return;
    renderPractices();
    expandPractice(practiceId);
  }

  function saveVisibleImageUrls() {
    if (!activeRegionId || !data[activeRegionId]) return;
    els.practiceList.querySelectorAll(".image-url-input").forEach((input) => {
      const card = input.closest(".practice-card");
      const practice = card ? findPractice(card.dataset.practiceId) : null;
      if (practice) practice.imageUrl = input.value.trim();
    });
    saveData();
  }

  function compressImage(dataUrl) {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      });
      image.addEventListener("error", () => resolve(dataUrl));
      image.src = dataUrl;
    });
  }

  async function removePracticeImage(practiceId) {
    const practice = findPractice(practiceId);
    if (!practice) return;
    practice.image = "";
    await saveData();
    renderPractices();
    expandPractice(practiceId);
  }

  function expandPractice(practiceId) {
    const card = els.practiceList.querySelector(`[data-practice-id="${CSS.escape(practiceId)}"]`);
    if (!card) return;
    card.classList.add("expanded");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openPracticeForm(practice = null) {
    if (!activeRegionId) return;
    formMode = { type: "practice", id: practice ? practice.id : null };
    els.modalTitle.textContent = practice ? "Edit Practice" : "Add Practice";
    renderForm(practiceFields, practice || {});
    openModal();
  }

  function openRegionForm() {
    formMode = { type: "region" };
    els.modalTitle.textContent = "Add Region";
    renderForm(regionFields, { color: "#a0522d", lat: 0, lng: 0 });
    openModal();
  }

  function renderForm(fields, values) {
    els.formFields.innerHTML = "";
    const row = document.createElement("div");
    row.className = fields === regionFields ? "two-column" : "";

    fields.forEach((field) => {
      const wrapper = document.createElement("div");
      wrapper.className = "field";
      const value = values[field.name] ?? "";
      const input =
        field.type === "textarea"
          ? `<textarea id="${field.name}" name="${field.name}">${escapeHtml(value)}</textarea>`
          : `<input id="${field.name}" name="${field.name}" type="${field.type}" value="${escapeHtml(value)}" ${field.step ? `step="${field.step}"` : ""} ${field.required ? "required" : ""} />`;
      wrapper.innerHTML = `<label for="${field.name}">${field.label}</label>${input}`;
      row.appendChild(wrapper);
    });

    els.formFields.appendChild(row);
  }

  function openModal() {
    els.formModal.classList.add("open");
    els.formModal.setAttribute("aria-hidden", "false");
    const firstInput = els.formModal.querySelector("input, textarea");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    els.formModal.classList.remove("open");
    els.formModal.setAttribute("aria-hidden", "true");
    formMode = null;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(els.entryForm);
    const values = Object.fromEntries(formData.entries());

    if (formMode.type === "region") {
      const id = uniqueKey(slugify(values.name), data);
      data[id] = {
        name: values.name,
        color: values.color || "#a0522d",
        coordinates: { lat: Number(values.lat), lng: Number(values.lng) },
        practices: []
      };
      await saveData();
      closeModal();
      renderMarkers();
      openRegion(id);
      return;
    }

    const region = data[activeRegionId];
    if (!region) return;
    if (formMode.id) {
      const index = region.practices.findIndex((practice) => practice.id === formMode.id);
      region.practices[index] = { ...region.practices[index], ...values };
    } else {
      region.practices.push({ id: `${slugify(values.title)}-${Date.now()}`, imageSource: IMAGE_SOURCE_TEXT, ...values });
    }
    await saveData();
    closeModal();
    renderPractices();
    els.regionSubtitle.textContent = `${region.practices.length} practices in this collection`;
  }

  async function resetData() {
    if (!confirm("Reset all edits and restore the original data?")) return;
    await clearStoredData();
    data = clone(defaultRegions());
    migrateApitherapyToEgypt(data);
    normalizeImageSources(data);
    activeRegionId = null;
    closeSidebar();
    renderMarkers();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  els.closeSidebar.addEventListener("click", closeSidebar);
  els.goBackStoryButton.addEventListener("click", goBackToStory);
  els.sidebarHeader.addEventListener("click", (event) => {
    if (!activeRegionId || event.target.closest("button")) return;
    els.sidebarBgInput.click();
  });
  els.sidebarBgInput.addEventListener("change", (event) => {
    uploadSidebarBackground(event.target.files[0]);
    event.target.value = "";
  });
  els.addPracticeButton.addEventListener("click", () => openPracticeForm());
  els.addRegionButton.addEventListener("click", openRegionForm);
  els.resetDataButton.addEventListener("click", resetData);
  els.closeModal.addEventListener("click", closeModal);
  els.cancelForm.addEventListener("click", closeModal);
  els.entryForm.addEventListener("submit", handleFormSubmit);
  els.formModal.addEventListener("click", (event) => {
    if (event.target === els.formModal) closeModal();
  });
  els.worldMap.addEventListener("click", closeSidebar);
  window.addEventListener("beforeunload", saveVisibleImageUrls);
  document.querySelectorAll("[data-cover-link-region]").forEach((button) => {
    button.addEventListener("click", () => {
      const regionId = button.dataset.coverLinkRegion;
      const practiceId = button.dataset.coverLinkPractice;
      document.querySelector(".site-header").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        openRegion(regionId);
        if (practiceId) expandPractice(practiceId);
      }, 650);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeSidebar();
    }
  });

  data = await loadData();
  await renderWorldMap();
})();

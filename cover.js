(function () {
  const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  const SENTENCE_INTERVAL = 3000;
  const SCROLL_HINT_DELAY = 12000;
  const sentences = document.querySelectorAll(".cover-sentence");
  const scrollHint = document.querySelector(".cover-scroll-hint");

  sentences.forEach((sentence, index) => {
    setTimeout(() => {
      sentence.classList.add("cover-visible");
    }, index * SENTENCE_INTERVAL);
  });

  setTimeout(() => {
    if (scrollHint) scrollHint.classList.add("cover-visible");
  }, SCROLL_HINT_DELAY);

  renderDecorativeMap();

  async function renderDecorativeMap() {
    const layer = document.querySelector("#coverMapLayer");
    if (!layer || !window.d3 || !window.topojson) return;

    const projection = d3
      .geoNaturalEarth1()
      .fitExtent(
        [
          [28, 24],
          [972, 476]
        ],
        { type: "Sphere" }
      );
    const path = d3.geoPath(projection);

    try {
      const atlas = await d3.json(WORLD_ATLAS_URL);
      const countries = topojson.feature(atlas, atlas.objects.countries).features;
      layer.innerHTML = "";
      countries.forEach((country) => {
        const countryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        countryPath.setAttribute("d", path(country));
        layer.appendChild(countryPath);
      });
    } catch (error) {
      console.warn("Cover map could not load world-atlas data.", error);
    }
  }
})();

(function () {
  const causePanels = Array.from(document.querySelectorAll("[data-deepdive-cause]"));
  const causeCounter = document.querySelector("[data-deepdive-cause-counter]");
  const causePrev = document.querySelector("[data-deepdive-prev]");
  const causeNext = document.querySelector("[data-deepdive-next]");
  const productTrack = document.querySelector("[data-deepdive-track]");
  const productCards = Array.from(document.querySelectorAll(".deepdive-product-card"));
  const productCounter = document.querySelector("[data-deepdive-product-counter]");
  const productPrev = document.querySelector("[data-deepdive-product-prev]");
  const productNext = document.querySelector("[data-deepdive-product-next]");
  let causeIndex = 0;
  let productIndex = 0;

  function showCause(nextIndex) {
    if (!causePanels.length) return;
    causeIndex = (nextIndex + causePanels.length) % causePanels.length;
    causePanels.forEach((panel, index) => {
      panel.classList.toggle("deepdive-cause-visible", index === causeIndex);
    });
    if (causeCounter) causeCounter.textContent = `${causeIndex + 1} / ${causePanels.length}`;
  }

  function showProduct(nextIndex) {
    if (!productTrack || !productCards.length) return;
    productIndex = (nextIndex + productCards.length) % productCards.length;
    const card = productCards[0];
    const cardWidth = card.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(productTrack).columnGap || "0");
    productTrack.style.transform = `translateX(${-productIndex * (cardWidth + gap)}px)`;
    if (productCounter) productCounter.textContent = `${productIndex + 1} / ${productCards.length}`;
  }

  if (causePrev) causePrev.addEventListener("click", () => showCause(causeIndex - 1));
  if (causeNext) causeNext.addEventListener("click", () => showCause(causeIndex + 1));
  if (productPrev) productPrev.addEventListener("click", () => showProduct(productIndex - 1));
  if (productNext) productNext.addEventListener("click", () => showProduct(productIndex + 1));
  window.addEventListener("resize", () => showProduct(productIndex));

  showCause(0);
  showProduct(0);
})();

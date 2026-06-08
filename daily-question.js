(function () {
  const card = document.querySelector("[data-dq-card]");
  if (!card) return;

  const els = {
    date: card.querySelector("[data-dq-date]"),
    question: card.querySelector("[data-dq-question]"),
    options: card.querySelector("[data-dq-options]"),
    submit: card.querySelector("[data-dq-submit]"),
    result: card.querySelector("[data-dq-result]")
  };

  const regions = defaultRegions();
  const dateStr = new Date().toDateString();
  const storageKey = `dailyQuestion_${dateStr}`;
  const dailyPractice = getDailyPractice();
  if (!dailyPractice) {
    card.hidden = true;
    return;
  }

  const correctAnswer = dailyPractice.regionName;
  const options = buildOptions(correctAnswer);
  let selectedAnswer = "";
  let storedAnswer = readStoredAnswer();

  els.date.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date());
  els.question.textContent = `Question: Which ancient civilization developed ${dailyPractice.title}?`;
  renderOptions();

  if (storedAnswer) {
    selectedAnswer = storedAnswer;
    showSubmittedState(storedAnswer);
  }

  els.submit.addEventListener("click", () => {
    if (!selectedAnswer || storedAnswer) return;
    storedAnswer = selectedAnswer;
    writeStoredAnswer(selectedAnswer);
    showSubmittedState(selectedAnswer);
  });

  function defaultRegions() {
    if (typeof REGIONS !== "undefined") return REGIONS;
    return window.REGIONS || {};
  }

  function getDailyPractice() {
    const allPractices = [];
    Object.entries(regions).forEach(([, region]) => {
      (region.practices || []).forEach((practice) => {
        allPractices.push({ ...practice, regionName: region.name });
      });
    });

    if (!allPractices.length) return null;

    let hash = 0;
    for (let index = 0; index < dateStr.length; index += 1) {
      hash = (hash * 31 + dateStr.charCodeAt(index)) % allPractices.length;
    }
    return allPractices[Math.abs(hash) % allPractices.length];
  }

  function buildOptions(answer) {
    const wrongAnswers = Object.values(regions)
      .map((region) => region.name)
      .filter((regionName) => regionName !== answer);
    return shuffle([answer, ...shuffle(wrongAnswers).slice(0, 3)]);
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function renderOptions() {
    els.options.innerHTML = options.map((option, index) => `
      <button class="dq-option" type="button" data-dq-option="${escapeHtml(option)}">
        <span class="dq-option-letter">${String.fromCharCode(65 + index)}</span>
        <span>${escapeHtml(option)}</span>
      </button>
    `).join("");

    els.options.querySelectorAll("[data-dq-option]").forEach((button) => {
      button.addEventListener("click", () => {
        if (storedAnswer) return;
        selectedAnswer = button.dataset.dqOption;
        els.options.querySelectorAll("[data-dq-option]").forEach((optionButton) => {
          optionButton.classList.toggle("dq-selected", optionButton === button);
        });
        els.submit.hidden = false;
      });
    });
  }

  function showSubmittedState(answer) {
    const isCorrect = answer === correctAnswer;
    els.submit.hidden = true;

    els.options.querySelectorAll("[data-dq-option]").forEach((button) => {
      const value = button.dataset.dqOption;
      button.disabled = true;
      button.classList.toggle("dq-selected", value === answer);
      button.classList.toggle("dq-correct", value === correctAnswer);
      button.classList.toggle("dq-wrong", value === answer && value !== correctAnswer);
    });

    els.result.hidden = false;
    els.result.innerHTML = `
      <p class="dq-result-title">${isCorrect ? "Nice find! 🌿" : "Close trail, different stop ✨"}</p>
      ${isCorrect ? "" : `<p class="dq-answer-line">This clue points to: <strong>${escapeHtml(correctAnswer)}</strong></p>`}
      <div class="dq-rule" aria-hidden="true"></div>
      <p class="dq-practice-line">${escapeHtml(dailyPractice.title)} — ${escapeHtml(dailyPractice.regionName)}</p>
      <p class="dq-explanation">${escapeHtml(dailyPractice.modernEvaluation || dailyPractice.ancientUse || "No explanation is available yet.")}</p>
      ${sourceMarkup(dailyPractice)}
      <p class="dq-tomorrow">A new clue unlocks tomorrow.</p>
    `;
    requestAnimationFrame(() => els.result.classList.add("dq-result-visible"));
  }

  function sourceMarkup(practice) {
    const query = encodeURIComponent(`${practice.title} ${practice.regionName} medicine`);
    const href = `https://www.britannica.com/search?query=${query}`;
    return `<p class="dq-source"><a href="${href}" target="_blank" rel="noreferrer">Explore on Britannica</a></p>`;
  }

  function readStoredAnswer() {
    try {
      return localStorage.getItem(storageKey) || "";
    } catch (error) {
      return "";
    }
  }

  function writeStoredAnswer(answer) {
    try {
      localStorage.setItem(storageKey, answer);
    } catch (error) {
      return false;
    }
    return true;
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

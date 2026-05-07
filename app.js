// ============================================================
// AP Calculus AB FRQ App — Main Controller
// ============================================================

let attempted = 0;
let streak = 0;
let currentTopic = null;
let currentQuestion = null;

// --- Render topic grid (no icons, clean text only) ---
function renderTopics() {
  const grid = document.getElementById("topic-grid");
  grid.innerHTML = "";
  TOPICS.forEach((t) => {
    const card = document.createElement("div");
    card.className = "topic-card";
    card.innerHTML = `
      <div class="topic-name">${t.name}</div>
      <div class="topic-desc">${t.desc}</div>
      <div class="topic-freq">${t.freq}% of exams</div>
    `;
    card.addEventListener("click", () => selectTopic(t.id));
    grid.appendChild(card);
  });
}

// --- Render analysis section ---
function renderAnalysis() {
  const grid = document.getElementById("analysis-grid");
  grid.innerHTML = "";
  const sorted = [...TOPICS].sort((a, b) => b.freq - a.freq);
  sorted.forEach((t) => {
    const item = document.createElement("div");
    item.className = "analysis-item";
    item.innerHTML = `
      <div class="analysis-bar-wrap">
        <div class="analysis-name">${t.name}</div>
        <div class="analysis-bar"><div class="analysis-bar-fill" style="width: ${t.freq}%"></div></div>
      </div>
      <div class="analysis-pct">${t.freq}%</div>
    `;
    grid.appendChild(item);
  });
}

// --- Select topic and show question ---
function selectTopic(topicId) {
  currentTopic = topicId;
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("question-screen").classList.remove("hidden");

  const topic = TOPICS.find((t) => t.id === topicId);
  document.getElementById("current-topic-badge").textContent = topic.name;

  loadNewQuestion();
  window.scrollTo({ top: 0 });
}

function loadNewQuestion() {
  currentQuestion = generateQuestion(currentTopic);
  if (!currentQuestion) return;

  // Reset UI
  document.getElementById("solution-area").classList.add("hidden");
  document.getElementById("self-grade").classList.add("hidden");
  document.getElementById("btn-show-solution").style.display = "";

  // Render question text
  document.getElementById("question-text").innerHTML = currentQuestion.text;

  // Render parts
  const container = document.getElementById("parts-container");
  container.innerHTML = "";
  const partColors = ["part-a", "part-b", "part-c", "part-d"];
  currentQuestion.parts.forEach((p, i) => {
    const block = document.createElement("div");
    block.className = "part-block " + (partColors[i] || "");
    block.innerHTML = `
      <div class="part-label">
        <span class="part-label-text">${p.label}</span>
        <span class="part-points">${p.points} pts</span>
      </div>
      <div class="part-text">${p.text}</div>
    `;
    container.appendChild(block);
  });

  // Re-typeset MathJax
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([
      document.getElementById("question-text"),
      container,
    ]).catch(() => {});
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSolution() {
  const area = document.getElementById("solution-area");
  const text = document.getElementById("solution-text");
  area.classList.remove("hidden");
  document.getElementById("btn-show-solution").style.display = "none";
  document.getElementById("self-grade").classList.remove("hidden");

  const stepColors = ["step-a", "step-b", "step-c", "step-d"];
  text.innerHTML = "";
  currentQuestion.solution.forEach((s, i) => {
    const step = document.createElement("div");
    step.className = "step " + (stepColors[i] || "");
    step.innerHTML = `
      <div class="step-label">${s.label}</div>
      <div class="step-body">${s.body}</div>
    `;
    text.appendChild(step);
  });

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([text]).catch(() => {});
  }

  area.scrollIntoView({ behavior: "smooth", block: "start" });
}

function goBack() {
  document.getElementById("question-screen").classList.add("hidden");
  document.getElementById("home-screen").classList.remove("hidden");
  currentTopic = null;
  currentQuestion = null;
  window.scrollTo({ top: 0 });
}

function recordGrade(result) {
  attempted++;
  if (result === "correct") {
    streak++;
  } else {
    streak = 0;
  }
  document.getElementById("attempted").textContent = attempted;
  document.getElementById("streak").textContent = streak;
  document.getElementById("self-grade").classList.add("hidden");

  setTimeout(() => loadNewQuestion(), 350);
}

// --- Event listeners ---
document.getElementById("btn-back").addEventListener("click", goBack);
document.getElementById("btn-new").addEventListener("click", loadNewQuestion);
document.getElementById("btn-show-solution").addEventListener("click", showSolution);
document.getElementById("btn-correct").addEventListener("click", () => recordGrade("correct"));
document.getElementById("btn-partial").addEventListener("click", () => recordGrade("partial"));
document.getElementById("btn-wrong").addEventListener("click", () => recordGrade("wrong"));

// --- Initialize ---
renderTopics();
renderAnalysis();

function initChallenges() {
  document.querySelectorAll("form.challenge").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector(".feedback[aria-live]");
      const selected = form.querySelector('input[name="answer"]:checked');

      if (!feedback) return;
      if (!selected) {
        feedback.textContent = "Choose an answer before checking.";
        feedback.className = "feedback is-incorrect";
        return;
      }

      const isCorrect = selected.value === form.dataset.answer;
      feedback.textContent = isCorrect ? form.dataset.correct : form.dataset.incorrect;
      feedback.className = `feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChallenges, { once: true });
} else {
  initChallenges();
}

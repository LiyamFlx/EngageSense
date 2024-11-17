document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-input");
  const analyzeBtn = document.getElementById("analyze-btn");
  const progressBar = document.getElementById("progress-bar");
  const resultsSection = document.getElementById("results-section");
  const resultsText = document.getElementById("results-text");
  const API_URL = "https://engagement-analysis-calculator.onrender.com/analyze";

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      analyzeBtn.disabled = false;
    }
  });

  analyzeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Show progress bar
      progressBar.style.width = "50%";

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze the file");

      const data = await response.json();
      progressBar.style.width = "100%";

      // Show results
      resultsSection.style.display = "block";
      resultsText.textContent = `Engagement Score: ${data.engagement_score}`;
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  });
});

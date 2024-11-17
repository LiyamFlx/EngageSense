document.addEventListener("DOMContentLoaded", () => {
  const startSessionBtn = document.getElementById("start-session-btn");
  const fileInput = document.getElementById("file-input");
  const analyzeBtn = document.getElementById("analyze-btn");
  const uploadScreen = document.getElementById("upload-screen");
  const homeScreen = document.getElementById("home-screen");
  const resultsScreen = document.getElementById("results-screen");
  const API_URL = "https://engagement-analysis-calculator.onrender.com/analyze";

  startSessionBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    uploadScreen.style.display = "block";
  });

  fileInput.addEventListener("change", () => {
    analyzeBtn.disabled = !fileInput.files.length;
  });

  analyzeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Please upload a file before analyzing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      analyzeBtn.textContent = "Analyzing...";
      analyzeBtn.disabled = true;

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the file");
      }

      const data = await response.json();

      uploadScreen.style.display = "none";
      resultsScreen.style.display = "block";

      const ctx = document.getElementById("results-chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Physical", "Emotional", "Mental", "Spiritual"],
          datasets: [
            {
              label: "Engagement Scores",
              data: [data.physical, data.emotional, data.mental, data.spiritual],
              backgroundColor: ["#4CAF50", "#FFC107", "#2196F3", "#9C27B0"],
            },
          ],
        },
      });

      analyzeBtn.textContent = "Analyze";
      analyzeBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during analysis. Please try again.");
    }
  });
});

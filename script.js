document.addEventListener("DOMContentLoaded", () => {
  const startSessionBtn = document.getElementById("start-session-btn");
  const fileInput = document.getElementById("file-input");
  const analyzeBtn = document.getElementById("analyze-btn");
  const uploadScreen = document.getElementById("upload-screen");
  const homeScreen = document.getElementById("home-screen");
  const monitoringScreen = document.getElementById("monitoring-screen");
  const resultsScreen = document.getElementById("results-screen");
  const API_URL = "https://engagement-analysis-calculator.onrender.com/analyze";

  // Show the upload screen when "Start Session" is clicked
  startSessionBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    uploadScreen.style.display = "block";
  });

  // Enable "Analyze" button when a file is selected
  fileInput.addEventListener("change", () => {
    analyzeBtn.disabled = !fileInput.files.length;
  });

  // Handle the "Analyze" button click event
  analyzeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Please upload a file before analyzing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Update UI to show progress
      analyzeBtn.textContent = "Analyzing...";
      analyzeBtn.disabled = true;

      // Make API request
      const response = await fetchWithRetry(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze the file: ${response.statusText}`);
      }

      const data = await response.json();

      // Display Results
      uploadScreen.style.display = "none";
      monitoringScreen.style.display = "none";
      resultsScreen.style.display = "block";

      renderResultsChart(data);

      analyzeBtn.textContent = "Analyze";
      analyzeBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during analysis. Please try again.");
      analyzeBtn.textContent = "Analyze";
      analyzeBtn.disabled = false;
    }
  });

  // Function to retry API requests
  async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options);
      } catch (error) {
        if (i < retries - 1) {
          console.warn(`Retrying API request (${i + 1}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  // Function to render the results chart
  function renderResultsChart(data) {
    const ctx = document.getElementById("results-chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Physical", "Emotional", "Mental", "Spiritual"],
        datasets: [
          {
            label: "Engagement Scores",
            data: [
              data.physical || 0,
              data.emotional || 0,
              data.mental || 0,
              data.spiritual || 0,
            ],
            backgroundColor: ["#4CAF50", "#FFC107", "#2196F3", "#9C27B0"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }
});

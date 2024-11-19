document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progressBar");
    const analysisProgress = document.getElementById("analysisProgress");
    const fileInput = document.getElementById("fileInput");
    const nextButton = document.getElementById("nextButton");
    const viewResultsButton = document.getElementById("viewResultsButton");
    const API_URL = "https://engagesense.onrender.com/analyze";

    let progress = 0;

    function showScreen(screenNumber) {
        document.querySelectorAll('.container > div').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(`screen${screenNumber}`).style.display = 'block';
    }

    fileInput.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
            nextButton.style.display = 'block';
        } else {
            nextButton.style.display = 'none';
        }
    });

    nextButton.addEventListener("click", () => {
        showScreen(3);
        startAnalysis();
    });

    function startAnalysis() {
        const progressInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(progressInterval);
                analysisProgress.style.width = "100%";
                viewResultsButton.style.display = 'block';
            } else {
                progress += 10;
                analysisProgress.style.width = progress + "%";
            }
        }, 500);
    }

    viewResultsButton.addEventListener("click", () => {
        showScreen(4);
        updateCharts();
    });

    function updateCharts() {
        const engagementChartContext = document.getElementById("engagementChart").getContext("2d");
        const sentimentChartContext = document.getElementById("sentimentChart").getContext("2d");

        new Chart(engagementChartContext, {
            type: 'line',
            data: {
                labels: ['Segment 1', 'Segment 2', 'Segment 3', 'Segment 4'],
                datasets: [{
                    label: 'Engagement Score',
                    data: [7, 8, 9, 6],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: true
                }]
            }
        });

        new Chart(sentimentChartContext, {
            type: 'line',
            data: {
                labels: ['Segment 1', 'Segment 2', 'Segment 3', 'Segment 4'],
                datasets: [{
                    label: 'Sentiment Score',
                    data: [0.5, 0.8, -0.4, 0.3],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            }
        });
    }
});

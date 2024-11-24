const form = document.getElementById("uploadForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];

  if (!file) {
    resultDiv.textContent = "Please select a file to upload.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    resultDiv.textContent = "Analyzing...";
    const response = await fetch("https://engagesense.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    resultDiv.textContent = data.message || "Analysis complete!";
  } catch (error) {
    resultDiv.textContent = `Error: ${error.message}`;
  }
});

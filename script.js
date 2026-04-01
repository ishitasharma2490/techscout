const API_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://himalayas.app/jobs/api?limit=12&offset=0");

const jobsContainer = document.getElementById("jobsContainer");
const searchInput = document.getElementById("searchInput");

let allJobs = [];


async function fetchJobs() {
  jobsContainer.innerHTML = "<p>Loading jobs...</p>";

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("FULL API DATA:", data);

    if (Array.isArray(data)) {
      allJobs = data;
    } else if (Array.isArray(data.jobs)) {
      allJobs = data.jobs;
    } else if (Array.isArray(data.data)) {
      allJobs = data.data;
    } else {
      allJobs = [];
    }

    displayJobs(allJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    jobsContainer.innerHTML =
      "<p>Failed to load jobs. Please try again later.</p>";
  }
}

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobsContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");

    jobCard.innerHTML = `
      <h3>${job.title || "No title"}</h3>
      <p><strong>Company:</strong> ${job.companyName || job.company || "Unknown"}</p>
      <p><strong>Location:</strong> ${job.location || "Remote"}</p>
      <p>${job.excerpt || job.description || "No description available."}</p>
      <a href="${job.url || job.applyUrl || "#"}" target="_blank">Apply Now</a>
    `;

    jobsContainer.appendChild(jobCard);
  });
}

searchInput.addEventListener("input", function () {
  const searchText = this.value.toLowerCase();

  const filteredJobs = allJobs.filter((job) =>
    (job.title || "").toLowerCase().includes(searchText) ||
    (job.companyName || job.company || "").toLowerCase().includes(searchText)
  );

  displayJobs(filteredJobs);
});

fetchJobs();
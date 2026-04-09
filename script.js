const jobsContainer = document.getElementById("jobs");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allJobs = [];

async function fetchJobs() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  jobsContainer.innerHTML = "";

  try {
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
    const data = await response.json();

    allJobs = data.data || [];
    displayJobs(allJobs);
  } catch (err) {
    error.classList.remove("hidden");
    console.error(err);
  } finally {
    loading.classList.add("hidden");
  }
}

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobsContainer.innerHTML = `<p class="no-jobs">No jobs found.</p>`;
    return;
  }

  jobs.forEach(job => {
    jobsContainer.innerHTML += `
      <div class="job-card">
        <h3>${job.title || "No Title"}</h3>
        <p><strong>Company:</strong> ${job.company_name || "Not Available"}</p>
        <p><strong>Location:</strong> ${job.location || "Remote"}</p>
        <a href="${job.url}" target="_blank">View Job</a>
      </div>
    `;
  });
}

function searchJobs() {
  const searchText = searchInput.value.toLowerCase();

  const filteredJobs = allJobs.filter(job =>
    job.title.toLowerCase().includes(searchText)
  );

  displayJobs(filteredJobs);
}

searchBtn.addEventListener("click", searchJobs);

searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchJobs();
  }
});

fetchJobs();
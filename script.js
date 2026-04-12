const jobsContainer = document.getElementById("jobs");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");

let allJobs = [];

async function fetchJobs() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  jobsContainer.innerHTML = "";

  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
    const data = await res.json();

    allJobs = data.data || [];
    displayJobs(allJobs);
  } catch (e) {
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobsContainer.innerHTML = "<p class='no-jobs'>No jobs found</p>";
    return;
  }

  jobs.forEach(job => {
    jobsContainer.innerHTML += `
      <div class="job-card">
        <h3>${job.title || "No Title"}</h3>
        <p>${job.company_name || "Unknown Company"}</p>
        <p>${job.location || "Remote"}</p>
        <a href="${job.url}" target="_blank">View Job</a>
      </div>
    `;
  });
}

function applyFilters() {
  let jobs = [...allJobs];

  const text = searchInput.value.toLowerCase();
  const sort = sortSelect.value;

  jobs = jobs.filter(j => j.title.toLowerCase().includes(text));

  if (sort === "az") {
    jobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "za") {
    jobs.sort((a, b) => b.title.localeCompare(a.title));
  }

  displayJobs(jobs);
}

searchBtn.addEventListener("click", applyFilters);

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") applyFilters();
});

sortSelect.addEventListener("change", applyFilters);

fetchJobs();
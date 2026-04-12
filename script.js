const jobsContainer = document.getElementById("jobs");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

let allJobs = [];

async function fetchJobs() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");

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

  if (text) {
    jobs = jobs.filter(j => j.title.toLowerCase().includes(text));
  }

  if (sort === "az") {
    jobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "za") {
    jobs.sort((a, b) => b.title.localeCompare(a.title));
  }

  displayJobs(jobs);
}

searchBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.innerText = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});

fetchJobs();
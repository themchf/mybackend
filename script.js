// ================== SUPABASE CONFIG ==================
const supabaseUrl = "https://https://logzniihpuadanglhmnq.supabase.co";
const supabaseKey = "sb_publishable_PgKbI8X4zNXiFgfnZNroCQ_MryjUx_R";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ================== ELEMENTS ==================
const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("drug-input");
const resultsDiv = document.getElementById("results");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authStatus = document.getElementById("auth-status");

const historyList = document.getElementById("history-list");

// ================== AUTH ==================

// SIGN UP
signupBtn.onclick = async () => {
  const { error } = await supabaseClient.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });

  authStatus.textContent = error ? error.message : "Check your email!";
};

// LOGIN
loginBtn.onclick = async () => {
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  authStatus.textContent = error ? error.message : "Logged in!";
  checkUser();
};

// LOGOUT
logoutBtn.onclick = async () => {
  await supabaseClient.auth.signOut();
  authStatus.textContent = "Logged out";
  checkUser();
};

// CHECK USER
async function checkUser() {
  const { data } = await supabaseClient.auth.getUser();

  if (data.user) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
}

checkUser();

// ================== SEARCH ==================

async function searchDrug(drugName) {
  const key = drugName.toLowerCase().trim();

  if (!key) {
    alert("Enter a drug name");
    return;
  }

  const { data, error } = await supabaseClient
    .from("drugs")
    .select("*")
    .ilike("name", `%${key}%`);

  if (error) {
    resultsDiv.innerHTML = `<p>Error loading data</p>`;
    return;
  }

  if (data.length === 0) {
    resultsDiv.innerHTML = `<p>No results found</p>`;
    return;
  }

  renderDrug(data[0]);
  addToHistory(drugName);
}

// ================== RENDER ==================

function renderDrug(drug) {
  resultsDiv.classList.remove("hidden");

  resultsDiv.innerHTML = `
    <h2>${drug.name}</h2>
    <p><strong>Class:</strong> ${drug.class}</p>
    <p><strong>Indications:</strong> ${drug.indications?.join(", ")}</p>
    <p><strong>Mechanism:</strong> ${drug.mechanism}</p>
    <p><strong>Usage:</strong> ${drug.usage}</p>
    <p><strong>Side Effects:</strong> ${drug.side_effects?.join(", ")}</p>
    <p><strong>Contraindications:</strong> ${drug.contraindications?.join(", ")}</p>
    <p><strong>Interactions:</strong> ${drug.interactions?.join(", ")}</p>
    <p><strong>Pregnancy:</strong> ${drug.pregnancy}</p>
  `;
}

// ================== HISTORY ==================

let searchHistory = JSON.parse(localStorage.getItem("history")) || [];

function addToHistory(drug) {
  if (!searchHistory.includes(drug)) {
    searchHistory.push(drug);
    localStorage.setItem("history", JSON.stringify(searchHistory));
    renderHistory();
  }
}

function renderHistory() {
  historyList.innerHTML = "";

  searchHistory.forEach(d => {
    const div = document.createElement("div");
    div.textContent = d;
    div.classList.add("history-item");

    div.onclick = () => searchDrug(d);

    historyList.appendChild(div);
  });
}

renderHistory();

// ================== EVENTS ==================

searchBtn.onclick = () => searchDrug(input.value);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchDrug(input.value);
});

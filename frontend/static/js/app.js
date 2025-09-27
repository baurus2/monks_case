const alerts = document.getElementById("alerts");
const appCard = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const applyFilter = document.getElementById("apply-filter");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
const pagination = document.getElementById("pagination");
const spinner = document.getElementById("spinner");

// limpar campo de data ao dar duplo clique
[startDateInput, endDateInput].forEach((input) => {
  input.addEventListener("dblclick", () => {
    startDateInput.value = "";
    endDateInput.value = "";

    currentPage = 1;
    loadData();
    showAlert("Filtro de datas removido", "info");
  });
});

function validateDateRange() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (startDate && endDate) {
    if (new Date(endDate) < new Date(startDate)) {
      showAlert(
        "A data final não pode ser anterior à inicial. Ajustando...",
        "info"
      );

      endDateInput.value = startDate;
    }
  }
}

startDateInput.addEventListener("change", validateDateRange);
endDateInput.addEventListener("change", validateDateRange);

let currentSort = { col: null, dir: "asc" };
let currentPage = 1;
const pageSize = 10;

function showAlert(message, type = "info", timeout = 3000) {
  const div = document.createElement("div");
  div.className = "alert " + type;
  div.textContent = message;
  alerts.appendChild(div);
  setTimeout(() => div.remove(), timeout);
}

async function checkSession() {
  const res = await fetch("/api/me", { credentials: "same-origin" });
  const data = await res.json();
  if (data.authenticated) {
    showDashboard(data.email, data.role);
    loadData();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginSection.style.display = "block";
  dashboardSection.style.display = "none";
  appCard.classList.remove("is-dashboard");
}

function showDashboard(email, role) {
  loginSection.style.display = "none";
  dashboardSection.style.display = "block";
  userInfo.textContent = `${email} (${role})`;
  appCard.classList.add("is-dashboard");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginBtn.disabled = true;
  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.error || "Falha no login", "error");
      return;
    }
    showAlert("Login bem-sucedido", "success");
    emailInput.value = "";
    passwordInput.value = "";
    showDashboard(data.email, data.role);
    currentPage = 1;
    currentSort = { col: null, dir: "asc" };
    loadData();
  } catch (err) {
    showAlert("Erro de rede", "error");
  } finally {
    loginBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
  showAlert("Desconectado", "info");
  showLogin();
});

applyFilter.addEventListener("click", () => {
  currentPage = 1;
  loadData();
});

async function loadData() {
  spinner.style.display = "grid";

  try {
    const params = new URLSearchParams();
    if (startDateInput.value) params.append("start_date", startDateInput.value);
    if (endDateInput.value) params.append("end_date", endDateInput.value);
    if (currentSort.col) {
      params.append("sort_by", currentSort.col);
      params.append("sort_dir", currentSort.dir);
    }
    params.append("page", currentPage);
    params.append("page_size", pageSize);

    // 3. Faz a busca dos dados
    const res = await fetch("/api/data?" + params.toString(), {
      credentials: "same-origin",
    });
    if (!res.ok) {
      if (res.status === 401) {
        showAlert("Sessão expirada. Faça login novamente.", "error");
        showLogin();
      }
      return;
    }

    const payload = await res.json();
    renderTable(payload.columns, payload.items);
    renderPagination(payload.total, payload.page, payload.page_size);
  } catch (err) {
    showAlert("Erro ao buscar dados", "error");
  } finally {
    spinner.style.display = "none";
  }
}

function renderTable(columns, items) {
  // 1. Limpa o conteúdo anterior
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  // 2. Valida e renderiza o cabeçalho primeiro
  if (!columns || columns.length === 0) {
    tableHead.innerHTML = "<tr><th>Sem dados para exibir</th></tr>";
    return;
  }

  const trHead = document.createElement("tr");
  columns.forEach((c) => {
    const th = document.createElement("th");
    th.innerHTML = `${c} <span class="sort">↕</span>`;
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      if (currentSort.col === c) {
        currentSort.dir = currentSort.dir === "asc" ? "desc" : "asc";
      } else {
        currentSort.col = c;
        currentSort.dir = "asc";
      }
      currentPage = 1;
      loadData();
    });
    trHead.appendChild(th);
  });
  tableHead.appendChild(trHead);

  // 3. Valida e renderiza o corpo da tabela
  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; padding: 20px;">Nenhum resultado encontrado.</td></tr>`;
  } else {
    items.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((c) => {
        const td = document.createElement("td");
        td.textContent = row[c] !== null && row[c] !== undefined ? row[c] : "";
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }
}

function renderPagination(total, page, page_size) {
  pagination.innerHTML = "";
  const totalPages = Math.max(1, Math.ceil(total / page_size));

  const info = document.createElement("span");
  info.textContent = `Página ${page} de ${totalPages} `;

  const prev = document.createElement("button");
  prev.textContent = "« Anterior";
  prev.disabled = page <= 1;
  prev.addEventListener("click", () => {
    currentPage = Math.max(1, page - 1);
    loadData();
  });

  const next = document.createElement("button");
  next.textContent = "Próxima »";
  next.disabled = page >= totalPages;
  next.addEventListener("click", () => {
    currentPage = Math.min(totalPages, page + 1);
    loadData();
  });

  pagination.appendChild(prev);
  pagination.appendChild(info);
  pagination.appendChild(next);
}

// On load, check session
window.addEventListener("load", () => {
  checkSession();
});

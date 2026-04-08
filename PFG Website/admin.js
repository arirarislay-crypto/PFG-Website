const STORAGE_KEY = "pfg-site-data";
const ADMIN_SESSION_KEY = "pfg-admin-session";
const ADMIN_USER_KEY = "pfg-admin-user";

const ADMIN_USERS = {
  Slary: "Noob1234",
  Uhji: "noob1234"
};

const DEFAULT_DATA = {
  teams: [],
  players: [],
  rules: [],
  schedules: []
};

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

const PLAYER_FIELDS = {
  QB: [
    ["rating", "Rating", "0.1"],
    ["compPct", "Comp %", "0.1"],
    ["comp", "Comp", "1"],
    ["att", "Att", "1"],
    ["yards", "Yards", "1"],
    ["tds", "TDs", "1"],
    ["ints", "INTs", "1"],
    ["sacks", "Sacks", "1"],
    ["gp", "GP", "1"]
  ],
  RB: [
    ["att", "Att", "1"],
    ["yards", "Yards", "1"],
    ["misses", "Misses", "1"],
    ["tds", "TDs", "1"],
    ["gp", "GP", "1"]
  ],
  WR: [
    ["catches", "Catches", "1"],
    ["targets", "Targets", "1"],
    ["catchPct", "Catch %", "0.1"],
    ["yards", "Yards", "1"],
    ["yac", "YAC", "1"],
    ["ypc", "YPC", "0.1"],
    ["tds", "TDs", "1"],
    ["gp", "GP", "1"]
  ],
  DB: [
    ["rating", "Rating", "0.1"],
    ["ints", "INTs", "1"],
    ["denyPct", "Deny %", "0.1"],
    ["targets", "Targets", "1"],
    ["compA", "Comp A", "1"],
    ["ydsA", "Yds A", "1"],
    ["tdA", "TD A", "1"],
    ["swats", "Swats", "1"],
    ["tds", "TDs", "1"],
    ["gp", "GP", "1"]
  ],
  DEF: [
    ["sacks", "Sacks", "1"],
    ["tackles", "Tackles", "1"],
    ["misses", "Misses", "1"],
    ["safeties", "Safeties", "1"],
    ["gp", "GP", "1"]
  ]
};

const POSITION_SORTERS = {
  QB: (player) => [num(player.rating), num(player.tds), -num(player.ints), num(player.yards)],
  RB: (player) => [num(player.yards), num(player.tds), num(player.misses)],
  WR: (player) => [num(player.yards), num(player.tds), num(player.catches)],
  DB: (player) => [num(player.ints), num(player.swats), num(player.rating), num(player.denyPct)],
  DEF: (player) => [num(player.sacks), num(player.tackles), num(player.safeties)]
};

const SCHEDULE_WEEKS = Array.from({ length: 12 }, (_, index) => ({
  label: `Week ${index + 1}`,
  value: `week_${index + 1}`
}));

let activeScheduleWeek = "week_1";

function num(value) {
  return Number(value) || 0;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = clone(DEFAULT_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      teams: Array.isArray(parsed.teams) ? parsed.teams : [],
      players: Array.isArray(parsed.players) ? parsed.players : [],
      rules: Array.isArray(parsed.rules) ? parsed.rules : [],
      schedules: Array.isArray(parsed.schedules) ? parsed.schedules : []
    };
  } catch {
    const fresh = clone(DEFAULT_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function isLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function getLoggedInUser() {
  return sessionStorage.getItem(ADMIN_USER_KEY) || "";
}

function setActiveNav() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === "admin") {
      link.classList.add("active");
    }
  });
}

function setAdminVisibility() {
  const loginPanel = document.getElementById("login-panel");
  const adminPanel = document.getElementById("admin-panel");
  const sessionCopy = document.getElementById("admin-session-copy");

  if (!loginPanel || !adminPanel) return;

  if (isLoggedIn()) {
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    if (sessionCopy) {
      sessionCopy.textContent = `Signed in as ${getLoggedInUser()}.`;
    }
  } else {
    loginPanel.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
}

function renderPlayerFieldGrid(position) {
  const target = document.getElementById("player-field-grid");
  if (!target) return;

  target.innerHTML = PLAYER_FIELDS[position]
    .map(([name, label, step]) => `
      <label>
        <span>${label}</span>
        <input name="${name}" type="number" step="${step}" required />
      </label>
    `)
    .join("");
}

function compareMetricArrays(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const a = left[index] ?? 0;
    const b = right[index] ?? 0;
    if (a !== b) return b - a;
  }
  return 0;
}

function autoSortStandings(data) {
  data.teams
    .sort((a, b) => {
      if (num(b.points) !== num(a.points)) return num(b.points) - num(a.points);
      if (num(b.wins) !== num(a.wins)) return num(b.wins) - num(a.wins);
      return num(b.pointDifferential) - num(a.pointDifferential);
    })
    .forEach((team, index) => {
      team.rank = index + 1;
      team.seed = index + 1;
    });
}

function autoRankPlayers(data) {
  Object.keys(POSITION_SORTERS).forEach((position) => {
    const players = data.players
      .filter((player) => player.position === position)
      .sort((a, b) => compareMetricArrays(POSITION_SORTERS[position](a), POSITION_SORTERS[position](b)));

    players.forEach((player, index) => {
      player.rank = index + 1;
    });
  });
}

function renderWeekTabs() {
  const target = document.getElementById("schedule-week-tabs");
  const hiddenInput = document.getElementById("schedule-week");
  if (!target || !hiddenInput) return;

  hiddenInput.value = activeScheduleWeek;
  target.innerHTML = "";

  SCHEDULE_WEEKS.forEach((week) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${week.value === activeScheduleWeek ? " active" : ""}`;
    button.textContent = week.label;
    button.onclick = () => {
      activeScheduleWeek = week.value;
      renderWeekTabs();
      renderAdminLists();
    };
    target.appendChild(button);
  });
}

function renderTeamTable(data) {
  const body = document.getElementById("team-table-body");
  if (!body) return;

  const teams = data.teams.slice().sort((a, b) => num(a.rank) - num(b.rank));

  body.innerHTML = teams.length
    ? teams.map((team) => `
        <tr data-team-row="${team.id}">
          <td>${team.name}</td>
          <td><input class="admin-inline-input" name="division" type="number" min="1" value="${team.division}" /></td>
          <td><input class="admin-inline-input" name="rank" type="number" min="1" value="${team.rank}" /></td>
          <td><input class="admin-inline-input" name="seed" type="number" min="1" value="${team.seed}" /></td>
          <td><input class="admin-inline-input" name="wins" type="number" min="0" value="${team.wins}" /></td>
          <td><input class="admin-inline-input" name="losses" type="number" min="0" value="${team.losses}" /></td>
          <td><input class="admin-inline-input" name="pointDifferential" type="number" value="${team.pointDifferential}" /></td>
          <td><input class="admin-inline-input" name="points" type="number" min="0" value="${team.points}" /></td>
          <td class="center"><button class="button secondary" type="button" data-save-team="${team.id}">Save</button></td>
          <td class="center"><button class="ghost-button" type="button" data-delete-team="${team.id}">Delete</button></td>
        </tr>
      `).join("")
    : `<tr><td colspan="10" class="center">No teams added yet.</td></tr>`;
}

function renderPlayerList(data) {
  const target = document.getElementById("player-list");
  if (!target) return;

  const players = data.players.slice().sort((a, b) => num(a.rank) - num(b.rank));
  target.innerHTML = players.length
    ? players.map((player) => `
        <div class="admin-item">
          <div>
            <strong>${player.username}</strong>
            <p>${player.position} | Rank ${player.rank} | Division ${player.division}</p>
          </div>
          <button class="ghost-button" type="button" data-delete-player="${player.id}">Delete</button>
        </div>
      `).join("")
    : `<div class="admin-item"><div><strong>No stat entries yet</strong><p>Add players above and they will show here.</p></div></div>`;
}

function renderRuleList(data) {
  const target = document.getElementById("rule-list");
  if (!target) return;

  const rules = data.rules.slice().sort((a, b) => num(a.order) - num(b.order));
  target.innerHTML = rules.length
    ? rules.map((rule) => `
        <div class="admin-item">
          <div>
            <strong>${rule.title}</strong>
            <p>Rule ${rule.order}</p>
          </div>
          <button class="ghost-button" type="button" data-delete-rule="${rule.id}">Delete</button>
        </div>
      `).join("")
    : `<div class="admin-item"><div><strong>No rules yet</strong><p>Add rulebook entries above.</p></div></div>`;
}

function renderScheduleList(data) {
  const target = document.getElementById("schedule-list");
  if (!target) return;

  const games = data.schedules
    .filter((game) => game.week === activeScheduleWeek)
    .sort((a, b) => num(a.order) - num(b.order));

  target.innerHTML = games.length
    ? games.map((game) => `
        <div class="admin-item">
          <div>
            <strong>${game.awayTeam} @ ${game.homeTeam}</strong>
            <p>${game.result || "No result posted yet"}${game.note ? ` | ${game.note}` : ""}</p>
          </div>
          <button class="ghost-button" type="button" data-delete-schedule="${game.id}">Delete</button>
        </div>
      `).join("")
    : `<div class="admin-item"><div><strong>No matchups for this week</strong><p>Add games for the selected week.</p></div></div>`;
}

function renderAdminLists() {
  const data = getData();
  renderWeekTabs();
  renderTeamTable(data);
  renderPlayerList(data);
  renderRuleList(data);
  renderScheduleList(data);
  bindRowActions();
}

function bindRowActions() {
  document.querySelectorAll("[data-save-team]").forEach((button) => {
    button.onclick = () => {
      const row = button.closest("tr");
      const teamId = button.dataset.saveTeam;
      const data = getData();
      const team = data.teams.find((item) => item.id === teamId);
      if (!row || !team) return;

      team.division = num(row.querySelector('[name="division"]').value);
      team.rank = num(row.querySelector('[name="rank"]').value);
      team.seed = num(row.querySelector('[name="seed"]').value);
      team.wins = num(row.querySelector('[name="wins"]').value);
      team.losses = num(row.querySelector('[name="losses"]').value);
      team.pointDifferential = num(row.querySelector('[name="pointDifferential"]').value);
      team.points = num(row.querySelector('[name="points"]').value);
      saveData(data);
      renderAdminLists();
    };
  });

  document.querySelectorAll("[data-delete-team]").forEach((button) => {
    button.onclick = () => {
      const data = getData();
      data.teams = data.teams.filter((team) => team.id !== button.dataset.deleteTeam);
      saveData(data);
      renderAdminLists();
    };
  });

  document.querySelectorAll("[data-delete-player]").forEach((button) => {
    button.onclick = () => {
      const data = getData();
      data.players = data.players.filter((player) => player.id !== button.dataset.deletePlayer);
      saveData(data);
      renderAdminLists();
    };
  });

  document.querySelectorAll("[data-delete-rule]").forEach((button) => {
    button.onclick = () => {
      const data = getData();
      data.rules = data.rules.filter((rule) => rule.id !== button.dataset.deleteRule);
      saveData(data);
      renderAdminLists();
    };
  });

  document.querySelectorAll("[data-delete-schedule]").forEach((button) => {
    button.onclick = () => {
      const data = getData();
      data.schedules = data.schedules.filter((game) => game.id !== button.dataset.deleteSchedule);
      saveData(data);
      renderAdminLists();
    };
  });
}

function setupLogin() {
  const form = document.getElementById("login-form");
  const errorText = document.getElementById("login-error");
  const logoutButton = document.getElementById("logout-button");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("admin-username").value.trim();
      const password = document.getElementById("admin-password").value;

      if (ADMIN_USERS[username] && ADMIN_USERS[username] === password) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        sessionStorage.setItem(ADMIN_USER_KEY, username);
        errorText.classList.add("hidden");
        form.reset();
        setAdminVisibility();
        renderAdminLists();
      } else {
        errorText.classList.remove("hidden");
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
      setAdminVisibility();
    });
  }
}

function setupForms() {
  const teamForm = document.getElementById("team-form");
  const playerForm = document.getElementById("player-form");
  const playerPosition = document.getElementById("player-position");
  const ruleForm = document.getElementById("rule-form");
  const scheduleForm = document.getElementById("schedule-form");
  const autoAddTeamsButton = document.getElementById("auto-add-nfl-teams");
  const autoSortStandingsButton = document.getElementById("auto-sort-standings");
  const autoRankStatsButton = document.getElementById("auto-rank-stats");

  if (playerPosition) {
    renderPlayerFieldGrid(playerPosition.value);
    playerPosition.addEventListener("change", () => renderPlayerFieldGrid(playerPosition.value));
  }

  if (teamForm) {
    teamForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(teamForm);
      const data = getData();
      data.teams.push({
        id: makeId("team"),
        name: String(form.get("name")).trim(),
        division: num(form.get("division")),
        rank: num(form.get("rank")),
        seed: num(form.get("seed")),
        wins: num(form.get("wins")),
        losses: num(form.get("losses")),
        pointDifferential: num(form.get("pointDifferential")),
        points: num(form.get("points"))
      });
      saveData(data);
      teamForm.reset();
      renderAdminLists();
    });
  }

  if (playerForm) {
    playerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(playerForm);
      const position = String(form.get("position"));
      const player = {
        id: makeId("player"),
        username: String(form.get("username")).trim(),
        division: num(form.get("division")),
        position,
        statType: "season",
        rank: 999
      };

      PLAYER_FIELDS[position].forEach(([name]) => {
        player[name] = num(form.get(name));
      });

      const data = getData();
      data.players.push(player);
      autoRankPlayers(data);
      saveData(data);
      playerForm.reset();
      renderPlayerFieldGrid(position);
      renderAdminLists();
    });
  }

  if (ruleForm) {
    ruleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(ruleForm);
      const data = getData();
      data.rules.push({
        id: makeId("rule"),
        title: String(form.get("title")).trim(),
        order: num(form.get("order")),
        content: String(form.get("content")).trim()
      });
      saveData(data);
      ruleForm.reset();
      renderAdminLists();
    });
  }

  if (scheduleForm) {
    scheduleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(scheduleForm);
      const data = getData();
      data.schedules.push({
        id: makeId("schedule"),
        week: String(form.get("week")),
        order: num(form.get("order")),
        awayTeam: String(form.get("awayTeam")).trim(),
        homeTeam: String(form.get("homeTeam")).trim(),
        result: String(form.get("result")).trim(),
        note: String(form.get("note")).trim()
      });
      saveData(data);
      scheduleForm.reset();
      document.getElementById("schedule-week").value = activeScheduleWeek;
      renderAdminLists();
    });
  }

  if (autoAddTeamsButton) {
    autoAddTeamsButton.addEventListener("click", () => {
      const data = getData();
      if (!data.teams.length) {
        data.teams = NFL_TEAMS.map((name, index) => ({
          id: makeId("team"),
          name,
          division: Math.floor(index / 8) + 1,
          rank: index + 1,
          seed: index + 1,
          wins: 0,
          losses: 0,
          pointDifferential: 0,
          points: 0
        }));
        saveData(data);
      }
      renderAdminLists();
    });
  }

  if (autoSortStandingsButton) {
    autoSortStandingsButton.addEventListener("click", () => {
      const data = getData();
      autoSortStandings(data);
      saveData(data);
      renderAdminLists();
    });
  }

  if (autoRankStatsButton) {
    autoRankStatsButton.addEventListener("click", () => {
      const data = getData();
      autoRankPlayers(data);
      saveData(data);
      renderAdminLists();
    });
  }
}

setActiveNav();
setAdminVisibility();
setupLogin();
setupForms();

if (isLoggedIn()) {
  renderAdminLists();
}

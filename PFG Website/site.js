const STORAGE_KEY = "pfg-site-data";

const DEFAULT_DATA = {
  teams: [],
  players: [],
  rules: [],
  schedules: []
};

const STAT_COLUMNS = {
  QB: ["Rank", "Username", "Division", "Rating", "Comp %", "Comp", "Att", "Yards", "TDs", "INTs", "Sacks", "GP"],
  RB: ["Rank", "Username", "Division", "Att", "Yards", "Misses", "TDs", "GP"],
  WR: ["Rank", "Username", "Division", "Catches", "Targets", "Catch %", "Yards", "YAC", "YPC", "TDs", "GP"],
  DB: ["Rank", "Username", "Division", "Rating", "INTs", "Deny %", "Targets", "Comp A", "Yds A", "TD A", "Swats", "TDs", "GP"],
  DEF: ["Rank", "Username", "Division", "Sacks", "Tackles", "Misses", "Safeties", "GP"]
};

const SCHEDULE_WEEKS = Array.from({ length: 12 }, (_, index) => ({
  label: `Week ${index + 1}`,
  value: `week_${index + 1}`
}));

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSiteData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = cloneData(DEFAULT_DATA);
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
    const fresh = cloneData(DEFAULT_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function saveSiteData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("active");
    }
  });
}

function renderStandingsPage() {
  const body = document.getElementById("standings-body");
  if (!body) {
    return;
  }

  const empty = document.getElementById("standings-empty");
  const teams = getSiteData().teams.slice().sort((a, b) => a.rank - b.rank);
  body.innerHTML = "";

  if (!teams.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  teams.forEach((team) => {
    const totalGames = Number(team.wins) + Number(team.losses);
    const winPct = totalGames ? (Number(team.wins) / totalGames).toFixed(3) : "0.000";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team.name}</td>
      <td class="center">${team.division}</td>
      <td class="center">${team.rank}</td>
      <td class="center">${team.seed}</td>
      <td class="center">${team.wins}-${team.losses}</td>
      <td class="center">${winPct}</td>
      <td class="center">${team.pointDifferential}</td>
      <td class="center">${team.points}</td>
    `;
    body.appendChild(row);
  });
}

function createTabButtons(targetId, options, activeValue, onSelect) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${option.value === activeValue ? " active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => onSelect(option.value));
    target.appendChild(button);
  });
}

function renderStatsPage() {
  const head = document.getElementById("stats-head");
  const body = document.getElementById("stats-body");
  if (!head || !body) {
    return;
  }

  const state = { position: "QB" };

  function draw() {
    createTabButtons(
      "stats-position-tabs",
      [
        { label: "QB", value: "QB" },
        { label: "RB", value: "RB" },
        { label: "WR", value: "WR" },
        { label: "DB", value: "DB" },
        { label: "DEF", value: "DEF" }
      ],
      state.position,
      (value) => {
        state.position = value;
        draw();
      }
    );

    const entries = getSiteData().players
      .filter((player) => player.statType === "season" && player.position === state.position)
      .sort((a, b) => a.rank - b.rank);
    const columns = STAT_COLUMNS[state.position];

    head.innerHTML = "";
    body.innerHTML = "";

    columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      if (column !== "Username") {
        th.className = "center";
      }
      head.appendChild(th);
    });

    const empty = document.getElementById("stats-empty");
    if (!entries.length) {
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");
    entries.forEach((player) => {
      const row = document.createElement("tr");
      const values = {
        "Rank": player.rank ?? "-",
        "Username": player.username ?? "-",
        "Division": player.division ?? "-",
        "Rating": player.rating ?? "-",
        "Comp %": player.compPct ?? "-",
        "Comp": player.comp ?? "-",
        "Att": player.att ?? "-",
        "Yards": player.yards ?? "-",
        "TDs": player.tds ?? "-",
        "INTs": player.ints ?? "-",
        "Sacks": player.sacks ?? "-",
        "GP": player.gp ?? "-",
        "Misses": player.misses ?? "-",
        "Catches": player.catches ?? "-",
        "Targets": player.targets ?? "-",
        "Catch %": player.catchPct ?? "-",
        "YAC": player.yac ?? "-",
        "YPC": player.ypc ?? "-",
        "Deny %": player.denyPct ?? "-",
        "Comp A": player.compA ?? "-",
        "Yds A": player.ydsA ?? "-",
        "TD A": player.tdA ?? "-",
        "Swats": player.swats ?? "-",
        "Tackles": player.tackles ?? "-",
        "Safeties": player.safeties ?? "-"
      };

      row.innerHTML = columns
        .map((column) => {
          const className = column === "Username" ? "" : ' class="center"';
          return `<td${className}>${values[column] ?? "-"}</td>`;
        })
        .join("");
      body.appendChild(row);
    });
  }

  draw();
}

function renderRulebookPage() {
  const list = document.getElementById("rulebook-list");
  if (!list) {
    return;
  }

  const empty = document.getElementById("rulebook-empty");
  const rules = getSiteData().rules.slice().sort((a, b) => a.order - b.order);
  list.innerHTML = "";

  if (!rules.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  rules.forEach((rule) => {
    const article = document.createElement("article");
    article.className = "rule-card";
    article.innerHTML = `
      <span class="card-tag">Rule ${rule.order}</span>
      <h3>${rule.title}</h3>
      <p>${rule.content.replace(/\n/g, "<br />")}</p>
    `;
    list.appendChild(article);
  });
}

function renderSchedulePage() {
  const panel = document.getElementById("schedule-panel");
  if (!panel) {
    return;
  }

  const state = { week: "week_1" };

  function draw() {
    createTabButtons("schedule-tabs", SCHEDULE_WEEKS, state.week, (value) => {
      state.week = value;
      draw();
    });

    const weekNumber = state.week.split("_")[1];
    const games = getSiteData().schedules
      .filter((game) => game.week === state.week)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (!games.length) {
      panel.innerHTML = `
        <div class="schedule-template">
          <h2>Week ${weekNumber}</h2>
          <div class="schedule-box">
            No matchups have been posted for Week ${weekNumber} yet.
          </div>
        </div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="schedule-template">
        <h2>Week ${weekNumber}</h2>
        <div class="schedule-game-list">
          ${games.map((game) => `
            <article class="schedule-game-card">
              <div class="schedule-game-row">
                <strong>${game.awayTeam}</strong>
                <span>@</span>
                <strong>${game.homeTeam}</strong>
              </div>
              <div class="schedule-meta-row">
                <span>${game.result || "Result not posted yet"}</span>
                <span>${game.note || ""}</span>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  draw();
}

setActiveNav();
renderStandingsPage();
renderStatsPage();
renderRulebookPage();
renderSchedulePage();

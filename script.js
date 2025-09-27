// Load counts from localStorage
function loadCounts() {
  const savedTotal = localStorage.getItem("attendanceCount");
  if (savedTotal !== null) {
    counter = parseInt(savedTotal, 10);
    attendeeCountSpan.textContent = counter;
    progressBar.style.width = `${(counter / maxcount) * 100}%`;
  }
  Object.keys(TEAM_LABELS).forEach(function (team) {
    const savedTeamCount = localStorage.getItem(team + "Count");
    if (savedTeamCount !== null) {
      document.getElementById(team + "Count").textContent = savedTeamCount;
    }
  });
}
window.addEventListener("DOMContentLoaded", loadCounts);
// get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingEl = document.getElementById("greeting");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

let counter = 0;
const maxcount = 5;

// Map values -> labels (matches your <option value="">)
const TEAM_LABELS = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

// Guard: element present?
if (!greetingEl) {
  console.error("Missing #greeting element in the HTML.");
}

form.addEventListener("submit", function (event) {
  // Check if goal is reached
  if (counter >= maxcount) {
    // Find the winning team
    let winningTeam = "";
    let maxTeamCount = 0;
    for (const key in TEAM_LABELS) {
      const teamCountEl = document.getElementById(key + "Count");
      const teamCount = teamCountEl
        ? parseInt(teamCountEl.textContent || "0", 10)
        : 0;
      if (teamCount > maxTeamCount) {
        maxTeamCount = teamCount;
        winningTeam = key;
      }
    }
    const teamLabel = TEAM_LABELS[winningTeam] || "A Team";
    greetingEl.textContent = `🏆 Goal reached! Congratulations, ${teamLabel} is the winner! 🎉`;
    greetingEl.style.color = "#007c2a";
    setTimeout(function () {
      greetingEl.textContent = "";
    }, 30000); // 30 seconds
    form.reset();
    return;
  }
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  // Validation first; show message and stop
  if (!name || !team) {
    greetingEl.textContent = "⚠️ Please enter your name and select a team.";
    return;
  }

  // Safe label lookup
  const teamName = TEAM_LABELS[team] || "your team";

  // Update totals
  counter++;
  attendeeCountSpan.textContent = counter;
  localStorage.setItem("attendanceCount", counter);

  // Update progress bar
  progressBar.style.width = `${(counter / maxcount) * 100}%`;

  // Update the correct team's count
  const teamCounter = document.getElementById(team + "Count");
  if (teamCounter) {
    teamCounter.textContent = String(
      parseInt(teamCounter.textContent || "0", 10) + 1
    );
    localStorage.setItem(team + "Count", teamCounter.textContent);
  }

  // Show personalized greeting
  greetingEl.textContent = `🎉 Welcome, ${name} from ${teamName}!`;

  form.reset();
});

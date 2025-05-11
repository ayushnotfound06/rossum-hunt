// dashboard/script.js
let teamsData = [];
const IPV4 = "http://172.16.45.140:3000/"
async function loadTeams() {
  const res = await fetch(IPV4 + "teams");
  teamsData = await res.json();
}

function showDashboard() {
  const teamCode = localStorage.getItem("teamCode");
  if (!teamCode) {
    window.location.href = "login.html";
    return;
  }

  const team = teamsData.find(t => t.teamCode === teamCode);
  if (!team) {
    alert("Team not found.");
    localStorage.removeItem("teamCode");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("teamInfo").innerText = `Hello ${team.teamName}! Your Score: ${team.score}`;
  document.getElementById("letters").innerText = team.lettersUnlocked.join(" ") || "None";

  // Show the club name with blanks
  const fullClubName = "ROSSUM";
  let revealedName = "";

  for (let letter of fullClubName) {
    revealedName += team.lettersUnlocked.includes(letter) ? letter + " " : "_ ";
  }

document.getElementById("clubName").innerText = revealedName.trim();


  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";
  teamsData
    .sort((a, b) => b.score - a.score)
    .forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.teamName}: ${t.score}`;
      leaderboard.appendChild(li);
    });
}

window.onload = async () => {
  await loadTeams();
  showDashboard();
};

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Serve HTML, CSS, JS files from this folder
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

// Path to teams.json
const TEAMS_FILE = path.join(__dirname, "data", "teams.json");

app.get("/teams", (req, res) => {
  fs.readFile(TEAMS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read teams file" });
    res.json(JSON.parse(data));
  });
});

app.post("/update", (req, res) => {
  const { teamCode, points, letter } = req.body;

  fs.readFile(TEAMS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read teams file" });

    let teams = JSON.parse(data);
    const team = teams.find(t => t.teamCode === teamCode);

    if (!team) return res.status(404).json({ error: "Team not found" });

    const correctSequence = ["R", "O", "S", "S", "U", "M"];
    const expectedNextLetter = correctSequence[team.lettersUnlocked.length];

    if (letter !== expectedNextLetter) {
      return res.status(400).json({ error: `Invalid letter. Expected: '${expectedNextLetter}'` });
    }

    team.score += points;
    team.lettersUnlocked.push(letter);

    fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2), err => {
      if (err) return res.status(500).json({ error: "Failed to write to file" });
      res.json({ message: "Score updated", team });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
  

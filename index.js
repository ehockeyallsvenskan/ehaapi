const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 5501;


app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let playersData = [];
let accountsData = [];

function savePlayersData() {
  const playersFilePath = "./public/players.json"; // Ange den rätta sökvägen till players.json på webbhotellet
  fs.writeFileSync(playersFilePath, JSON.stringify(playersData, null, 2));
}

function saveAccountsData() {
  const accountsFilePath = "./public/accounts.json"; // Ange den rätta sökvägen till accounts.json på webbhotellet
  fs.writeFileSync(accountsFilePath, JSON.stringify(accountsData, null, 2));
}

function loadPlayersData() {
  const playersFilePath = "./public/players.json"; // Ange den rätta sökvägen till players.json på webbhotellet
  try {
    const players = fs.readFileSync(playersFilePath);
    playersData = JSON.parse(players);
  } catch (error) {
    playersData = [];
  }
}

function loadAccountsData() {
  const accountsFilePath = "./public/accounts.json"; // Ange den rätta sökvägen till accounts.json på webbhotellet
  try {
    const accounts = fs.readFileSync(accountsFilePath);
    accountsData = JSON.parse(accounts);
  } catch (error) {
    accountsData = [];
  }
}

loadPlayersData();
loadAccountsData();

app.post("/spelare", (request, response) => {
  let { name, number, team, position } = request.body;

  let playerData = {
    name,
    number,
    team,
    position,
    goals: 0,
    assists: 0
  };

  playersData.push(playerData);
  savePlayersData();

  response.status(200).json({ success: true });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = accountsData.find((account) => account.email === email && account.password === password);

  if (user) {
    res.status(200).json({ success: true, message: "Inloggning lyckades" });
  } else {
    res.status(401).json({ success: false, message: "Felaktig e-postadress eller lösenord" });
  }
});

app.post("/register", (req, res) => {
  const { email, username, password, isAdmin } = req.body;

  const existingUser = accountsData.find((account) => account.email === email);
  if (existingUser) {
    res.status(409).json({ success: false, message: "E-postadressen är redan registrerad" });
    return;
  }

  const newUser = { email, username, password, isAdmin };
  accountsData.push(newUser);
  saveAccountsData();

  res.status(201).json({ success: true, message: "Registreringen lyckades" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Ange sökvägen till din players.json-fil
const playersFilePath = path.join(__dirname, 'public', 'players.json');

// Ange sökvägen till mappen som innehåller den offentliga resursen
app.use(express.static('public'));

// Skapa en route för att serva players.json
app.get('/players.json', (req, res) => {
  res.sendFile(playersFilePath);
});

// Starta servern
app.listen(5500, () => {
  console.log('Server is running on port 3000');
});
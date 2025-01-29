// Array con le squadre e i budget iniziali
const teams = [
    { name: "Campari Team", budget: 500, purchases: [] },
    { name: "Pescaramanzia", budget: 500, purchases: [] },
    { name: "Fratelli Manna", budget: 500, purchases: [] },
    { name: "Berlusca Dortmund", budget: 500, purchases: [] },
    { name: "Jaguars Soccer Club", budget: 500, purchases: [] },
    { name: "Mutamosca", budget: 500, purchases: [] },
    { name: "Steggy Gou", budget: 500, purchases: [] },
    { name: "Passuli FC", budget: 500, purchases: [] }
  ];
  // Inizializza Firestore
const db = firebase.firestore();
const teamsRef = db.collection("teams");

// Funzione per visualizzare le squadre e la cronologia degli acquisti
function displayTeams() {
  const teamList = document.getElementById("teams");
  teamList.innerHTML = ""; // Pulisce la tabella

  teamsRef.orderBy("name").onSnapshot((snapshot) => {
    teamList.innerHTML = ""; // Reset tabella ogni aggiornamento

    snapshot.forEach((doc) => {
      const team = doc.data();
      const row = document.createElement("tr");
      const purchases = team.purchases
        ? team.purchases.map(p => `${p.player} (${p.cost} €)`).join(", ")
        : "Nessun acquisto";

      row.innerHTML = `
        <td>${team.name}</td>
        <td>${team.budget} €</td>
        <td>${purchases}</td>
      `;
      teamList.appendChild(row);
    });
  });
}

// Funzione per aggiornare il budget e registrare un acquisto
function updateBudget(teamName, playerName, cost) {
  const teamDoc = teamsRef.doc(teamName);

  teamDoc.get().then((doc) => {
    if (doc.exists) {
      const team = doc.data();
      if (team.budget >= cost) {
        // Aggiorna il budget e aggiungi l'acquisto
        teamDoc.update({
          budget: team.budget - cost,
          purchases: firebase.firestore.FieldValue.arrayUnion({ player: playerName, cost: cost })
        }).then(() => {
          console.log(`Acquisto registrato per ${teamName}`);
        }).catch((error) => console.error("Errore aggiornamento:", error));
      } else {
        alert("Budget insufficiente!");
      }
    } else {
      alert("Squadra non trovata!");
    }
  }).catch((error) => console.error("Errore lettura dati:", error));
}

// Gestore dell'evento per il form
document.getElementById("update-budget-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const teamName = document.getElementById("team-name").value.trim();
  const playerName = document.getElementById("player-name").value.trim();
  const playerCost = parseInt(document.getElementById("player-cost").value);

  if (teamName && playerName && !isNaN(playerCost) && playerCost > 0) {
    updateBudget(teamName, playerName, playerCost);
    e.target.reset();
  } else {
    alert("Per favore, riempi tutti i campi correttamente.");
  }
});

// Inizializza la tabella
displayTeams();

  

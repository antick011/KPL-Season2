// KPL Auction Portal: script.js
let playersData = [];
let currentPlayer = null;
let currentBid = 0;
let bidHistory = [];
let lastBidTeam = null;
let soldPlayers = [];

window.onload = async () => {
  try {
    const res = await fetch('data/players.json');
    const allPlayers = await res.json();

    // Load sold player data from localStorage
    soldPlayers = JSON.parse(localStorage.getItem('soldPlayers') || '[]');
    const soldIds = soldPlayers.map(p => p.id);

    // Filter unsold players
    playersData = allPlayers.filter(p => !soldIds.includes(p.id));
    localStorage.setItem('playersData', JSON.stringify(playersData)); // update local cache
  } catch (err) {
    console.error("Failed to load player data:", err);
  }
};

function searchPlayer() {
  const input = document.getElementById('searchInput').value.trim().toUpperCase();
  const player = playersData.find(p => (p.grade + p.id).toUpperCase() === input);

  if (!player) {
    alert("Player not found or already sold!");
    return;
  }

  currentPlayer = player;
  currentBid = player.baseprice || player.base_price || 0;
  bidHistory = [];
  lastBidTeam = null;

  const imgElement = document.getElementById('playerImg');
  imgElement.onerror = () => {
    imgElement.src = 'assets/players/default.png';
  };
  imgElement.src = `assets/players/${player.image}`;

  document.getElementById('playerName').textContent = player.name;
  document.getElementById('playerID').textContent = `${player.grade}${player.id}`;
  document.getElementById('playerRole').textContent = player.role;
  document.getElementById('playerFrom').textContent = player.address || "-";
  document.getElementById('playerPhone').textContent = player.phone || "-";
  document.getElementById('playerBase').textContent = player.baseprice;

  document.getElementById('lastBidTeam').textContent = "-";
  document.getElementById('lastBidAmount').textContent = "-";
  document.getElementById('bidHistory').innerHTML = "";
}


function getNextBidAmount() {
  if (currentBid < 100) return currentBid + 10;
  if (currentBid < 200) return currentBid + 20;
  if (currentBid < 500) return currentBid + 50;
  return currentBid + 100;
}

function placeBid(team) {
  if (!currentPlayer) {
    alert("Search a player first.");
    return;
  }

  const nextBid = getNextBidAmount();
  currentBid = nextBid;
  lastBidTeam = team;

  document.getElementById('lastBidTeam').textContent = team;
  document.getElementById('lastBidAmount').textContent = currentBid;

  bidHistory.unshift({ team, bid: currentBid });
bidHistory = bidHistory.slice(0, 5); // Keep only the last 5 bids

const bidList = document.getElementById('bidHistory');
bidList.innerHTML = "";
bidHistory.forEach(entry => {
  const li = document.createElement('li');
  li.innerHTML = `<span>${entry.team}</span><span>₹${entry.bid}</span>`;
  bidList.appendChild(li);
});

}

function markPlayerAsSold() {
  if (!currentPlayer || !lastBidTeam) {
    alert("Cannot mark as sold without an active bid.");
    return;
  }

  const soldPlayer = {
    ...currentPlayer,
    sold_to: lastBidTeam,
    sold_price: currentBid
  };

  // Save to localStorage
  let soldList = JSON.parse(localStorage.getItem('soldPlayers') || "[]");
  soldList.push(soldPlayer);
  localStorage.setItem('soldPlayers', JSON.stringify(soldList));

  // Update team data
  let teamData = JSON.parse(localStorage.getItem('teamsData') || "{}");
  if (!teamData[lastBidTeam]) {
    teamData[lastBidTeam] = { purse: 2000, players: [] };
  }

  teamData[lastBidTeam].purse -= currentBid;
  teamData[lastBidTeam].players.push({
    name: soldPlayer.name,
    role: soldPlayer.role,
    price: soldPlayer.sold_price
  });
  localStorage.setItem('teamsData', JSON.stringify(teamData));

  // Remove sold player from display list
  playersData = playersData.filter(p => p.id !== currentPlayer.id);
  localStorage.setItem('playersData', JSON.stringify(playersData));

  showSoldModal(`${soldPlayer.name} sold to ${lastBidTeam} for ₹${currentBid}`);
}

function showSoldModal(message) {
  const modal = document.getElementById('soldModal');
  const messageBox = document.getElementById('soldMessage');
  
  if (!modal || !messageBox) {
    console.error("Modal elements not found.");
    return;
  }

  messageBox.textContent = message;
  modal.style.display = 'flex'; // Show popup

  // Automatically hide after 2 seconds and then reload
  setTimeout(() => {
    modal.style.display = 'none';
    setTimeout(() => location.reload(), 300); // Slight delay before reload
  }, 2000);
}

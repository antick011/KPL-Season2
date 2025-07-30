// js/players.js

let players = [];

window.onload = () => {
  players = JSON.parse(localStorage.getItem('playersData')) || [];

  if (players.length === 0) {
    fetch('data/players.json')
      .then(res => res.json())
      .then(data => {
        players = data;
        localStorage.setItem('playersData', JSON.stringify(players));
        setupTabs(players);
        renderPool(players.filter(p => p.grade === players[0].grade));
      })
      .catch(err => console.error("Error loading players.json:", err));
  } else {
    setupTabs(players);
    renderPool(players.filter(p => p.grade === players[0].grade));
  }
};

function setupTabs(players) {
  const tabs = document.getElementById('poolTabs');
  const uniqueGrades = [...new Set(players.map(p => p.grade))];

  tabs.innerHTML = '';

  uniqueGrades.forEach((grade, i) => {
    const btn = document.createElement('button');
    btn.textContent = grade;
    btn.className = `pool-tab-btn ${i === 0 ? 'active' : ''}`;
    btn.onclick = () => {
      document.querySelectorAll('#poolTabs .pool-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPool(players.filter(p => p.grade === grade));
    };
    tabs.appendChild(btn);
  });
}


function renderPool(groupedPlayers) {
  const container = document.getElementById('poolContainer');
  container.innerHTML = '';

  const list = document.createElement('ul');
  list.className = 'pool-list';

  groupedPlayers.forEach(player => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${player.name}</strong> (${player.role})</span>
      <span>₹${player.baseprice} | ID: ${player.id}</span>
    `;
    list.appendChild(li);
  });

  container.appendChild(list);
}

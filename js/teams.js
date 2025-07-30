// js/teams.js

window.onload = () => {
  const teamData = JSON.parse(localStorage.getItem('teamsData') || '{}');

  const logos = {
    KKR: 'assets/logos/kkr.png',
    MI: 'assets/logos/mi.png',
    CSK: 'assets/logos/csk.png',
    RCB: 'assets/logos/rcb.png',
    GT: 'assets/logos/gt.png',
    SRH: 'assets/logos/srh.png',
    DC: 'assets/logos/dc.png',
    PBKS: 'assets/logos/pbks.png'
  };

  const tabsContainer = document.getElementById('teamTabs');
  const contentContainer = document.getElementById('teamsContainer');
  tabsContainer.innerHTML = '';

  Object.keys(logos).forEach((team, index) => {
    const button = document.createElement('button');
    button.textContent = team;
    button.dataset.team = team;
    button.className = `team-tab-btn ${index === 0 ? 'active' : ''}`;

    button.addEventListener('click', () => {
      document.querySelectorAll('#teamTabs .team-tab-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderTeamCard(teamData[team] || { purse: 2000, players: [] }, team, logos[team]);
    });

    tabsContainer.appendChild(button);
  });

  // Load the first team by default
  const firstTeam = Object.keys(logos)[0];
  renderTeamCard(teamData[firstTeam] || { purse: 2000, players: [] }, firstTeam, logos[firstTeam]);

  function renderTeamCard(data, teamName, logoSrc) {
    contentContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'team-card';

    const header = document.createElement('div');
    header.className = 'team-header';
    header.innerHTML = `
      <img src="${logoSrc}" alt="${teamName} logo">
      <h2>${teamName}</h2>
    `;

    const details = document.createElement('div');
    details.className = 'team-details';
    details.innerHTML = `
      <p><strong>Purse Left:</strong> ₹${data.purse}</p>
      <p><strong>Players Bought:</strong> ${data.players.length}</p>
    `;

    const table = document.createElement('table');
    table.className = 'player-table';
    const playerRows = data.players.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.role}</td>
        <td>₹${p.price}</td>
      </tr>
    `).join('');

    table.innerHTML = `
      <thead>
        <tr><th>Name</th><th>Role</th><th>Price</th></tr>
      </thead>
      <tbody>
        ${playerRows || '<tr><td colspan="3">No players yet</td></tr>'}
      </tbody>
    `;

    card.appendChild(header);
    card.appendChild(details);
    card.appendChild(table);
    contentContainer.appendChild(card);
  }
};

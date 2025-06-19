export function postTeamMultipleAndStoreDetails({ url, bodies, headers = {} }) {
  const teamDetails = [];

  bodies.forEach((body, index) => {
    cy.request({
      method: 'POST',
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const { name, _id, createdAt } = response.body;
      cy.log(`Created resource ${index + 1}: ID = ${_id}, Name = ${name}, Created At = ${createdAt}`);
      teamDetails.push({ name, _id, createdAt });

      if (teamDetails.length === bodies.length) {
        cy.wrap(teamDetails).as('createdTeams');
        Cypress.env('createdTeams', teamDetails);
        return cy.wrap(teamDetails);
      }
    });
  });
}

export function postAreasMultipleAndStoreDetails({ url, bodies, headers = {} }) {
  const areaDetails = [];

  bodies.forEach((body, index) => {
    cy.request({
      method: 'POST',
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const { name, state, city, _id, createdAt } = response.body;
      cy.log(`Created resource ${index + 1}: ID = ${_id}, Name = ${name}, Created At = ${createdAt}`);
      areaDetails.push({ name, state, city, _id, createdAt });

      if (areaDetails.length === bodies.length) {
        cy.wrap(areaDetails).as('createdAreas');
        Cypress.env('createdAreas', areaDetails);
        return cy.wrap(areaDetails);
      }
    });
  });
}

export function postMatchesMultipleAndStoreDetails({ url, bodies, headers = {} }) {
  const matchDetails = [];

  bodies.forEach((body, index) => {
    cy.request({
      method: 'POST',
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const { _id, areaId, matchDate, name, teamA, teamB, createdAt } = response.body;
      cy.log(`Created resource ${index + 1}: Area ID = ${areaId}, Match Date = ${matchDate}, Name = ${name}, Team A = ${teamA}, Team B = ${teamB}, Created At = ${createdAt}`);
      matchDetails.push({ _id, areaId, matchDate, name, teamA, teamB, createdAt });
      if (matchDetails.length === bodies.length) {
        cy.wrap(matchDetails).as('createdMatches');
        Cypress.env('createdMatches', matchDetails);
        return cy.wrap(matchDetails);
      }
    });
  });
}

export function postPlayersMultipleAndStoreDetails({ url, bodies, headers = {} }) {
  const playerDetails = [];

  bodies.forEach((body, index) => {
    cy.request({
      method: 'POST',
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const { name, dob, contact, email, teamId, gender, _id, createdAt } = response.body;
      cy.log(`Created resource ${index + 1}: ID = ${_id}, Name = ${name}, DOB = ${dob}, Team = ${teamId}, Created At = ${createdAt}`);
      playerDetails.push({ name, dob, contact, email, teamId, gender, _id, createdAt });
      if (playerDetails.length === bodies.length) {
        cy.wrap(playerDetails).as('createdPlayers');
        Cypress.env('createdPlayers', playerDetails);
        return cy.wrap(playerDetails);
      }
    });
  });
}
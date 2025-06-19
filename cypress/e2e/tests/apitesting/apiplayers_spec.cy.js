import { postTeamMultipleAndStoreDetails, postAreasMultipleAndStoreDetails, postMatchesMultipleAndStoreDetails, postPlayersMultipleAndStoreDetails } from '../../../support/apiUtils';

describe('API Create multiple teams and store their IDs and names', () => {
    const today = new Date();
    const year = today.getFullYear();
    const pastYear = year - 1;
    const futureYear = year + 1;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const pastMatchDate = `${pastYear}-${month}-${day}`;
    const currentMatchDate = `${year}-${month}-${day}`;
    const futureMatchDate = `${futureYear}-${month}-${day}`;
    const playerBirthDate = `${year - 20}-${month}-${day}`;

    before(() => {
        cy.task('clearMongoDB')
        cy.wrap(null).then(() => {
            postTeamMultipleAndStoreDetails({
                url: 'http://localhost:3000/api/team',
                bodies: [
                    { name: 'Team Alpha' },
                    { name: 'Team Beta' },
                    { name: 'Team Gamma' }
                ]
            });
        }).then(() => {
            postAreasMultipleAndStoreDetails({
                url: 'http://localhost:3000/api/area',
                bodies: [
                    { name: 'Area Alpha', state: 'State A', city: 'City A' },
                    { name: 'Area Beta', state: 'State B', city: 'City B' },
                    { name: 'Area Gamma', state: 'State C', city: 'City C' }
                ]
            });
        }).then(() => {

            // Wait for both teams and areas to be created
            cy.then(() => {
                const areas = Cypress.env('createdAreas');
                const teams = Cypress.env('createdTeams');
                if (!areas || !teams) {
                    throw new Error('Teams or Areas not created before posting matches');
                }
                postMatchesMultipleAndStoreDetails({
                    url: 'http://localhost:3000/api/match',
                    bodies: [
                        { areaId: areas[0]._id, matchDate: currentMatchDate, name: 'Match Alpha', teamA: teams[0]._id, teamB: teams[1]._id },
                        { areaId: areas[1]._id, matchDate: currentMatchDate, name: 'Match Beta', teamA: teams[1]._id, teamB: teams[2]._id },
                        { areaId: areas[2]._id, matchDate: currentMatchDate, name: 'Match Gamma', teamA: teams[2]._id, teamB: teams[0]._id },
                        { areaId: areas[0]._id, matchDate: pastMatchDate, name: 'Match Alpha', teamA: teams[0]._id, teamB: teams[1]._id },
                        { areaId: areas[1]._id, matchDate: pastMatchDate, name: 'Match Beta', teamA: teams[1]._id, teamB: teams[2]._id },
                        { areaId: areas[2]._id, matchDate: pastMatchDate, name: 'Match Gamma', teamA: teams[2]._id, teamB: teams[0]._id },
                        { areaId: areas[0]._id, matchDate: futureMatchDate, name: 'Match Alpha', teamA: teams[0]._id, teamB: teams[1]._id },
                        { areaId: areas[1]._id, matchDate: futureMatchDate, name: 'Match Beta', teamA: teams[1]._id, teamB: teams[2]._id },
                        { areaId: areas[2]._id, matchDate: futureMatchDate, name: 'Match Gamma', teamA: teams[2]._id, teamB: teams[0]._id }
                    ]
                });
            });
        }).then(() => {
            // Wait for both teams and areas to be created
            cy.then(() => {
                const areas = Cypress.env('createdAreas');
                const teams = Cypress.env('createdTeams');
                const matches = Cypress.env('createdMatches');
                if (!areas || !teams || !matches) {
                    throw new Error('Teams or Areas or matches not created before posting matches');
                }
                postPlayersMultipleAndStoreDetails({
                    url: 'http://localhost:3000/api/player',
                    bodies: [
                        { contact: '8754432109', dob: playerBirthDate, email: 'PlayerAlpha1@example.com', gender: 'MALE', name: 'Player Alpha 1', teamId: teams[0]._id },
                        { contact: '8754432108', dob: playerBirthDate, email: 'PlayerBeta1@example.com', gender: 'FEMALE', name: 'Player Beta 1', teamId: teams[1]._id },
                        { contact: '8754432107', dob: playerBirthDate, email: 'PlayerGamma1@example.com', gender: 'OTHER', name: 'Player Gamma 1', teamId: teams[2]._id },
                        { contact: '8754432106', dob: playerBirthDate, email: 'PlayerAlpha2@example.com', gender: 'MALE', name: 'Player Alpha 2', teamId: teams[0]._id },
                        { contact: '8754432105', dob: playerBirthDate, email: 'PlayerBeta2@example.com', gender: 'FEMALE', name: 'Player Beta 2', teamId: teams[1]._id },
                        { contact: '8754432104', dob: playerBirthDate, email: 'PlayerGamma2@example.com', gender: 'OTHER', name: 'Player Gamma 2', teamId: teams[2]._id },
                        { contact: '8754432103', dob: playerBirthDate, email: 'PlayerAlpha3@example.com', gender: 'MALE', name: 'Player Alpha 3', teamId: teams[0]._id },
                        { contact: '8754432102', dob: playerBirthDate, email: 'PlayerBeta3@example.com', gender: 'FEMALE', name: 'Player Beta 3', teamId: teams[1]._id },
                        { contact: '8754432101', dob: playerBirthDate, email: 'PlayerGamma3@example.com', gender: 'OTHER', name: 'Player Gamma 3', teamId: teams[2]._id }
                    ]
                });
            });
        });
    });

    // API validation for the created players
    it('should validate created players details using GET', function () {
        cy.get('@createdPlayers').then((players) => {
            players.forEach(({ _id, contact, dob, email, gender, name, teamId }) => {
                cy.log(`Validating player: ${name} with ID: ${_id} `);
                cy.request('http://localhost:3000/api/player/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(player => player._id === _id && player.name === name && player.email === email && player.contact === contact && player.dob === dob && player.gender === gender && player.teamId._id === teamId);
                    expect(found, `Player with ID: ${_id}, name: ${name}, email: ${email}, contact: ${contact}, dob: ${dob}, gender: ${gender}, teamId: ${teamId} should exist`).to.be.true;
                });
            });
        });
    });

    // API validation for the dropdown list of Status and the Areas
    it('should validate created players with Team dropdown', function () {
        const players = Cypress.env('createdPlayers');
        players.forEach(({ _id, contact, dob, email, gender, name, teamId }) => {
            // Filter by Team Name
            cy.request(`http://localhost:3000/api/player/all?teamId=${teamId}`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body).to.have.lengthOf(3);
                const found = response.body.some(player => player.teamId._id === teamId && player.name === name && player.email === email && player.contact === contact && player.dob === dob && player.gender === gender);
                expect(found, `Player with ID: ${_id}, name: ${name}, email: ${email}, contact: ${contact}, dob: ${dob}, gender: ${gender}, teamId: ${teamId} should exist`).to.be.true;
            });

        });
    });

    // API validation for the updated players
    it('should validate update players details using PATCH', function () {
        const players = Cypress.env('createdPlayers');
        players.forEach(({ _id, contact, dob, email, gender, name, teamId, createdAt }) => {
            cy.log(`Validating player: ${name} with Team ID: ${teamId} and Player ID: ${_id}`);
            if (name === 'Player Beta 1') {
                const normalized = new Date(dob).toISOString().split('T')[0];
                const updatedData = {
                    // contact: `${contact}`,
                    // createdAt: `${createdAt}`,
                    // dob: `${normalized}`,
                    // email: `${email}`,
                    // gender: `${gender}`,
                    id: `${_id}`,
                    name: "Player Beta 1 Updated",
                    // teamId: `${teamId}`,
                    // updatedAt: `${createdAt}`,
                    // _id: `${_id}`
                };
                cy.request({
                    method: 'PATCH',
                    url: `http://localhost:3000/api/player`,
                    body: updatedData
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ _id, name: `${updatedData.name}` });
                });

                cy.request('http://localhost:3000/api/player/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(player => player._id === _id && player.name === `${updatedData.name}`);
                    expect(found, `Player with Player ID: ${_id} and name: ${updatedData.name} should exist`).to.be.true;
                });
            }
        });
    });

    // API validation for Delete Player
    it('should validate delete player details using DELETE', function () {
        const players = Cypress.env('createdPlayers');
        players.forEach(({ _id, name }) => {
            cy.log(`Validating player: ${name} with Player ID: ${_id}`);
            if (name === 'Player Alpha 1') {
                cy.request({
                    method: 'DELETE',
                    url: `http://localhost:3000/api/player?id=${_id}`,
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ "status": "success", "message": "Player deleted successfully!" });
                });
            }
        });
    });
});

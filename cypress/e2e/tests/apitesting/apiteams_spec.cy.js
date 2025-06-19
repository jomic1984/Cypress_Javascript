import { postTeamMultipleAndStoreDetails } from '../../../support/apiUtils';

describe('API Create multiple teams and store their IDs and names', () => {
    before(() => {
        cy.task('clearMongoDB')
        postTeamMultipleAndStoreDetails({
            url: 'http://localhost:3000/api/team',
            bodies: [
                { name: 'Team Alpha' },
                { name: 'Team Beta' },
                { name: 'Team Gamma' }
            ]
        });

    });

    // API validation for the created teams
    it('should validate created team details using GET', function () {
        cy.get('@createdTeams').then((teams) => {
            teams.forEach(({ _id, name }) => {
                cy.log(`Validating team: ${name} with ID: ${_id}`);
                cy.request('http://localhost:3000/api/team/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(team => team._id === _id && team.name === name);
                    expect(found, `Team with ID: ${_id} and name: ${name} should exist`).to.be.true;
                });
            });
        });
    });

    // API validation for the updated team
    it('should validate update team details using PATCH', function () {
        const teams = Cypress.env('createdTeams');
        teams.forEach(({ _id, name, createdAt }) => {
            cy.log(`Validating team: ${name} with ID: ${_id} created at: ${createdAt}`);
            if (name === 'Team Beta') {
                const updatedData = {
                    // createdAt: `${createdAt}`,
                    id: `${_id}`,
                    name: 'Team Beta Updated',
                    // updatedAt: `${createdAt}`,
                    // _id: `${_id}`
                };
                cy.request({
                    method: 'PATCH',
                    url: `http://localhost:3000/api/team`,
                    body: updatedData
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ _id, name: `${updatedData.name}` });
                });

                cy.request('http://localhost:3000/api/team/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(team => team._id === _id && team.name === `${updatedData.name}`);
                    expect(found, `Team with ID: ${_id} and name: ${updatedData.name} should exist`).to.be.true;
                });
            }
        });
    });

    // API validation for Delete Team
    it('should validate delete team details using DELETE', function () {
        const teams = Cypress.env('createdTeams');
        teams.forEach(({ _id, name, createdAt }) => {
            cy.log(`Validating team: ${name} with ID: ${_id} created at: ${createdAt}`);
            if (name === 'Team Alpha') {
                cy.request({
                    method: 'DELETE',
                    url: `http://localhost:3000/api/team?id=${_id}`,
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ "status": "success", "message": "Team deleted successfully!" });
                });
            }
        });
    });
});

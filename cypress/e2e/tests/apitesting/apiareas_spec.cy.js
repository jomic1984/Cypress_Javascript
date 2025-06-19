import { postAreasMultipleAndStoreDetails } from '../../../support/apiUtils';

describe('API Create multiple teams and store their IDs and names', () => {
    before(() => {
        cy.task('clearMongoDB')
        postAreasMultipleAndStoreDetails({
            url: 'http://localhost:3000/api/area',
            bodies: [
                { name: 'Area Alpha', state: 'State A', city: 'City A' },
                { name: 'Area Beta', state: 'State B', city: 'City B' },
                { name: 'Area Gamma', state: 'State C', city: 'City C' }
            ]
        });
    });

    // API validation for the created areas
    it('should validate created area details using GET', function () {
        cy.get('@createdAreas').then((areas) => {
            areas.forEach(({ _id, name, state, city }) => {
                cy.log(`Validating area: ${name} with ID: ${_id}`);
                cy.request('http://localhost:3000/api/area/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(area => area._id === _id && area.name === name && area.state === state && area.city === city);
                    expect(found, `Area with ID: ${_id}, name: ${name}, state: ${state}, city: ${city} should exist`).to.be.true;
                });
            });
        });
    });

    // API validation for the updated area
    it('should validate update area details using PATCH', function () {
        const areas = Cypress.env('createdAreas');
        areas.forEach(({ _id, name, createdAt }) => {
            cy.log(`Validating area: ${name} with ID: ${_id} created at: ${createdAt}`);
            if (name === 'Area Beta') {
                const updatedData = {
                    // createdAt: `${createdAt}`,
                    id: `${_id}`,
                    name: 'Area Beta Updated',
                    // updatedAt: `${createdAt}`,
                    // _id: `${_id}`
                };
                cy.request({
                    method: 'PATCH',
                    url: `http://localhost:3000/api/area`,
                    body: updatedData
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ _id, name: `${updatedData.name}` });
                });

                cy.request('http://localhost:3000/api/area/all').then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('array');
                    const found = response.body.some(area => area._id === _id && area.name === `${updatedData.name}`);
                    expect(found, `Area with ID: ${_id} and name: ${updatedData.name} should exist`).to.be.true;
                });
            }
        });
    });

    // API validation for Delete Area
    it('should validate delete area details using DELETE', function () {
        const areas = Cypress.env('createdAreas');
        areas.forEach(({ _id, name, createdAt }) => {
            cy.log(`Validating area: ${name} with ID: ${_id} created at: ${createdAt}`);
            if (name === 'Area Alpha') {
                cy.request({
                    method: 'DELETE',
                    url: `http://localhost:3000/api/area?id=${_id}`,
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.deep.include({ "status": "success", "message": "Area deleted successfully!" });
                });
            }
        });
    });
});

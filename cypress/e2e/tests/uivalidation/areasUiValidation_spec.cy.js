import AreaPage from '../../pages/areas/AreaPage'
import commonSelectors from "../../page_objects/common/CommonSelectors";
import areaSelectors from '../../page_objects/areas/areaSelectors'

describe('Area Module UI Validation Tests', () => {

    const areaPage = new AreaPage()

    before(() => {
        cy.task('clearMongoDB')
    })

    // This test case is to validate the area page UI elements
    it('should validate the area page', () => {
        areaPage.visit()
        cy.get(commonSelectors.TableNoData).eq(2).should('have.text', 'Area')
        cy.get(commonSelectors.TableNoData).eq(3).should('have.text', 'add, update, delete and show list of area details')
        cy.get(commonSelectors.TableHeading).should('have.text', 'No data found')
        cy.get(commonSelectors.TableNoData).should('contain', 'please add new area')
        cy.contains('button', areaSelectors.AddAreaButton).should('be.visible')
        cy.get(commonSelectors.TableHeader).then($headers => {
            const actualHeadings = [...$headers].map(h => h.innerText.trim());
            expect(actualHeadings).to.include.members(['AREA NAME', 'STATE', 'CITY', 'ACTION']);
        });
    })

    // This test case will fail as the application is allowing to create area multiple times
    it('should validate the area creation for duplicate', () => {
        cy.fixture('areaData.json').then((areas) => {
            areas.forEach((area) => {
                cy.request('POST', 'http://localhost:3000/api/area', area)
            })
        })
        areaPage.visit()
        areaPage.createArea("Whitefield", "Karnataka", "Bangalore")
        cy.getPageLoaded();
        cy.get(commonSelectors.TableFirstcolumn).then(($cells) => {
            const count = [...$cells].filter(cell => cell.innerText === "Whitefield").length
            expect(count).to.be.equals(1)
        })
    })

    // This test case is to validate proper error message when mandatory fields are not filled
    it('should show proper error message when mandatory fields are not filled', () => {
        areaPage.visit()

        // Not filling Area name
        cy.contains('button', areaSelectors.AddAreaButton).click()
        cy.get(areaSelectors.EnterStateName).type("Karnataka")
        cy.get(areaSelectors.EnterCityName).type("Bangalore")
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
        cy.wait(1000)
        cy.get(areaSelectors.EnterAreaName).then(($input) => {
            const message = $input[0].validationMessage;
            expect(message).to.eq('Please fill out this field.');
        });
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

        // Not filling the State name
        cy.contains('button', areaSelectors.AddAreaButton).click()
        cy.get(areaSelectors.EnterAreaName).type("Whitefield")
        cy.get(areaSelectors.EnterCityName).type("Bangalore")
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
        cy.wait(1000)
        cy.get(areaSelectors.EnterStateName).then(($input) => {
            const message = $input[0].validationMessage;
            expect(message).to.eq('Please fill out this field.');
        });
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

        // Not filling the City name
        cy.contains('button', areaSelectors.AddAreaButton).click()
        cy.get(areaSelectors.EnterAreaName).type("Whitefield")
        cy.get(areaSelectors.EnterStateName).type("Karnataka")
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
        cy.wait(1000)
        cy.get(areaSelectors.EnterCityName).then(($input) => {
            const message = $input[0].validationMessage;
            expect(message).to.eq('Please fill out this field.');
        });
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()
    })
})

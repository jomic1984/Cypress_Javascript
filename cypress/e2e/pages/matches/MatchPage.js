import commonSelectors from "../../page_objects/common/CommonSelectors";
import matchSelectors from "../../page_objects/matches/MatchSelectors";
class MatchPage {

    // Method to visit the Match page
    // It waits for the page to load completely before proceeding
    visit() {
        cy.visit('/matches')
        cy.getPageLoaded();
    }

    // Method to get the list of matches displayed in the table
    getMatchList() {
        return cy.get(commonSelectors.TableFirstcolumn)
    }

    // Method to create a new match
    // It accepts the match name, date, teams, and area as parameters
    createMatch(matchName, matchDate, firstTeam, secondTeam, area) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(matchSelectors.MatchAddedSuccessfully)
        });

        cy.contains('button', matchSelectors.AddMatchButton).click()
        cy.get(matchSelectors.EnterMatchName).type(matchName)
        cy.get(commonSelectors.Date).type(matchDate)
        cy.get(matchSelectors.EnterAreaName).select(area)
        cy.get(matchSelectors.EnterFirstTeamName).select(firstTeam)
        cy.get(matchSelectors.EnterSecondTeamName).select(secondTeam)
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    }

    // Method to filter matches by status
    // It accepts the status as a parameter
    getFilterByStatus(status) {
        cy.get(commonSelectors.SelectDropdown).eq(0).select(status)
        cy.getPageLoaded();
    }

    // Method to filter matches by area
    // It accepts the area as a parameter
    getFilteredByArea(area) {
        cy.get(commonSelectors.SelectDropdown).eq(1).select(area)
        cy.getPageLoaded();
    }

    // Method to filter matches by area and status
    // It accepts the status and area as parameters
    getFilteredByAreaAndStatus(status, area) {
        cy.get(commonSelectors.SelectDropdown).eq(0).select(status)
        cy.get(commonSelectors.SelectDropdown).eq(1).select(area)
        cy.getPageLoaded();
    }

    // Method to get the filtered row count
    getFilteredByRowCount() {
        return cy.get(commonSelectors.RowCount)
    }

    // Method to update the match
    // It accepts the old and new match name, date, area, and teams as parameters
    updateMatch(oldMatchName, newMatchName, newDate, newArea, newFirstTeam, newSecondTeam) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(matchSelectors.MatchUpdatedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === oldMatchName) {
                cy.get(commonSelectors.TableSixthcolumn).eq(index).find(commonSelectors.EditTableButton).closest('button').click()
                cy.get(matchSelectors.EnterMatchName).clear().type(newMatchName)
                cy.get(commonSelectors.Date).clear().type(newDate)
                cy.get(matchSelectors.EnterAreaName).select(newArea)
                cy.get(matchSelectors.EnterFirstTeamName).select(newFirstTeam)
                cy.get(matchSelectors.EnterSecondTeamName).select(newSecondTeam)
                cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.UpdateButton).click()
            }
        })
    }

    // Method to reset the filters
    getFilterReset() {
        cy.getPageLoaded();
        cy.contains('button', commonSelectors.FilterResetButton).click()
        cy.getPageLoaded();
    }

    // Method to delete the match
    // It accepts the match name as a parameter
    deleteMatch(matchName) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(matchSelectors.MatchDeletedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === matchName) {
                // To click the delete button in the row
                cy.get(commonSelectors.TableSixthcolumn).eq(index).find('button').eq(1).click()
                cy.wait(1000)
                cy.contains('button', commonSelectors.DeletePopupButton).click()
            }
        })
    }
}
export default MatchPage

import commonSelectors from "../../page_objects/common/CommonSelectors";
import teamSelectors from "../../page_objects/teams/TeamSelectors";
class TeamPage {

    // Method to visit the Team page
    // It waits for the page to load completely before proceeding
    visit() {
        cy.visit('/team')
        cy.getPageLoaded();
    }

    // Method to get the list of teams displayed in the table
    getTeamList() {
        return cy.get(commonSelectors.TableFirstcolumn)
    }

    // Method to create a new team
    // It accepts the team name as a parameter
    createTeam(name) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(teamSelectors.TeamAddedSuccessfully)
        });
        cy.contains('button', teamSelectors.AddTeamButton).click()
        cy.get(teamSelectors.EnterTeamName).type(name)
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    }

    // Method to update the team
    // It accepts the old and new team names as parameters
    updateTeam(oldName, newName) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(teamSelectors.TeamUpdatedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === oldName) {
                cy.get(commonSelectors.TableSecondcolumn).eq(index).find(commonSelectors.EditTableButton).closest('button').click()
                cy.get(teamSelectors.EnterTeamName).clear().type(newName)
                cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.UpdateButton).click()
            }
        })
    }

    // Method to delete the team
    // It accepts the team name as a parameter
    deleteTeam(name) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(teamSelectors.TeamDeletedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === name) {
                // To click the delete button in the row
                cy.get(commonSelectors.TableSecondcolumn).eq(index).find('button').eq(1).click()
                cy.wait(1000)
                cy.contains('button', commonSelectors.DeletePopupButton).click()
            }
        })
    }
}

export default TeamPage

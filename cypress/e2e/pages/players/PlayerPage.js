import commonSelectors from "../../page_objects/common/CommonSelectors";
import playerSelectors from "../../page_objects/players/PlayerSelectors";
class PlayerPage {

    // Method to visit the Player page
    // It waits for the page to load completely before proceeding
    visit() {
        cy.visit('/')
        cy.getPageLoaded();
    }

    // Method to get the list of players displayed in the table
    getPlayerList() {
        return cy.get(commonSelectors.TableFirstcolumn)
    }

    // Method to create a new player
    // It accepts the player's details as parameters
    createPlayer(name, dob, email, contact, gender, team) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(playerSelectors.PlayerAddedSuccessfully)
        });
        cy.contains('button', playerSelectors.AddPlayerButton).click()
        cy.get(playerSelectors.EnterPlayerName).type(name)
        cy.get(commonSelectors.Date).type(dob)
        cy.get(playerSelectors.Email).type(email)
        cy.get(playerSelectors.Contact).type(contact)
        cy.get(playerSelectors.Gender).select(gender)
        cy.get(playerSelectors.Team).select(team)
        cy.get(commonSelectors.PageFooter).find('button').contains('Add').click()
    }

    // Method to create a new player using the UI validations
    // It accepts the player's details as parameters
    createPlayerUI(name, dob, contact, gender, team) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(playerSelectors.PlayerAddedSuccessfully)
        });
        cy.contains('button', playerSelectors.AddPlayerButton).click()
        cy.get(playerSelectors.EnterPlayerName).type(name)
        cy.get(commonSelectors.Date).type(dob)
        cy.get(playerSelectors.Contact).type(contact)
        cy.get(playerSelectors.Gender).select(gender)
        cy.get(playerSelectors.Team).select(team)
        cy.get(commonSelectors.PageFooter).find('button').contains('Add').click()
    }

    // Method to filter players by team
    // It accepts the team as a parameter
    getFilterByTeam(team) {
        cy.get(commonSelectors.SelectDropdown).eq(0).select(team)
        cy.getPageLoaded();
    }

    // Method to get the filtered row count
    getFilteredByRowCount() {
        return cy.get(commonSelectors.RowCount)
    }

    // Method to update the player
    // It accepts the old and new player details as parameters
    updatePlayer(oldName, newName, dob, email, contact, gender, team) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(playerSelectors.PlayerUpdatedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === oldName) {
                cy.get(commonSelectors.TableSeventhcolumn).eq(index).find(commonSelectors.EditTableButton).closest('button').click()
                cy.getPageLoaded();
                cy.get(playerSelectors.EnterPlayerName).should('be.visible')
                cy.get(playerSelectors.EnterPlayerName).clear().type(newName)
                cy.get(commonSelectors.Date).clear().type(dob)
                cy.get(playerSelectors.Email).clear().type(email)
                cy.get(playerSelectors.Contact).clear().type(contact)
                cy.get(playerSelectors.Gender).select(gender)
                cy.get(playerSelectors.Team).select(team)
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

    // Method to delete the player
    // It accepts the player name as a parameter
    deletePlayer(name) {
        cy.on('window:alert', (alertText) => {
            const lines = alertText.split('\n')
            expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
            expect(lines[1]).to.equal(playerSelectors.PlayerDeletedSuccessfully)
        });
        cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
        cy.wait(1000)
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === name) {
                // To click the delete button in the row
                cy.get(commonSelectors.TableSeventhcolumn).eq(index).find('button').eq(1).click()
                cy.wait(1000)
                cy.contains('button', commonSelectors.DeletePopupButton).click()
            }
        })
    }
}

export default PlayerPage

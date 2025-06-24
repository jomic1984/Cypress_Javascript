import TeamPage from '../../pages/teams/TeamPage'
import commonSelectors from "../../page_objects/common/CommonSelectors";
import teamSelectors from "../../page_objects/teams/TeamSelectors";

describe('Team Module UI Validation Tests', () => {
    const teamPage = new TeamPage()

    before(() => {
        cy.task('clearMongoDB')
    })

    // This test case is to validate the teams page UI elements
    it('should validate the teams page', () => {
        teamPage.visit()
        cy.get(commonSelectors.TableNoData).eq(2).should('have.text', 'Team')
        cy.get(commonSelectors.TableNoData).eq(3).should('have.text', 'add, update, delete and show list of team details')
        cy.get(commonSelectors.TableHeading).should('have.text', 'No data found')
        cy.get(commonSelectors.TableNoData).should('contain', 'please add new team')
        cy.contains('button', teamSelectors.AddTeamButton).should('be.visible')
        cy.get(commonSelectors.TableHeader).then($headers => {
            const actualHeadings = [...$headers].map(h => h.innerText.trim());
            expect(actualHeadings).to.include.members(['TEAM NAME', 'ACTION']);
        });
    })

    // This test case will fail becase the application is allowing to save the same Team name multiple times
    it('should validate the application allowing same Team name multiple times', () => {
        teamPage.visit()
        teamPage.createTeam("Team 1")
        teamPage.getTeamList().should('contain', "Team 1")
        teamPage.createTeam("Team 1")
        cy.getPageLoaded();
        cy.get(commonSelectors.TableFirstcolumn).then(($cells) => {
            const count = [...$cells].filter(cell => cell.innerText === "Team 1").length
            expect(count).to.be.equals(1)
        })
    })

    // This will validate the for proper information when Add button is clicked without any information
    it('should show proper error message when mandatory fields are not filled', () => {
        teamPage.visit()

        // Not filling Team name
        cy.contains('button', teamSelectors.AddTeamButton).click()
        cy.get(teamSelectors.EnterTeamName).clear()
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()

        cy.wait(1000)
        cy.get(teamSelectors.EnterTeamName).then(($input) => {
            const message = $input[0].validationMessage;
            expect(message).to.eq('Please fill out this field.');
        });
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

    })
})

import PlayerPage from '../../pages/players/PlayerPage'
import playerSelectors from "../../page_objects/players/PlayerSelectors";
import commonSelectors from "../../page_objects/common/CommonSelectors";

describe('Player Module UI Validation Tests', () => {

    const playerPage = new PlayerPage()

    before(() => {
        cy.task('clearMongoDB')
        cy.fixture('teamData.json').then((teams) => {
            teams.forEach((team) => {
                cy.request('POST', 'http://localhost:3000/api/team', team)
            })
        })
    })

    // This test case is to validate the players page UI elements
    it('should validate the players page', () => {
        playerPage.visit()
        cy.get(commonSelectors.TableNoData).eq(2).should('have.text', 'Player')
        cy.get(commonSelectors.TableNoData).eq(3).should('have.text', 'add, update, delete and show list of player details')
        cy.get(commonSelectors.TableHeading).should('contain', 'No data found')
        cy.get(commonSelectors.TableNoData).should('contain', 'please add new player')
        cy.contains('button', playerSelectors.AddPlayerButton).should('be.visible')
        cy.get(commonSelectors.SelectDropdown).eq(0).should('be.visible')
        cy.get(commonSelectors.SelectDropdown).eq(0).should('contain', 'Select Team')
        cy.contains('button', commonSelectors.FilterResetButton).should('be.visible')
        cy.contains('button', commonSelectors.FilterResetButton).should('be.disabled')
        cy.get(commonSelectors.TableHeader).then($headers => {
            const actualHeadings = [...$headers].map(h => h.innerText.trim());
            expect(actualHeadings).to.include.members(['PLAYER NAME', 'EMAIL', 'CONTACT', 'GENDER', 'DOB', 'TEAM', 'ACTION']);
        });
    })

    // This test case will fail because Team is not a mandatory field in the UI but it is mandatory in the API
    it('should validate the player page for mandatory fields', () => {
        playerPage.visit()
        playerPage.createPlayerUI("UIPlayerValidation", "1984-05-28", "8754432109", "MALE", "")
        playerPage.getPlayerList().should('contain', "UIPlayerValidation")
    })

    // This test case is to validate the email ID pattern
    it('should validate email ID pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"', () => {
        playerPage.visit()
        // This test case will pass since it validates the requirement of @ symbol in the email
        playerPage.createPlayer("UIPlayerValidation", "1984-05-28", "abc_gmail.com", "8754432109", "MALE", "")
        cy.get(playerSelectors.Email).then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
        });

        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

        // This test case will fail since it is not validating the requirement of .com in the email but the application is allowing it
        playerPage.createPlayer("UIPlayerValidation", "1984-05-28", "abc@gmailcom", "8754432109", "MALE", "")
        cy.get(playerSelectors.Email).then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
        });
    })

    // This test case will Pass beacause the application is validating for the correct pattern of mobile numbers
    it('should validate phone number pattern="[6-9]{1}[0-9]{9}"', () => {
        playerPage.visit()
        playerPage.createPlayerUI("UIPlayerValidation", "1984-05-28", "2345678901", "MALE", "")
        cy.get(playerSelectors.Contact).then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
        });
    })

    // This test case should fail because the application is allowing the future date of birth which by logically wrong.
    it('should validate Date of Birth less than the current year', () => {
        playerPage.visit()
        playerPage.createPlayer("UIPlayerValidationDOB", "2050-05-28", "Example_abc@gmail.com", "8754432109", "MALE", "Team 1")
        cy.getPageLoaded();
        playerPage.getPlayerList().should('not.contain', "UIPlayerValidationDOB")
    })

    // This test case should also fail becasue a same player cannot be added twice. Validating using the mobile number.
    // But the application is allowing it.
    it('should validate not to allow duplicate player details', () => {
        playerPage.visit()
        playerPage.createPlayer("UIPlayerValidation1", "1984-05-28", "Example_abc@gmail.com", "8754432117", "MALE", "Team 1")
        playerPage.createPlayer("UIPlayerValidation1", "1984-05-28", "Example_abc@gmail.com", "8754432117", "MALE", "Team 1")
        cy.getPageLoaded();
        cy.get(commonSelectors.WholeTableThirdColumn).then(($cells) => {
            const count = [...$cells].filter(cell => cell.innerText === "8754432117").length
            expect(count).to.be.equals(1)
        })
    })

    // This test case is to validate the response of the page when 1000 players data is loaded
    it('should validate the page reponse when 1000 players data is loaded', () => {
        cy.fixture('players_1000.json').then((players) => {
            players.forEach((player) => {
                cy.request('POST', 'http://localhost:3000/api/player', player)
            })
        })
        playerPage.visit()
        playerPage.updatePlayer("Player 4", "UI Player Validation 4", "2005-01-01", "abc@example.com", "9876543210", "FEMALE", "Team 1")
        playerPage.getPlayerList().should('contain', 'UI Player Validation 4')

    })
})
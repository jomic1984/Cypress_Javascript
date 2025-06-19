import PlayerPage from '../../pages/players/PlayerPage'

describe('Player Module Tests', () => {
    const playerPage = new PlayerPage()

    before(() => {
        cy.task('clearMongoDB')
        cy.fixture('teamData.json').then((teams) => {
            teams.forEach((team) => {
                cy.request('POST', 'http://localhost:3000/api/team', team)
            })
        })
    })

    // Test cases for player module creation
    it('should create a new player', () => {
        cy.task('readXmlFile', 'cypress/fixtures/playerData.xml').then((data) => {
            const players = data.players.player
            playerPage.visit()
            players.forEach((player) => {
                const playerName = player.name[0]
                const playerDOB = player.dob[0]
                const playerEmail = player.email[0]
                const playerContact = player.contact[0]
                const playerGender = player.gender[0]
                const playerTeam = player.team[0]
                playerPage.createPlayer(playerName, playerDOB, playerEmail, playerContact, playerGender, playerTeam)
                playerPage.getPlayerList().should('contain', playerName)
            })
        })
    })

    // Test cases for players filtering by team
    it('should filter players by team', () => {
        playerPage.visit()
        playerPage.getFilterByTeam('Team 1')
        playerPage.getFilteredByRowCount().should('have.length', 1)
        playerPage.getPlayerList().should('contain', 'Player 1')
        playerPage.getFilterByTeam('Team 2')
        playerPage.getPlayerList().should('contain', 'Player 2')
        playerPage.getFilteredByRowCount().should('have.length', 2)
        playerPage.getFilterByTeam('Team 3')
        playerPage.getPlayerList().should('contain', 'Player 6')
        playerPage.getFilteredByRowCount().should('have.length', 2)
        playerPage.getFilterByTeam('Team 4')
        playerPage.getPlayerList().should('contain', 'Player 5')
        playerPage.getFilteredByRowCount().should('have.length', 1)
    })

    // Test cases for player module update
    it('update the player details', () => {
        playerPage.visit()
        playerPage.updatePlayer("Player 4", "Updated Player 4", "2005-01-01", "abc@example.com", "9876543210", "FEMALE", "Team 1")
        playerPage.getPlayerList().should('contain', 'Updated Player 4')
    })

    // Test cases for the player module reset button
    it('should verify Reset button', () => {
        playerPage.visit()
        playerPage.getFilterByTeam('Team 2')
        playerPage.getPlayerList().should('contain', 'Player 2')
        playerPage.getFilteredByRowCount().should('have.length', 1)
        playerPage.getFilterReset();
        playerPage.getFilteredByRowCount().should('have.length', 6)
    })

    // Test cases for player module delete
    it('should delete a player', () => {
        playerPage.visit()
        playerPage.deletePlayer('Updated Player 4')
        playerPage.getPlayerList().should('not.contain', 'Updated Player 4')
        playerPage.getFilteredByRowCount().should('have.length', 5)
    })
})

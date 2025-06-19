import AreaPage from '../../pages/areas/AreaPage'
import TeamPage from '../../pages/teams/TeamPage'
import MatchPage from '../../pages/matches/MatchPage'
import PlayerPage from '../../pages/players/PlayerPage'
import commonSelectors from "../../page_objects/common/CommonSelectors";
import playerSelectors from "../../page_objects/players/PlayerSelectors";

describe('End to End Test', () => {

    const areaPage = new AreaPage()
    const teamPage = new TeamPage()
    const matchPage = new MatchPage()
    const playerPage = new PlayerPage()

    before(() => {
        cy.task('clearMongoDB')
    })

    // Test cases for area module creation
    it('should create a new area', () => {
        cy.task('readXmlFile', 'cypress/fixtures/areaData.xml').then((data) => {
            const areas = data.areas.area
            areaPage.visit()
            areas.forEach((area) => {
                const name = area.name[0]
                const state = area.state[0]
                const city = area.city[0]
                areaPage.createArea(name, state, city)
                areaPage.getAreaList().should('contain', name)
            })
        })
    })

    // Test cases for team module creation
    it('should create a new team', () => {
        cy.task('readXmlFile', 'cypress/fixtures/teamData.xml').then((data) => {
            const teams = data.teams.team
            teamPage.visit()
            teams.forEach((team) => {
                const name = team.name[0]
                teamPage.createTeam(name)
                teamPage.getTeamList().should('contain', name)
            })
        })
    })

    // Test cases for match module creation
    it('should create a new match', () => {
        cy.task('readXmlFile', 'cypress/fixtures/matchData.xml').then((data) => {
            const matches = data.matches.match
            matchPage.visit()
            matches.forEach((match) => {
                const matchName = match.name[0]
                const matchDate = match.date[0]
                const firstTeam = match.firstteam[0]
                const secondTeam = match.secondteam[0]
                const area = match.area[0]
                matchPage.createMatch(matchName, matchDate, firstTeam, secondTeam, area)
                matchPage.getMatchList().should('contain', matchName)
            })
        })
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const matchDate = `${year}-${month}-${day}`;
        matchPage.createMatch("CurrentMatch", matchDate, "Team 1", "Team 2", "Whitefield")
        matchPage.getMatchList().should('contain', "CurrentMatch")

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

    // Test case for the reverse scenario if we delete the data depended on other data
    it('should validate the reverse scenario if we delete the data depended on other data', () => {
        // Navigate to the area page and delete an area
        areaPage.visit()
        areaPage.deleteArea('Whitefield')
        areaPage.getAreaList().should('not.contain', 'Whitefield')

        // Navigate to the match page and verify that the area is not present in the matches table
        matchPage.visit()
        cy.get(commonSelectors.TableFifthcolumn).should('not.contain', 'Whitefield')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Match 1') {
                cy.get(commonSelectors.TableFifthcolumn).eq(index).should('have.text', 'Area Not Exist')
            }
        })

        // Navigate to the team page and delete a team
        teamPage.visit()
        teamPage.deleteTeam('Team 1')
        teamPage.getTeamList().should('not.contain', 'Team 1')

        // Navigate to the match page and verify that the team is not present in the matches table
        matchPage.visit()
        cy.get(commonSelectors.TableThirdcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFourthcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Match 3') {
                cy.get(commonSelectors.TableThirdcolumn).eq(index).should('have.text', 'Removed Team')
            }
        })
        // Navigate to the player page and verify that the team is not present in the player table
        playerPage.visit()
        cy.get(commonSelectors.TableSixthcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Player 1') {
                cy.get(commonSelectors.TableSixthcolumn).eq(index).should('be.empty')
            }
        })
        // Verify that the team 1 is not present in the player dropdown
        cy.get(commonSelectors.SelectDropdown).find('option').should('not.contain', 'Team 1')
    })

    // Test case for the scenario if we delete the data and then create the same data again
    it('should validate the application has to consider as new if the same deleted data is entered', () => {
        // Navigate to the area page and create an area Whitefield
        // This should be considered as a new area since the previous one was deleted
        areaPage.visit()
        areaPage.createArea("Whitefield", "Karnataka", "Bangalore")
        areaPage.getAreaList().should('contain', "Whitefield")

        // Navigate to the match page and verify that the area Whitefield is not present in the matches table
        matchPage.visit()
        cy.get(commonSelectors.TableFifthcolumn).should('not.contain', 'Whitefield')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Match 1') {
                cy.get(commonSelectors.TableFifthcolumn).eq(index).should('have.text', 'Area Not Exist')
            }
        })

        // Navigate to the team page and create a team 1
        // This should be considered as a new team since the previous one was deleted
        teamPage.visit()
        teamPage.createTeam("Team 1")
        teamPage.getTeamList().should('contain', 'Team 1')

        // Navigate to the match page and verify that the team 1 is not present in the matches table
        matchPage.visit()
        cy.get(commonSelectors.TableThirdcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFourthcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Match 3') {
                cy.get(commonSelectors.TableThirdcolumn).eq(index).should('have.text', 'Removed Team')
            }
        })

        // Navigate to the player page and verify that the team 1 is not present in the player table
        playerPage.visit()
        cy.get(commonSelectors.TableSixthcolumn).should('not.contain', 'Team 1')
        cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
            const text = $el.text()
            if (text === 'Player 1') {
                cy.get(commonSelectors.TableSixthcolumn).eq(index).should('be.empty')
            }
        })
        // Verify that the team 1 is present in the player dropdown
        cy.get(commonSelectors.SelectDropdown).find('option').should('contain', 'Team 1')
    })

})

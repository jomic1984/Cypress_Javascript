import MatchPage from '../../pages/matches/MatchPage'

describe('Match Module Tests', () => {
    const matchPage = new MatchPage()

    before(() => {
        cy.task('clearMongoDB')
        cy.fixture('areaData.json').then((areas) => {
            areas.forEach((area) => {
                cy.request('POST', 'http://localhost:3000/api/area', area)
            })
        })
        cy.fixture('teamData.json').then((teams) => {
            teams.forEach((team) => {
                cy.request('POST', 'http://localhost:3000/api/team', team)
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

    // Test cases for match module filtering by status
    it('should filter matches by status', () => {
        matchPage.visit()
        matchPage.getFilterByStatus('CURRENT')
        matchPage.getFilteredByRowCount().should('have.length', 1)
        matchPage.getMatchList().should('contain', 'CurrentMatch')
        matchPage.getFilterByStatus('PAST')
        matchPage.getMatchList().should('contain', 'Match 2')
        matchPage.getFilteredByRowCount().should('have.length', 3)
        matchPage.getFilterByStatus('UPCOMMING')
        matchPage.getMatchList().should('contain', 'Match 4')
        matchPage.getFilteredByRowCount().should('have.length', 3)
    })

    // Test cases for match module filtering by area
    it('should filter matches by area', () => {
        matchPage.visit()
        matchPage.getFilteredByArea('Whitefield')
        matchPage.getFilteredByRowCount().should('have.length', 3)
        matchPage.getMatchList().should('contain', 'CurrentMatch')
        matchPage.getFilteredByArea('Hoodi')
        matchPage.getMatchList().should('contain', 'Match 2')
        matchPage.getFilteredByRowCount().should('have.length', 2)
        matchPage.getFilteredByArea('Sarajapura')
        matchPage.getMatchList().should('contain', 'Match 6')
        matchPage.getFilteredByRowCount().should('have.length', 2)
    })

    // Test cases for match module filtering by area and status
    it('should filter matches by status and area', () => {
        matchPage.visit()
        matchPage.getFilteredByAreaAndStatus('CURRENT', 'Whitefield')
        matchPage.getFilteredByRowCount().should('have.length', 1)
        matchPage.getMatchList().should('contain', 'CurrentMatch')
        matchPage.getFilteredByAreaAndStatus('PAST', 'Hoodi')
        matchPage.getFilteredByRowCount().should('have.length', 1)
        matchPage.getMatchList().should('contain', 'Match 2')
        matchPage.getFilteredByAreaAndStatus('UPCOMMING', 'Sarajapura')
        matchPage.getFilteredByRowCount().should('have.length', 1)
        matchPage.getMatchList().should('contain', 'Match 3')
    })

    // Test cases for match module update
    it('update the match details', () => {
        matchPage.visit()
        matchPage.updateMatch("Match 4", "Updated Match 4", "2005-01-01", "Hoodi", "Team 1", "Team 2")
        matchPage.getMatchList().should('contain', 'Updated Match 4')
    })

    // Test cases for match module reset filter
    it('should verify Reset button', () => {
        matchPage.visit()
        matchPage.getFilteredByAreaAndStatus('CURRENT', 'Whitefield')
        matchPage.getFilteredByRowCount().should('have.length', 1)
        matchPage.getFilterReset()
        matchPage.getFilteredByRowCount().should('have.length', 7)
    })

    // Test cases for match module delete
    it('should delete a match', () => {
        matchPage.visit()
        matchPage.deleteMatch('Updated Match 4')
        matchPage.getMatchList().should('not.contain', 'Updated Match 4')
        matchPage.getFilteredByRowCount().should('have.length', 6)
    })
})

import TeamPage from '../../pages/teams/TeamPage'

describe('Team Module Tests', () => {
  const teamPage = new TeamPage()

  before(() => {
    cy.task('clearMongoDB')
  })

  // Test case to create a new team
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

  // Test case to update a team
  it('should update a team', () => {
    teamPage.visit()
    teamPage.updateTeam('Team 3', 'Updated Team 3')
    teamPage.getTeamList().should('contain', 'Updated Team 3')
  })

  // Test case to delete a team
  it('should delete a team', () => {
    teamPage.visit()
    teamPage.deleteTeam('Updated Team 3')
    teamPage.getTeamList().should('not.contain', 'Updated Team 3')
  })
})

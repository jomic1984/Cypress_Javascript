import MatchPage from '../../pages/matches/MatchPage'
import commonSelectors from "../../page_objects/common/CommonSelectors";
import matchSelectors from "../../page_objects/matches/MatchSelectors";

describe('Match Module UI Validation Tests', () => {
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

  // This test case is will pass
  it('should validate the dropdown when one item is selected the another dropdown should not contain the same item', () => {
    matchPage.visit()
    cy.get(commonSelectors.TableHeading).should('contain', 'No data found')
    cy.get(commonSelectors.TableNoData).should('contain', 'please add new match')
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).should('not.contain', "Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
  })

  // This test case will fail because application allows duplication on matches
  it('should validate the match creation allows duplication on matches', () => {
    matchPage.visit()
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.getPageLoaded();
    cy.get(commonSelectors.TableFirstcolumn).then(($cells) => {
      const count = [...$cells].filter(cell => cell.innerText === "Match 1").length
      expect(count).to.be.equals(1)
    })
  })

  // This test case is to validate proper error message when mandatory fields are not filled
  it('should show proper error message when mandatory fields are not filled', () => {
    matchPage.visit()

    // Not filling Match name
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.wait(1000)
    cy.get(matchSelectors.EnterMatchName).then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.eq('Please fill out this field.');
    });
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

    // Not filling the Match Date
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.wait(1000)
    cy.get(commonSelectors.Date).then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.eq('Please fill out this field.');
    });
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

    // Not filling the Area drop down list
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.wait(1000)
    cy.get(matchSelectors.EnterAreaName).then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.eq('Please select an item in the list.');
    });
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

    // Not filling the First Team drop down list
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterSecondTeamName).select("Team 2")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.wait(1000)
    cy.get(matchSelectors.EnterFirstTeamName).then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.eq('Please select an item in the list.');
    });
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()

    // Not filling the Second Team drop down list
    cy.contains('button', matchSelectors.AddMatchButton).click()
    cy.get(matchSelectors.EnterMatchName).type("Match 1")
    cy.get(commonSelectors.Date).type("2023-10-01")
    cy.get(matchSelectors.EnterAreaName).select("Whitefield")
    cy.get(matchSelectors.EnterFirstTeamName).select("Team 1")
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
    cy.wait(1000)
    cy.get(matchSelectors.EnterSecondTeamName).then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.eq('Please select an item in the list.');
    });
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.CancelButton).click()
  })

  // This test case is to validate the match page UI elements
  it('should validate the match page', () => {
    cy.task('clearMongoDB')
    matchPage.visit()
    cy.get(commonSelectors.TableNoData).eq(2).should('have.text', 'Match')
    cy.get(commonSelectors.TableNoData).eq(3).should('have.text', 'add, update, delete and show list of match details')
    cy.get(commonSelectors.TableHeading).should('have.text', 'No data found')
    cy.get(commonSelectors.TableNoData).should('contain', 'please add new match')
    cy.contains('button', matchSelectors.AddMatchButton).should('be.visible')
    cy.get(commonSelectors.SelectDropdown).eq(0).should('be.visible')
    cy.get(commonSelectors.SelectDropdown).eq(1).should('be.visible')
    cy.get(commonSelectors.SelectDropdown).eq(0).should('contain', 'Select Status')
    cy.get(commonSelectors.SelectDropdown).eq(0).should('contain', 'CURRENT')
    cy.get(commonSelectors.SelectDropdown).eq(0).should('contain', 'PAST')
    cy.get(commonSelectors.SelectDropdown).eq(0).should('contain', 'UPCOMMING')
    cy.get(commonSelectors.SelectDropdown).eq(1).should('contain', 'Select Area')
    cy.contains('button', commonSelectors.FilterResetButton).should('be.visible')
    cy.contains('button', commonSelectors.FilterResetButton).should('be.disabled')
    cy.get(commonSelectors.TableHeader).then($headers => {
      const actualHeadings = [...$headers].map(h => h.innerText.trim());
      expect(actualHeadings).to.include.members(['MATCH NAME', 'MATCH DATE', 'TEAM A', 'TEAM B', 'AREA', 'ACTION']);
    });
  })
  
})

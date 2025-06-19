import areaSelectors from '../../page_objects/areas/areaSelectors'
import commonSelectors from '../../page_objects/common/CommonSelectors';
class AreaPage {

  // Method to visit the Area page
  // It waits for the page to load completely before proceeding
  visit() {
    cy.visit('/areas')
    cy.getPageLoaded();
  }

  // Method to get the list of areas displayed in the table
  getAreaList() {

    return cy.get(commonSelectors.TableFirstcolumn);
  }

  // Method to create the area
  // It accepts the area name, state, and city as parameters
  createArea(name, state, city) {

    cy.on('window:alert', (alertText) => {
      const lines = alertText.split('\n')
      expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
      expect(lines[1]).to.equal(areaSelectors.AreaAddedSuccessfully)
    });
    cy.contains('button', areaSelectors.AddAreaButton).click()
    cy.get(areaSelectors.EnterAreaName).type(name)
    cy.get(areaSelectors.EnterStateName).type(state)
    cy.get(areaSelectors.EnterCityName).type(city)
    cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.AddButton).click()
  }

  // Method to update the area
  // It accepts the old and new area names as parameters
  updateArea(oldName, newName) {
    cy.on('window:alert', (alertText) => {
      const lines = alertText.split('\n')
      expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
      expect(lines[1]).to.equal(areaSelectors.AreaUpdatedSuccessfully)
    });
    cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
    cy.wait(1000)
    cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
      const text = $el.text()
      if (text.includes(oldName)) {
        cy.get(commonSelectors.TableFourthcolumn).eq(index).find(commonSelectors.EditTableButton).closest('button').click()
        cy.get(areaSelectors.EnterAreaName).clear().type(newName)
        cy.get(commonSelectors.PageFooter).find('button').contains(commonSelectors.UpdateButton).click()
      }
    })
  }

  // Method to delete the area
  // It accepts the area name as a parameter
  deleteArea(name) {
    cy.on('window:alert', (alertText) => {
      const lines = alertText.split('\n')
      expect(lines[0]).to.equal(commonSelectors.SuccessMessage)
      expect(lines[1]).to.equal(areaSelectors.AreaDeletedSuccessfully)
    });
    cy.get(commonSelectors.TableBody).should('have.length.greaterThan', 0)
    cy.wait(1000)
    cy.get(commonSelectors.TableFirstcolumn).each(($el, index, $list) => {
      const text = $el.text()
      if (text.includes(name)) {
        // To click the delete button in the row
        cy.get(commonSelectors.TableFourthcolumn).eq(index).find('button').eq(1).click()
        cy.wait(1000)
        cy.contains('button', commonSelectors.DeletePopupButton).click()
      }
    })
  }
}

export default AreaPage
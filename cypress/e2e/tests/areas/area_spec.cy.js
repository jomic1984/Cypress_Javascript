import AreaPage from '../../pages/areas/AreaPage'

describe('Area Module Tests', () => {

  const areaPage = new AreaPage()

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

  // Test cases for area module update
  it('should update an area', () => {
    areaPage.visit()
    areaPage.updateArea('Whitefield', 'Whitefield Updated')
    areaPage.getAreaList().should('contain', 'Whitefield Updated')
  })

  // Test cases for area module delete
  it('should delete an area', () => {
    areaPage.visit()
    areaPage.deleteArea('Whitefield Updated')
    areaPage.getAreaList().should('not.contain', 'Whitefield Updated')
  })
})

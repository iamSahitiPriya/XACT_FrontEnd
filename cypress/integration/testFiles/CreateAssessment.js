describe('Validating create assessment feature', () => {

  before(() => {
  cy.login('technicalbaba4u@gmail.com','Sam@12345')
  })


  it('Creating an assessment', () => {
  cy.createAssessment('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')


  })
})

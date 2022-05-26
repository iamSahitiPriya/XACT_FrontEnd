import loginPage from "./pageObjects/loginPage";
import landingPage from "./pageObjects/landingPage";



describe('validating creating Assessment assessment popup functionality', () => {
  before('User should get navigated to Okta by launching the url', () => {
    //cy.visit(appUrl)
    cy.visit('http://localhost:4200')
    loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')

  })

  it('tc001 validate landing page of xAct application',()=>{
   landingPage.landingPageFields()
    landingPage.AssessmentpopupFields('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid('have.text','TestAssignment')
  })

  it('tc002 providing special characters in fields and validating the error message',()=>{
    landingPage.AssessmentpopupFields('','','','','','')
    //landingPage.errorMessages($el)
    for (var indValue = 0; indValue < 5; indValue++) {
      landingPage.errorMessages(indValue).should('be.visible')
    }
  })
})

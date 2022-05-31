import loginPage from "./pageObjects/loginPage";
import landingPage from "./pageObjects/landingPage";

describe('completing prerequisites to test the application', () => {
  before('User should get navigated to Okta by launching the url', () => {
    cy.visit('/')
  })

  // it('tc001 user tries to login  with valid userId and password',()=>{
  //   loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
  //   loginPage.xActHomepagetitleValidation()
  // })

  it('Creating 30 assessments for testing purpose',()=>{
    for (var iCount = 1; iCount <= 3; iCount++) {
      landingPage.AssessmentpopupFields('TestAssessment'+iCount,'TestOrganisation'+iCount,'TestDomain'+iCount,'TestIndustry',iCount,'test@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
    }
  })
  it('search prerequisites',()=>{
      landingPage.AssessmentpopupFields('searchAssessment','searchOrganisation','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
      landingPage.AssessmentpopupFields('searchAssessment','searchOrganisation','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.AssessmentpopupFields('abcd','mno','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.AssessmentpopupFields('qrst','abc','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.AssessmentpopupFields('xact','thoughtworks','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.AssessmentpopupFields('hi hello','how are you','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.AssessmentpopupFields('devTeam','BaTeam','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
  })





})

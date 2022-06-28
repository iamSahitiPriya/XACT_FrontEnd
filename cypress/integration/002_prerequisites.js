import loginPage from "./pageObjects/loginPage";
import landingPage from "./pageObjects/landingPage";
//import {waitForAngularReady} from "@angular/cdk/testing/selenium-webdriver";

describe('completing prerequisites to test the application', () => {
  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    // cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
     cy.visit('/')
  })

  // it('tc001 user tries to login  with valid userId and password',()=>{
  //   loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
  //   loginPage.xActHomepagetitleValidation()
  // })

  it('Creating 30 assessments for testing purpose',()=>{
    for (var iCount = 1; iCount <= 3; iCount++) {
      // cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
      // cy.wait('@pageLoad')
      landingPage.createAssessment().click()
      landingPage.AssessmentpopupFields('TestAssessment'+iCount,'TestOrganisation'+iCount,'TestDomain'+iCount,'TestIndustry',iCount,'test@thoughtworks.com')
      landingPage.saveAssessmentButton().click()

    }
  })
  it('search prerequisites',()=>{
    // cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    // cy.wait('@pageLoad')
    //waitForAngularReady()
    landingPage.createAssessment().click()
      landingPage.AssessmentpopupFields('searchAssessment','searchOrganisation','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.createAssessment().click()

    landingPage.AssessmentpopupFields('xact','thoughtworks','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    // landingPage.createAssessment().click()
    // landingPage.AssessmentpopupFields('hi hello','how are you','TestDomain','TestIndustry','22','test@thoughtworks.com')
    // landingPage.saveAssessmentButton().click()
    // landingPage.createAssessment().click()
    // landingPage.AssessmentpopupFields('devTeam','BaTeam','TestDomain','TestIndustry','22','test@thoughtworks.com')
    // landingPage.saveAssessmentButton().click()
  })





})

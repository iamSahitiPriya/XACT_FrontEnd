import loginPage from "../pageObjects/loginPage";
import landingPage from "../pageObjects/landingPage";
import commonFunction from "../support/commonFunctions";
//import {waitForAngularReady} from "@angular/cdk/testing/selenium-webdriver";

describe('completing prerequisites to test the application', () => {
  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    // cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
     cy.visit('/')
    cy.wait(150)
  })

  // it('tc001 user tries to login  with valid userId and password',()=>{
  //   loginPage.xActLogin()
  //   loginPage.xActHomepagetitleValidation()
  // })

  it('Creating 30 assessments for testing purpose',()=> {
    for (var iCount = 1; iCount <= 40; iCount++) {
      landingPage.clickCreateAssessment()
      landingPage.AssessmentpopupFields('TestAssessment' + iCount, 'TestOrganisation' + iCount, 'TestDomain' + iCount, 'TestIndustry', iCount, 'test@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
    }
  })

  it('Creating 30 assessments for testing purpose',()=> {
    for (var iCount = 41; iCount <= 70; iCount++) {
      landingPage.clickCreateAssessment()
      landingPage.AssessmentpopupFields('TestAssessment' + iCount, 'TestOrganisation' + iCount, 'TestDomain' + iCount, 'TestIndustry', iCount, 'test@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
    }
  })

  it('Creating 30 assessments for testing purpose',()=> {
    for (var iCount = 71; iCount <= 100; iCount++) {
      landingPage.clickCreateAssessment()
      landingPage.AssessmentpopupFields('TestAssessment' + iCount, 'TestOrganisation' + iCount, 'TestDomain' + iCount, 'TestIndustry', iCount, 'test@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
    }
  })


  it('search prerequisites',()=>{
    landingPage.clickCreateAssessment()
      landingPage.AssessmentpopupFields('searchAssessment','searchOrganisation','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    // landingPage.clickCreateAssessmentButton()
    landingPage.clickCreateAssessment()
    landingPage.AssessmentpopupFields('xact','thoughtworks','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    // landingPage.clickCreateAssessmentButton()
    landingPage.clickCreateAssessment()
    landingPage.AssessmentpopupFields('hi hello','how are you','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    // landingPage.clickCreateAssessmentButton()
    landingPage.clickCreateAssessment()
    landingPage.AssessmentpopupFields('devTeam','BaTeam','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()

    landingPage.clickCreateAssessment()
    landingPage.AssessmentpopupFields('123456789','123456789','TestDomain','TestIndustry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
  })





})


import landingPage from "../pageObjects/landingPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";

describe('Auto save displayed at the bottom right corner of the textbox where we are typing', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 User should be able to see auto save message in bottom of the notes edit box', () => {
    commonFunctions.clickElement(landingPage.assessmentNameInGrid(1),'User is navigated to the selected assessment')
    commonFunctions.typeInElement(assessmentPage.notesForQuestions(1),'software Engineering')
    cy.wait(500)
    commonFunctions.elementIsVisible(assessmentPage.autoSaveMessage(1,1),'auto save message is visible')
  })

  it('tc002 User should be able to see auto save message in bottom of the recommendations box', () => {
    commonFunctions.clickElement(landingPage.assessmentNameInGrid(1),'User is navigated to the selected assessment')
    assessmentPage.topicRecomendation().scrollIntoView()
    commonFunctions.typeInElement(assessmentPage.topicRecomendation(),'software Engineering')
    cy.wait(500)
    commonFunctions.elementIsVisible(assessmentPage.autoSaveMessageRecomendationsTab(),'auto save message is visible')
  })


  it('tc003 User should not be able to see auto save message if maturity score is provided by the user', () => {
    commonFunctions.clickElement(landingPage.assessmentNameInGrid(1),'User is navigated to the selected assessment')
    assessmentPage.computedMaturityScoreRating(6).scrollIntoView()
    commonFunctions.clickElement(assessmentPage.computedMaturityScoreRating(6),'Maturity score is selected')
    cy.wait(500)
    commonFunctions.elementIsNotVisible(assessmentPage.autoSaveMessageRecomendationsTab(),'auto save message is not visible')
  })


})


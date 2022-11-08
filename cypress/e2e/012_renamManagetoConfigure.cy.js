import landingPage from "../pageObjects/landingPage.cy";
import loginPage from "../pageObjects/loginPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";
describe('validating functionality of login page of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 Validating whether Manage option is renamed as configure', () => {
    commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1),'Assessment is opened')
    commonFunctions.clickOnElement(assessmentPage.threeDots(),'three dots option is clicked')
    assessmentPage.configureOption().should('have.text','Configure')
    commonFunctions.verifyText(assessmentPage.configureOption(),'Configure','Manage option is renamed as Configure')
  })
  it('tc002 Validating whether Configure assessment popup is displayed when clicked on configure option', () => {
    commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1),'Assessment is opened')
    commonFunctions.clickOnElement(assessmentPage.threeDots(),'three dots option is clicked')
    commonFunctions.clickOnElement(assessmentPage.configureOption(),'Configure assessment option is clicked')
    commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'Configure popup is displayed')
  })


  it('tc003 Validating whether Manage option is renamed as configure in quick link', () => {
    commonFunctions.clickOnElement(landingPage.optionsButton(),'quick link options is clicked')
    commonFunctions.clickOnElement(landingPage.configureOption(),'configure option is clicked')
    commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'Configure assessment popup is visible')
    commonFunctions.clickOnElement(landingPage.closeAssessmentPopup(),'configure assessment popup is closed')
  })



})

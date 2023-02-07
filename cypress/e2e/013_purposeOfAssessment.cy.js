import landingPage from "../pageObjects/landingPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";

describe('Validating purpose of assessment', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 Verifying whether purpose of assessment dropdown is displayed', () => {
    landingPage.clickCreateAssessmentButton()
    commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is visible')
    commonFunctions.elementIsVisible(landingPage.purposeOfAssessment(),'purpose of Assessment dropdown is visible')
  })

  it('tc002 Verifying whether user can select available options in the purpose of assessment dropdown', () => {
    landingPage.clickCreateAssessmentButton()
    commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is visible')
    commonFunctions.elementIsVisible(landingPage.purposeOfAssessment(),'purpose of Assessment dropdown is visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment().click(),'purpose of element is visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    //commonFunctions.containsText(landingPage.purposeOfAssessment(),'','Client request option is selected in purpose of assessment dropdown')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(2),'Internal Request option is clicked')
    //commonFunctions.containsText(landingPage.purposeOfAssessment(),'Internal Request','Internal request option is selected in purpose of assessment dropdown')
  })

  it('tc003 Verifying whether purpose of assessment dropdown is displayed in configure assessment popup', () => {
    commonFunctions.clickOnElement(landingPage.optionsButton(),'Quick link option is clicked')
    commonFunctions.clickOnElement(landingPage.configureOption(),'configure assessment option is clicked')
    // commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'configure Assessment popup is visible')
    // commonFunctions.elementIsVisible(landingPage.purposeOfAssessment(),'purpose of Assessment dropdown is visible')
  })


  it('tc004 Validating whether Manage option is renamed as configure in quick link', () => {
    commonFunctions.clickOnElement(landingPage.optionsButton(),'Quick link option is clicked')
    commonFunctions.clickOnElement(landingPage.configureOption(),'configure assessment option is clicked')
    // commonFunctions.elementIsVisible(landingPage.AssessmentPopup(),'configure Assessment popup is visible')
    // commonFunctions.elementIsVisible(landingPage.purposeOfAssessment(),'purpose of Assessment dropdown is visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    //commonFunctions.containsText(landingPage.purposeOfAssessment(),'','Client request option is selected in purpose of assessment dropdown')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(2),'Internal Request option is clicked')
    //commonFunctions.containsText(landingPage.purposeOfAssessment(),'Internal Request','Internal request option is selected in purpose of assessment dropdown')
  })

  it('tc005 Validating placeholder of purpose of assessment dropdown', () => {
    landingPage.clickCreateAssessment()
    commonFunctions.containsText(landingPage.purposeOfAssessment2(),'Purpose Of Assessment','Purpose of assessment placeholder is verified')
  })

  it('tc006 Assessment shouldnot be created when purpose of assessment is not selected',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    landingPage.AssessmentpopupFields('donotsave the assessment','donotsave the assessment','donotsave the assessment','donotsave the assessment','22','jathin@thoughtworks.com')
    landingPage.closeAssessmentPopup().click()
    landingPage.assessmentNameInGrid(1).should('not.have.text','donotsave the assessment')
  })



})

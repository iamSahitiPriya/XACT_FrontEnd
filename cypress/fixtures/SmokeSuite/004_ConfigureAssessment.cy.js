
import landingPage from "../../pageObjects/landingPage.cy";
import commonFunctions from "../../pageObjects/commonFunction.cy";
import assessmentPage from "../../pageObjects/assessmentPage.cy";
import commonFunction from "../../pageObjects/commonFunction.cy";
import manageModules from "../../pageObjects/manageModules.cy";

describe('Validating configure assessment functionality', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 Configuring an assessment by using options menu and validating assessment name, organisation name in the grid', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      landingPage.assessmentCreation(1,testData[0].assessmentNames[0], testData[0].organisationNames[0])
      commonFunctions.elementIsVisible(landingPage.assessmentOption(1), 'Verifying if options menu is available for the assessment')
      commonFunction.clickElement(landingPage.assessmentOption(1), 'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.configureOption(),'clicking on configure option to open configure popup')
      commonFunction.clickOnElement(landingPage.purposeOfAssessment2(), 'purpose of element dropdown options are visible')
      commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1), 'Client Request option is clicked')
      landingPage.AssessmentpopupFields(testData[0].assessmentNames[1], testData[0].organisationNames[1], 'Description of the assessment', 'testDOMAIN', '22', 'jathin@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
      landingPage.assessmentNameInGrid(1).should('have.text', ' ' + testData[0].assessmentNames[1] + ' ')
      landingPage.orgNameInGrid(1).should('have.text', ' ' + testData[0].organisationNames[1] + ' ')
    })
  })

 it('tc002 Configuring an assessment from menu inside the assessment', () => {
   landingPage.assessmentNameInGrid(1).click()
   cy.wait(500)
   cy.get('body').then(($body) => {
     cy.get('body').then((body) => {
       if (body.find(manageModules.activeCards()).length > 0) {
         manageModules.categoryCheckBox(1).click()
         commonFunction.clickOnElement(manageModules.saveButton())
       }
     })

     commonFunction.elementIsVisible(assessmentPage.threeDots(), 'menu menu button is visible')
     commonFunction.clickElement(assessmentPage.threeDots(), 'clicking on the menu button to open the options list')
     commonFunction.clickElement(assessmentPage.configureOption(), 'clicking on the menu button to open the options list')
     cy.fixture('miscellaneousTestData').then((testData) => {
       commonFunction.clickOnElement(landingPage.purposeOfAssessment2(), 'purpose of element dropdown options are visible')
       commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1), 'Client Request option is clicked')
       landingPage.AssessmentpopupFields(testData[0].assessmentNames[2], testData[0].organisationNames[2], 'Description of the assessment', 'testDOMAIN', '22', 'jathin@thoughtworks.com')
       landingPage.saveAssessmentButton().click()
       commonFunction.clickElement(assessmentPage.backToLandingPage(), 'clicking on back button to Navigate back to home page')
       landingPage.assessmentNameInGrid(1).should('have.text', ' ' + testData[0].assessmentNames[2] + ' ')
       landingPage.orgNameInGrid(1).should('have.text', ' ' + testData[0].organisationNames[2] + ' ')
     })
   })

 })

 it('tc003 Validating assessment header after changing the name', () => {
   commonFunction.clickElement(landingPage.assessmentNameInGrid(1),'clicking on the assessment to opn it')
   commonFunction.elementIsVisible(assessmentPage.assessmentNameHeader(),'user is navigated to the assessment page')
   cy.fixture('miscellaneousTestData').then((testData) => {
     commonFunction.containsText(assessmentPage.assessmentNameHeader(),testData[0].assessmentNames[2],'user is navigated to the assessment page')
   })

  })

  it('tc004 providing special characters in mandatory fields', () => {
    commonFunction.clickElement(landingPage.assessmentOption(1), 'clicking on the element to see options available in the menu')
    commonFunction.clickElement(landingPage.configureOption(),'clicking on configure option to open configure popup')
    landingPage.createAssessmentHeader().should('be.visible')
    commonFunction.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('!@#$','!@#$','!@#','!@#$','!@@@','jathin@thoughtworks.com')
    landingPage.assessmentNameError().should('have.text',' Only special characters allowed are [ _ & . , : - ] ')
    landingPage.domainFieldError().should('have.text',' Only special characters allowed are [ _ & . , : - ] ')
    landingPage.teamSizeFieldError().should('have.text',' Mandatory number field ')
    landingPage.closeAssessmentPopup().click()
  })


})


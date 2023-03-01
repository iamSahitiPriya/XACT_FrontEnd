import landingPage from "../pageObjects/landingPage.cy";
import commonFunction from '../pageObjects/commonFunction.cy'
import assessmentPage from "../pageObjects/assessmentPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import manageModules from "../pageObjects/manageModules.cy";
describe('validating the search functionality of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')


  })

  it('tc001 validate landing page of xAct application',()=>{
    landingPage.landingPageFields()
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('testassignment','Infinity International','Description of the assessment','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
  })

  it('tc001 searching for an existing assessment', () => {
    landingPage.searchAssessment('Testassignment')
    //landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
    commonFunction.containsText(landingPage.assessmentNameInGrid(1),' testassignment ','The searched assessment is displayed in the grid')
  })
 it('tc002 searching for an existing assessment with organisation name', () => {
   landingPage.searchAssessment('Infinity international')
   commonFunction.containsText(landingPage.orgNameInGrid(1),' Infinity International ','The assessment with searched organisation is displayed in the grid')
  })
 it('tc003 searching for an non-existing assessment', () => {
   commonFunction.type(landingPage.searchBox(),'!!!!!','searching for a non existing assessment anme')
   commonFunctions.containsText(landingPage.noDataMessage(),'No Assessments Found.','No assessment found message is visible')
  })
 it('tc004 searching for an organisation name with status', () => {
   landingPage.searchAssessment('Active')
   commonFunction.containsText(landingPage.assessmentStatusInGrid(1),'Active','The assessment with searched status is displayed in the grid')
  })
 it('tc005 search with partial assessment name and organisation name', () => {
   landingPage.searchAssessment('test')
   commonFunction.containsText(landingPage.assessmentNameInGrid(1),' testassignment ','The assessment with searched organisation is displayed in the grid')
   landingPage.searchAssessment('Infinity')
   commonFunction.containsText(landingPage.orgNameInGrid(1),' Infinity International ','The assessment with searched organisation is displayed in the grid')
  })

  it('tc006 searching for an non-existing organisation', () => {
    commonFunction.type(landingPage.searchBox(),'!!!!!','searching for a non existing assessment anme')
    commonFunctions.containsText(landingPage.noDataMessage(),'No Assessments Found.','No assessment found message is visible')

  })





})

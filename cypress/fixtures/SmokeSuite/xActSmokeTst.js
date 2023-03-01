import loginPage from "../../pageObjects/loginPage.cy";
import landingPage from "../../pageObjects/landingPage.cy";
import assessmentPage from "../../pageObjects/assessmentPage.cy";
import commonFunctionCy from "../../pageObjects/commonFunction.cy";
import commonFunctions from "../../pageObjects/commonFunction.cy";
describe('Smoke suite to verify all the major functionalities of the xAct application',()=>{

  beforeEach ('Launching the xAct application',()=>{
    cy.visit('/')
    cy.wait(500)
  })

  it('tc001 creating an assessment',()=>{
    landingPage.landingPageFields()
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('smokeTestAssessment','Asahi Kasei America','testIndustry','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid(1).should('have.text',' smokeTestAssessment ')
  })



  it('tc002 Searching for an assessment',() => {
    landingPage.searchBox().clear()
    landingPage.searchBox().type('smokeTestAssessment')
    cy.wait(1000)
    landingPage.searchAssessmentGrid(' smokeTestAssessment ',' Asahi Kasei America ')
    landingPage.assessmentNameInGrid(1).should('have.text',' smokeTestAssessment ')
  })


  it('tc003 verifying elements in the landing page',()=>{
    commonFunctions.elementIsVisible(landingPage.logo(),'xAct logo is Visible')
    commonFunctions.elementIsVisible(landingPage.createAssessmentHeader(),'Assessments header is Visible')
    commonFunctions.elementIsVisible(landingPage.searchBox(),'Search box in the landing page is Visible')
    commonFunctions.elementIsVisible(landingPage.createAssessment(),'create assessment landing page is Visible')
    commonFunctions.elementIsVisible(landingPage.userName(),'User name in the landing page is Visible')
    commonFunctions.elementIsVisible(landingPage.AssessmentGrid(),'Assessment grid in the landing page is Visible')
    commonFunctions.elementIsVisible(landingPage.pageNationDropDown(),'PageNation dropdown in the landing page is Visible')

    //validating table headers
    commonFunctions.elementIsVisible(landingPage.assessmentColumnHeader,'Assessment Name column header is visible')
    commonFunctions.elementIsVisible(landingPage.assessmentColumnHeader,'Organisation Name column header is visible')
    commonFunctions.elementIsVisible(landingPage.assessmentColumnHeader,'Status column header is visible')
    commonFunctions.elementIsVisible(landingPage.assessmentColumnHeader,'Updated time column header is visible')
  })








})


import landingPage from "../pageObjects/landingPage.cy";
import commonFunction from '../pageObjects/commonFunction.cy'
import assessmentPage from "../pageObjects/assessmentPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import manageModules from "../pageObjects/manageModules.cy";
describe('validating functionality of options menu of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
    cy.wrap('configureAssess').as('configAssessmentName')
    cy.wrap('three').as('cint')

  })


  it('tc001 validating all options available in menu of an assessment', () => {
    commonFunction.elementIsVisible(landingPage.assessmentOption(1),'Verifying if options menu is available for the assessment')
    commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
    commonFunction.lengthOfElement(landingPage.menu(),'validating the count of elements in the menu option')
    commonFunction.containsText(landingPage.menuOptions(1),'Configure','validating 1st option in the menu')
    commonFunction.containsText(landingPage.menuOptions(2),'Manage modules','validating 2nd option in the menu')
    commonFunction.containsText(landingPage.menuOptions(3),'Generate Report','validating 3rd option in the menu')
    commonFunction.containsText(landingPage.menuOptions(4),'Delete assessment','validating 4th option in the menu')
  })

  it('tc002 option menu should be available for all the assignments in the page', () => {
   // commonFunction.elementIsVisible(landingPage.assessmentOption(1),'Verifying if options menu is available for the ')
    let genArr = Array.from({length:5},(var1,var2)=>var2+1)
    cy.wrap(genArr).each((index) => {
      landingPage.assessmentOption(index).click()
      commonFunction.elementIsVisible(landingPage.menuFrame(),'Menu Options are visible when the menu button is clicked')
      commonFunction.applicationReload()

    })
  })
  it('tc003 Configure an assessment by using menu option',function () {
    commonFunction.elementIsVisible(landingPage.assessmentOption(1),'Verifying if options menu is available for the assessment')
    commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
    commonFunction.clickElement(landingPage.menuOptions(1),'clicking on configure option in the options menu')
    commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is displayed when configure option is clicked')
    commonFunctions.clickElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    const configAssessmentName='configureAssess'
    const orgName='iN DEMAND'
    landingPage.AssessmentpopupFields(configAssessmentName,orgName,'Description of the assessment','morethan50charactersmorethan50charatersmorethan50characters','22','jathin@thoughtworks.com')
    commonFunction.clickElement(landingPage.saveAssessmentButton())
    commonFunction.containsText(landingPage.tableColumns(1,1),configAssessmentName,'updated name of the assessment should be displayed')
    commonFunction.containsText(landingPage.tableColumns(1,2),orgName,'updated name of the assessment should be displayed')
    })

  it('tc004 navigate to manage modules page by using menu option', () => {
    commonFunction.elementIsVisible(landingPage.assessmentOption(1),'Verifying if options menu is available for the assessment')
    commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
    commonFunction.clickElement(landingPage.manageModulesOption(),'clicking on the manage modules option to navigate to manage modules page')
    commonFunction.elementIsVisible(manageModules.ManageModulesPageHeader(),'User is navigated to manage modules page successfully')
    })

 it('tc005 delete the assessment using menu option', () => {
    commonFunction.elementIsVisible(landingPage.assessmentOption(1),'Verifying if options menu is available for the assessment')
    commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
    commonFunction.clickElement(landingPage.deleteAssessmentOption(),'clicking on the delete assessment option to delete an assessment')
    commonFunction.clickElement(landingPage.yesButton(),'clicking yes button on the confirmation popup')
   //landingPage.searchBox().type('configureAssess')
   landingPage.searchAssessment('configureAssess')
    // commonFunction.type(landingPage.searchBox(),'configureAssess','searching for the deleted assessment')
   commonFunction.containsText(landingPage.noAssessmentFoundRow(),'No Assessments Found.','Deleted Assessment is not available in the list')


    })






})

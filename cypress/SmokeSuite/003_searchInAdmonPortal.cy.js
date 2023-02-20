import loginPage from "../pageObjects/loginPage.cy";
import landingPage from "../pageObjects/landingPage.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";
import commonFunctionCy from "../pageObjects/commonFunction.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import adminPortalCy from "../pageObjects/adminPortal.cy";
import assert from "assert";
import adminPortal from "../pageObjects/adminPortal.cy";
describe('Verify Search box functionality in admin portal',()=> {

  beforeEach('Launching the xAct application', () => {
    cy.visit('/')
    cy.wait(500)
  })

  it('tc001 Searchbox should be visible in category,module,topic,parameter pages', () => {
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.category(),'Admin clicks on category to navigate to category page')
    commonFunctions.containsText(adminPortal.addButton(),'Add Category','Admin is navigated to category pag')
    commonFunctions.elementIsVisible(adminPortal.searchBox(),'Search box is visible in category pag')

     commonFunctions.clickElement(adminPortal.modules(),'Admin clicks on category to navigate to Modules page')
    commonFunctions.containsText(adminPortal.addButton(),'Add Module','Admin is navigated to Modules page')
    commonFunctions.elementIsVisible(adminPortal.searchBox(),'Search box is visible in Modules page')

     commonFunctions.clickElement(adminPortal.topic(),'Admin clicks on category to navigate to Topic page')
    commonFunctions.containsText(adminPortal.addButtonTopic(),'Add Topic','Admin is navigated to Topic page')
    commonFunctions.elementIsVisible(adminPortal.searchBox(),'Search box is visible in Topic page')

     commonFunctions.clickElement(adminPortal.parameter(),'Admin clicks on category to navigate to Parameter page')
    commonFunctions.containsText(adminPortal.addParameter(),'Add Parameter','Admin is navigated to Parameter page')
    commonFunctions.elementIsVisible(adminPortal.searchBox(),'Search box is visible in Parameter page')


  })

  it('tc001 Searching category in category page', () => {
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.category(),'Admin clicks on category to navigate to category page')
    commonFunctions.containsText(adminPortal.addButton(),'Add Category','Admin is navigated to category pag')
    commonFunctions.elementIsVisible(adminPortal.searchBox(),'Search box is visible in category pag')
    const searchValue='Software Engineering'
    commonFunctions.type(adminPortal.searchBox(),searchValue,'Admin provides a value in search box')



  })



})

import loginPage from "../../pageObjects/loginPage.cy";
import landingPage from "../../pageObjects/landingPage.cy";
import assessmentPage from "../../pageObjects/assessmentPage.cy";
import commonFunctionCy from "../../pageObjects/commonFunction.cy";
import commonFunctions from "../../pageObjects/commonFunction.cy";
import adminPortalCy from "../../pageObjects/adminPortal.cy";
import assert from "assert";
import adminPortal from "../../pageObjects/adminPortal.cy";
describe('Smoke suite to verify all the major functionalities of the xAct application',()=>{

  beforeEach ('Launching the xAct application',()=>{
    cy.visit('/')
    cy.wait(500)
  })

  it('tc001 Navigation to admin portal',()=>{
    commonFunctions.clickElement(landingPage.userName(),'Clicking on username to see the options available')
    commonFunctions.clickElement(landingPage.adminPortalLink(),'Clicking on Admin option to navigate to admin portal')
    commonFunctions.elementIsVisible(adminPortal.adminConsole(),'User is navigated to admin portal')
  })


  it('tc002 verifying elements in the Admin portal',()=>{
    //validating admin console
    adminPortal.navigateToAdmin()
    commonFunctions.elementIsVisible(adminPortal.adminConsole(),'Admin console is Visible')
    commonFunctions.elementIsVisible(adminPortal.adminConsoleHeader(),'Admin console header is Visible')
    commonFunctions.elementIsVisible(adminPortal.category(),'Category option in admin console is Visible')
    commonFunctions.elementIsVisible(adminPortal.modules(),'Module option in admin console is Visible')
    commonFunctions.elementIsVisible(adminPortal.topic(),'Topic option in admin console is Visible')
    commonFunctions.elementIsVisible(adminPortal.parameter(),'Parameter option in admin console is Visible')


    //validating dashboard
    commonFunctions.elementIsVisible(adminPortal.dashboardHeader(),'Dashboard header in admin console is Visible')
    commonFunctions.elementIsVisible(adminPortal.totalAssessmentCard(),'total assessment card in dashboard is visible')
    commonFunctions.elementIsVisible(adminPortal.totalAssessmentCardHeader(),'total assessment card header in dashboard is visible')
    commonFunctions.elementIsVisible(adminPortal.totalAssessmentCardCount(),'total assessment count is visible')
    commonFunctions.elementIsVisible(adminPortal.activeAssessmentCard(),'active assessment card in dashboard is visible')
    commonFunctions.elementIsVisible(adminPortal.activeAssessmentCardHeader(),'active assessment card header in dashboard is visiblee')
    commonFunctions.elementIsVisible(adminPortal.activeAssessmentCardCount(),'active assessment count is visible')
    commonFunctions.elementIsVisible(adminPortal.completedAssessmentCard(),'completed assessment card in dashboard is visible')
    commonFunctions.elementIsVisible(adminPortal.completedAssessmentCardHeader(),'completed assessment card header in dashboard is visiblee')
    commonFunctions.elementIsVisible(adminPortal.completedAssessmentCardCount(),'completed assessment count is visible')

    //buttons and dropdowns validation
    commonFunctions.elementIsVisible(adminPortal.dropDown(),'Select days range dropdown is visible')
    commonFunctions.elementIsVisible(adminPortal.downloadButton(),'Download report button is visible')
  })

  it('tc003 verifying elements in the Category table Admin portal',()=>{
    //Navigating to category page and validating elements
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.category(),'Admin clicks on category to navigate to navigate page')
    commonFunctions.containsText(adminPortal.addButton(),'Add Category','Admin is navigated to Category page')
    commonFunctions.containsText(adminPortal.categoryHeader(),'Category','Category Header is visible in the table')
    commonFunctions.containsText(adminPortal.dateHeader(),'Date','Date Header is visible in the table')
    commonFunctions.containsText(adminPortal.activeHeader(),'Active','Active Header is visible in the table')
    commonFunctions.containsText(adminPortal.actionHeader(),'Action','Action Header is visible in the table')
    commonFunctions.elementIsVisible(adminPortal.pagenationDropDown(),'page nation dropdown is visible')
    commonFunctions.elementIsVisible(adminPortal.pagenation(),'page nation dropdown is visible')
  })

  it('tc004 verifying elements in the Module table Admin portal',()=>{
    //Navigating to category page and validating elements
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.modules(),'Admin clicks on Module to navigate to module page')
    commonFunctions.containsText(adminPortal.addButton(),'Add Module','Admin is navigated to Modules page')
    commonFunctions.containsText(adminPortal.moduleHeader(),'Module','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.categoryHeader(),'Category','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.dateHeader(),'Date','Date Header is visible in the table')
    commonFunctions.containsText(adminPortal.activeHeader(),'Active','Active Header is visible in the table')
    commonFunctions.containsText(adminPortal.actionHeader(),'Action','Action Header is visible in the table')
    commonFunctions.elementIsVisible(adminPortal.pagenationDropDown(),'page nation dropdown is visible')
    commonFunctions.elementIsVisible(adminPortal.pagenation(),'page nation dropdown is visible')
  })

  it('tc005 verifying elements in the Topic table Admin portal',()=>{
    //Navigating to category page and validating elements
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.topic(),'Admin clicks on category to navigate')
    commonFunctions.containsText(adminPortal.addButtonTopic(),'Add Topic','Admin is navigated to Modules page')
    commonFunctions.containsText(adminPortal.moduleHeader(),'Module','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.categoryHeader(),'Category','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.topicHeader(),'Topic','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.dateHeader(),'Date','Date Header is visible in the table')
    commonFunctions.containsText(adminPortal.activeHeader(),'Active','Active Header is visible in the table')
    commonFunctions.containsText(adminPortal.actionHeader(),'Action','Action Header is visible in the table')
    commonFunctions.elementIsVisible(adminPortal.pagenationDropDown(),'page nation dropdown is visible')
    commonFunctions.elementIsVisible(adminPortal.pagenation(),'page nation dropdown is visible')
  })


  it('tc006 verifying elements in the Parameter table Admin portal',()=>{
    //Navigating to category page and validating elements
    adminPortal.navigateToAdmin()
    commonFunctions.clickElement(adminPortal.parameter(),'Admin clicks on Parameter to navigate to parameter page')
    commonFunctions.containsText(adminPortal.addParameter(),'Add Parameter','Admin is navigated to Modules page')
    commonFunctions.containsText(adminPortal.moduleHeader(),'Module','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.categoryHeader(),'Category','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.topicHeader(),'Topic','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.parameterHeader(),'Parameter','Module Header is visible in the table')
    commonFunctions.containsText(adminPortal.dateHeader(),'Date','Date Header is visible in the table')
    commonFunctions.containsText(adminPortal.activeHeader(),'Active','Active Header is visible in the table')
    commonFunctions.containsText(adminPortal.actionHeader(),'Action','Action Header is visible in the table')
    commonFunctions.elementIsVisible(adminPortal.pagenationDropDown(),'page nation dropdown is visible')
    commonFunctions.elementIsVisible(adminPortal.pagenation(),'page nation dropdown is visible')
  })











})


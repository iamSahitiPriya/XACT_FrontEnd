// import loginPage from "../../pageObjects/loginPage.cy";
// import landingPage from "../../pageObjects/landingPage.cy";
// import assessmentPage from "../../pageObjects/assessmentPage.cy";
// import commonFunctionCy from "../../pageObjects/commonFunction.cy";
// import commonFunctions from "../../pageObjects/commonFunction.cy";
// import adminPortalCy from "../../pageObjects/adminPortal.cy";
// import assert from "assert";
// import adminPortal from "../../pageObjects/adminPortal.cy";
import landingPage from "../../pageObjects/landingPage.cy";
import commonFunction from "../../pageObjects/commonFunction.cy";
import manageModules from "../../pageObjects/manageModules.cy";

describe('Smoke suite to verify all the major functionalities of the xAct application',()=> {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.visit('/')
    cy.wait(500)
  })

  it('tc001 user should be navigated to manage modules page when assessment is opened for the first time', () => {

    cy.fixture('miscellaneousTestData').then((testData) => {
        landingPage.assessmentCreation(1,testData[0].assessmentNames[0], testData[0].organisationNames[0])
      commonFunction.clickElement(landingPage.assessmentNameInGrid(1),'clicking on latest assignment to navigate t o manage modules page')
      //commonFunction.containsText(manageModules.ManageModulesPageHeader,'Category','User is navigated to manage modules page')
      //commonFunction.elementIsVisible(manageModules.ManageModulesPageHeader,'User is navigated to manage modules page')

    })
  })
  it('tc002 validating search functionality in manage modules', () => {

    cy.fixture('miscellaneousTestData').then((testData) => {
      commonFunction.clickElement(landingPage.assessmentNameInGrid(1),'clicking on latest assignment to navigate t o manage modules page')
      //searching for a category
      let categoryName=testData[0].Categories[1];
      commonFunction.containsText(manageModules.ManageModulesPageHeader,'Category','User is navigated to manage modules page')
      commonFunction.type(manageModules.searchBox(),categoryName,'Searching for '+categoryName+' Category')
      commonFunction.lengthOfElement(manageModules.categoryCard(),1,'one category card of the search value is displayed')
      commonFunction.containsText(manageModules.categoryName(1),categoryName,'The category card has searched value')

      //searching for a category
      let moduleName=testData[0].cloudPlatformModules[0];
      commonFunction.type(manageModules.searchBox(),moduleName,'Searching for '+moduleName+' Category')
      commonFunction.containsText(manageModules.moduleName(1,1),moduleName,'The category card has searched value')

      //searching with keywords
      let keyword=testData[0].assessmentNames[3];
      commonFunction.type(manageModules.searchBox(),keyword,'Searching for '+keyword+' Category')
      commonFunction.containsText(manageModules.categoryName(1),keyword,'The category card has searched value')
      commonFunction.containsText(manageModules.moduleName(1,1),keyword,'The category card has searched value')
      commonFunction.containsText(manageModules.moduleName(1,2),keyword,'The category card has searched value')

    })
  })
  it('tc003 title of the assessment should be displayed as header in manage modules page', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      //landingPage.assessmentCreation(testData[0].assessmentNames[0], testData[0].organisationNames[0])
      commonFunction.clickElement(landingPage.assessmentNameInGrid(1),'clicking on latest assignment to navigate t o manage modules page')
      commonFunction.containsText(manageModules.assessmentHeader(),testData[0].assessmentNames[0],'The assessment name '+testData[0].assessmentNames[0]+' is displayed in the header')

    })
  })
  it('tc004 Selecting and deselecting categories', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      commonFunction.clickElement(landingPage.assessmentNameInGrid(1), 'clicking on latest assignment to navigate t o manage modules page')
      //searching for a category
      let categoryName = testData[0].Categories[0];
      commonFunction.type(manageModules.searchBox(), categoryName, 'Searching for ' + categoryName + ' Category')
      commonFunction.containsText(manageModules.categoryName(1), categoryName, 'The category card has searched value')
      cy.wait(500)
      manageModules.categoryCheckBox(1).click()
      manageModules.catCheckBox(1).should('be.checked')

      manageModules.catCheckBox(1).as('checkbox').invoke('is',':checked').then((checked=>{
        if(checked)
        {
          manageModules.categoryCheckBox(1).click()
          manageModules.catCheckBox(1).should('not.be.checked')
          cy.log('the category is unchecked successfully')
        }
      }))

    })
    })
  it('tc005 selecting and deselecting modules of a category', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      commonFunction.clickElement(landingPage.assessmentNameInGrid(1), 'clicking on latest assignment to navigate t o manage modules page')
      //searching for a category
      let categoryName = 'Data';
      commonFunction.type(manageModules.searchBox(), categoryName, 'Searching for ' + categoryName + ' Category')
      commonFunction.containsText(manageModules.categoryName(1), categoryName, 'The category card has searched value')
      cy.wait(500)
      manageModules.categoryCheckBox(1).click()
      manageModules.catCheckBox(1).should('be.checked')

      manageModules.catCheckBox(1).as('checkbox').invoke('is',':checked').then((checked=>{
        if(checked)
        {
          manageModules.categoryCheckBox(1).click()
          manageModules.catCheckBox(1).should('not.be.checked')
          cy.log('the category is uncked successfully')
        }
      }))

    })


  })
  it('tc006 verifying tool tip is existing for all the available categories', () => {

  })
  it('tc007 Verifying all category names are displayed or not', () => {
    landingPage.assessmentNameInGrid(1).click()
    cy.fixture('miscellaneousTestData').then((testData) => {
      testData[0].ArchitecturalStyleParameters[0]
      const firstList = []
      let secondList = []
    // let's get the first list of strings
      cy.get('mat-card-title').each(($li) => {
        firstList.push($li.text())
      })
      //secondList=testData[0].Categories[]
        .then(() => {
          // when this callback runs, both lists will be populated
          expect(firstList).to.include.members(secondList)
        })
    })

  })

})

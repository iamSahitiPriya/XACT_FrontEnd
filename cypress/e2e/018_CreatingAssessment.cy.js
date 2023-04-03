
import landingPage from "../pageObjects/landingPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";
import commonFunction from "../pageObjects/commonFunction.cy";

describe('Auto save displayed at the bottom right corner of the textbox where we are typing', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 Creating an assessment with different purpose options', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      let assessmentName=testData[0].assessmentNames[4]
      let orgName=testData[0].organisationNames[2]
      let status=testData[0].status[0]
      //selecting internal assessment
      landingPage.assessmentCreation(1,assessmentName, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the name '+ assessmentName)
      commonFunction.containsText(landingPage.orgNameInGrid(1),orgName,'Assessment is successfully created with the name '+ orgName)
      commonFunction.containsText(landingPage.assessmentStatusInGrid(1),status,'Assessment is successfully created with the status '+ status)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(1),'clicking on configure option in the options menu')
      commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is displayed when configure option is clicked')
      commonFunction.containsText(landingPage.purposeOfAssessment1(),'Internal Assessment','Internal assessment option is selected as purpose of assessment')
      commonFunction.clickElement(landingPage.closeAssessmentPopup(),'closing the assessment popup')
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')

      //selecting Client assessment
      cy.wait(500)
      let assessmentName1=testData[0].assessmentNames[5]
      landingPage.assessmentCreation(2,assessmentName1, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName1,'Assessment is successfully created with the name '+ assessmentName1)
      commonFunction.containsText(landingPage.orgNameInGrid(1),orgName,'Assessment is successfully created with the name '+ orgName)
      commonFunction.containsText(landingPage.assessmentStatusInGrid(1),status,'Assessment is successfully created with the status '+ status)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(1),'clicking on configure option in the options menu')
      commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is displayed when configure option is clicked')
      commonFunction.containsText(landingPage.purposeOfAssessment1(),'Client Assessment','Internal assessment option is selected as purpose of assessment')
      commonFunction.clickElement(landingPage.closeAssessmentPopup(),'closing the assessment popup')
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')

      //selecting just exploring assessment
      cy.wait(500)
      let assessmentName2=testData[0].assessmentNames[6]
      landingPage.assessmentCreation(3,assessmentName2, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName2,'Assessment is successfully created with the name '+ assessmentName2)
      commonFunction.containsText(landingPage.orgNameInGrid(1),orgName,'Assessment is successfully created with the name '+ orgName)
      commonFunction.containsText(landingPage.assessmentStatusInGrid(1),status,'Assessment is successfully created with the status '+ status)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(1),'clicking on configure option in the options menu')
      commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Assessment popup is displayed when configure option is clicked')
      commonFunction.containsText(landingPage.purposeOfAssessment1(),'Just Exploring','Internal assessment option is selected as purpose of assessment')
      commonFunction.clickElement(landingPage.closeAssessmentPopup(),'closing the assessment popup')
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')


    })
  })


  it('tc002 Creating an assessment with a name of 50 characters', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      let assessmentName=testData[0].assessmentNames[7]
      let orgName=testData[0].organisationNames[2]
      landingPage.assessmentCreation(3,assessmentName, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the name '+ assessmentName)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
    })
  })

  it('tc003 User should be able to create multiple assessments with same name', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      let assessmentName=testData[0].assessmentNames[7]
      let orgName=testData[0].organisationNames[2]
      landingPage.assessmentCreation(3,assessmentName, orgName)
      landingPage.assessmentCreation(3,assessmentName, orgName)
      landingPage.assessmentCreation(3,assessmentName, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the 50 character name '+ assessmentName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(2),assessmentName,'Assessment is successfully created with the 50 character name '+ assessmentName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(3),assessmentName,'Assessment is successfully created with the 50 character name '+ assessmentName)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
    })
  })

  it('tc004 Creating an assessment with and without emails', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      let assessmentName=testData[0].assessmentNames[7]
      let orgName=testData[0].organisationNames[2]
      //with email id
      landingPage.assessmentCreation(3,assessmentName, orgName)
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the name '+ assessmentName)
      cy.wait(500)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
      //without email id
      cy.wait(300)
      landingPage.createAssessment().should('be.visible')
      landingPage.createAssessment().click()
      commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
      commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(3),'Client Request option is clicked')
      landingPage.AssessmentpopupFields(assessmentName,orgName,'Description of the assessment','testDOMAIN','22',' ')
      landingPage.saveAssessmentButton().click()
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the name '+ assessmentName+' without email address in the field')
      cy.wait(300)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
    })
  })

  it('tc005 Creating an assessment with numerical values', () => {
    cy.fixture('miscellaneousTestData').then((testData) => {
      let assessmentName=testData[0].assessmentNames[7]
      let orgName=testData[0].organisationNames[2]
      cy.wait(300)
      landingPage.createAssessment().should('be.visible')
      landingPage.createAssessment().click()
      commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
      commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(3),'Client Request option is clicked')
      landingPage.AssessmentpopupFields(assessmentName,orgName,'Description of the assessment','testDOMAIN','22',' ')
      landingPage.saveAssessmentButton().click()
      commonFunction.containsText(landingPage.assessmentNameInGrid(1),assessmentName,'Assessment is successfully created with the name '+ assessmentName+' without email address in the field')
      cy.wait(300)
      commonFunction.clickElement(landingPage.assessmentOption(1),'clicking on the element to see options available in the menu')
      commonFunction.clickElement(landingPage.menuOptions(4),'Deleting the assessment')
      commonFunction.clickElement(landingPage.yesButton(),'Confirming to delete the assessment')
    })
  })


})


import landingPage from "../pageObjects/landingPage.cy";
import loginPage from "../pageObjects/loginPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";
import assessmentChart from "../pageObjects/assessmentChart.cy";
import commonFunction from "../pageObjects/commonFunction.cy";
import manageModules from "../pageObjects/manageModules.cy";
describe('validating functionality of Finishing and Restarting assessment of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })


  it('tc001 User should be able to reopen an assessment', () => {

    landingPage.assessmentNameInGrid(1).then(function ($elem) {
      //creating an assessment
      landingPage.createAssessment().click()
      commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
      commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
      landingPage.AssessmentpopupFields('finishassessmenttest','Infinity International','Description of the assessment','testDOMAIN','22','jathin@thoughtworks.com')
      landingPage.saveAssessmentButton().click()
      let assessmentName = $elem.text()
      commonFunctions.clickElement(landingPage.assessmentNameInGrid(1), 'Clicking on the first assessment in the table to open it')
      cy.wait(500)
      cy.get('body').then((body) => {
        if (body.find(manageModules.activeCards()).length > 0) {
          manageModules.moduleCheckBox(1).click()
          commonFunction.clickOnElement(manageModules.saveButton())
        }
      })
      commonFunctions.clickElement(assessmentPage.finishAssessmentButton(), 'User clicks on finish assessment button')
      commonFunctions.clickElement(assessmentPage.yesButtonInPopup(), 'User clicks on yes button to finish the assessment')
      commonFunctions.elementIsVisible(assessmentChart.chart(), 'User is navigated to assessment chart page hen the assessment is successfully closed')
      if (assessmentChart.chart().should('be.visible') && assessmentChart.assessmentName().should('contain', assessmentName.trim())) {
        cy.log('The assessment with name' + assessmentName + 'is finished successfully')
      }
      commonFunctions.clickElement(assessmentChart.backButton(), 'User clicks on back button to navigate back to the assessment page')
      commonFunctions.clickElement(assessmentPage.reOpenhAssessmentButton(), 'User clicks on reopen assessment button')
      commonFunctions.containsText(assessmentPage.finishAssessmentButton(), 'Finish Assessment', 'Assessment is successfully reopened by the user')

    })

  })

  it('tc002 User should be able edit notes and maturity score when assessment is reopened',  () => {
      commonFunctions.clickElement(landingPage.assessmentNameInGrid(1), 'Clicking on the first assessment in the table to open it')
      commonFunctions.clickElement(assessmentPage.finishAssessmentButton(), 'User clicks on finish assessment button')
      commonFunctions.clickElement(assessmentPage.yesButtonInPopup(), 'User clicks on yes button to finish the assessment')
      commonFunctions.elementIsVisible(assessmentChart.chart(), 'User is navigated to assessment chart page hen the assessment is successfully closed')
      commonFunctions.clickElement(assessmentChart.backButton(), 'User clicks on back button to navigate back to the assessment page')
      commonFunctions.clickElement(assessmentPage.reOpenhAssessmentButton(), 'User clicks on reopen assessment button')
    assessmentPage.modules(1,2).click()

    assert.exists(assessmentPage.topicTab(1).should('have.text', 'Continuous Integration and Deployment'), 'User is navigated to Devops module')
    cy.fixture('DevOps').then((testData) => {
      assessmentPage.parameter(1).should('be.visible').contains(testData[0].CIDParameters[0])
      assessmentPage.questions(1, 2, 1).click().should('be.visible').contains(testData[0].CIDQuestions[0])
      commonFunctions.typeInElement(assessmentPage.notesForQuestions(7), testData[0].notes[0])
      assessmentPage.questions(1, 2, 2).click().should('be.visible').contains(testData[0].CIDQuestions[1])
      commonFunctions.typeInElement(assessmentPage.notesForQuestions(8), testData[0].notes[1])
      assessmentPage.questions(1, 2, 3).click().should('be.visible').contains(testData[0].CIDQuestions[2])
      commonFunctions.typeInElement(assessmentPage.notesForQuestions(9), testData[0].notes[2])
      commonFunctions.clickElement(assessmentPage.parameterMaturityScoreHeader(1),'scrolling to maturity score')
      commonFunction.clickElement(assessmentPage.parameterMaturityScore(1,4),'User selects a maturity score rating')
      cy.log('eee')
    })

    })

  it('tc003 Status of the reopened assessment should be active',  () => {

    commonFunctions.clickElement(landingPage.assessmentNameInGrid(1), 'Clicking on the first assessment in the table to open it')
    commonFunctions.clickElement(assessmentPage.finishAssessmentButton(), 'User clicks on finish assessment button')
    commonFunctions.clickElement(assessmentPage.yesButtonInPopup(), 'User clicks on yes button to finish the assessment')
    commonFunctions.elementIsVisible(assessmentChart.chart(), 'User is navigated to assessment chart page hen the assessment is successfully closed')
    commonFunctions.clickElement(assessmentChart.backButton(), 'User clicks on back button to navigate back to the assessment page')
    commonFunctions.clickElement(assessmentPage.reOpenhAssessmentButton(), 'User clicks on reopen assessment button')
    commonFunctions.clickElement(landingPage.xActlogo(),'User clicks on xact logo to navigate to the landing page')
    commonFunction.type(landingPage.searchBox(),'finishassessmenttest','User searches for the assessment which is reopened')

    commonFunction.containsText(landingPage.tableColumns(1,3),'Active','Assessment status should be active after reopening the assessment')
  })


  it('tc004 User should be able to close the assessment successfully',  () => {

      landingPage.assessmentNameInGrid(1).then(function ($elem) {
        let assessmentName = $elem.text()
        commonFunctions.clickElement(landingPage.assessmentNameInGrid(1), 'Clicking on the first assessment in the table to open it')
        commonFunctions.clickElement(assessmentPage.finishAssessmentButton(), 'User clicks on finish assessment button')
        commonFunctions.clickElement(assessmentPage.yesButtonInPopup(), 'User clicks on yes button to finish the assessment')
        commonFunctions.elementIsVisible(assessmentChart.chart(), 'User is navigated to assessment chart page hen the assessment is successfully closed')
        if (assessmentChart.chart().should('be.visible') && assessmentChart.assessmentName().should('contain', assessmentName.trim())) {
          cy.log('The assessment with name' + assessmentName + 'is finished successfully')
        }

      })

    })


  it('tc005 Status of the closed assessment should changed to complete',  () => {
    commonFunction.type(landingPage.searchBox(),'finishassessmenttest','User searches for the assessment which is reopened')
    commonFunction.containsText(landingPage.tableColumns(1,3),'Completed','Assessment status should be active after reopening the assessment')
  })


  })



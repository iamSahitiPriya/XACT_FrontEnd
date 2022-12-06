// import landingPage from "../pageObjects/landingPage.cy";
// import loginPage from "../pageObjects/loginPage.cy";
// import commonFunctions from "../pageObjects/commonFunction.cy";
// import assessmentPage from "../pageObjects/assessmentPage.cy";
// describe('validating functionality of Restarting an assessment of xAct application', () => {
//
//   beforeEach('User should get navigated to Okta by launching the url', () => {
//     cy.window().then(win => win.location.hash = "/foo/bar")
//     cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
//     cy.visit('/')
//   })
//
//   it('tc001 User should be able to restart a closed assessment', () => {
//     commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1), 'Assessment is opened')
//     commonFunctions.clickOnElement(assessmentPage.finishAssessmentButton(),'User clicks on finish assessment button')
//     commonFunctions.clickOnElement(assessmentPage.yesButtonInPopup(),'User closes the assessment successfully')
//     commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Assessment is closed')
//     commonFunctions.clickOnElement(assessmentPage.reOpenhAssessmentButton(),'User tries to reopen the assessment')
//     commonFunctions.elementIsVisible(assessmentPage.finishAssessmentButton(),'Assessment is reopened successfully')
//   })
//
//     it('tc002 User should be able to edit an assessment which is reopened', () => {
//       commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1), 'Assessment is opened')
//       commonFunctions.clickOnElement(assessmentPage.finishAssessmentButton(),'User clicks on finish assessment button')
//       commonFunctions.clickOnElement(assessmentPage.yesButtonInPopup(),'User closes the assessment successfully')
//       commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Assessment is closed')
//       commonFunctions.clickOnElement(assessmentPage.reOpenhAssessmentButton(),'User tries to reopen the assessment')
//       commonFunctions.typeInElement(assessmentPage.notesForQuestions(1),'assessment is reopened')
//       commonFunctions.valueOfElement(assessmentPage.notesForQuestions(1),'assessment is reopened','User is able to edit the values in assessment after reopening the assessment')
//       })
//
//     it('tc003 User should be able to generate interim report after reopening the assessment', () => {
//
//     })
//
//     it('tc004 Reopen assessment button should be visible when the assessment is closed', () => {
//       commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1), 'Assessment is opened')
//       commonFunctions.clickOnElement(assessmentPage.finishAssessmentButton(),'User clicks on finish assessment button')
//       commonFunctions.clickOnElement(assessmentPage.yesButtonInPopup(),'User closes the assessment successfully')
//       commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Reopen assessment button is visible after the assessment is closed')
//       commonFunctions.clickOnElement(assessmentPage.reOpenhAssessmentButton(),'Assessment is reopened')
//     })
//
//     it('tc006 User should be able to navigate between modules and topics in the assessment ', () => {
//       commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1), 'Assessment is opened')
//       commonFunctions.clickOnElement(assessmentPage.finishAssessmentButton(),'User clicks on finish assessment button')
//       commonFunctions.clickOnElement(assessmentPage.yesButtonInPopup(),'User closes the assessment successfully')
//       commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Reopen assessment button is visible after the assessment is closed')
//       commonFunctions.clickOnElement(assessmentPage.reOpenhAssessmentButton(),'Assessment is reopened')
//       //navigating between the topics
//       commonFunctions.clickOnElement(assessmentPage.topicTab(2),'User is trying to  navigate between the topics')
//       commonFunctions.clickOnElement(assessmentPage.topicTab(3),'User is trying to  navigate between the topics')
//       commonFunctions.clickOnElement(assessmentPage.softwareEngModuleClick(2),'User is trying to  navigate between the Modules')
//     })
//
//     it('tc007 The status of the assessment should be changed to active in the assessment grid ', () => {
//       commonFunctions.clickOnElement(landingPage.assessmentNameInGrid(1), 'Assessment is opened')
//       commonFunctions.clickOnElement(assessmentPage.finishAssessmentButton(),'User clicks on finish assessment button')
//       commonFunctions.clickOnElement(assessmentPage.yesButtonInPopup(),'User closes the assessment successfully')
//       commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Assessment is closed')
//       commonFunctions.clickOnElement(assessmentPage.reOpenhAssessmentButton(),'User tries to reopen the assessment')
//       commonFunctions.elementIsVisible(assessmentPage.finishAssessmentButton(),'Assessment is reopened successfully')
//       commonFunctions.clickOnElement(assessmentPage.backToLandingPage(),'Usr tries to navigate back to landing page')
//       commonFunctions.containsText(landingPage.assessmentStatusInGrid(1),' Active ','Status of the assessment is changed to Active after reopening the assessment')
//
//     })
//
//
//   })
//
//

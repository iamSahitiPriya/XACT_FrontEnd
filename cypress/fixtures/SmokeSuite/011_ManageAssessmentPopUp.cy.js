// import landingPage from "../pageObjects/landingPage.cy";
// import commonFunction from "../pageObjects/commonFunction.cy";
// import commonFunctionCy from "../pageObjects/commonFunction.cy";
// import assessmentPage from "../pageObjects/assessmentPage.cy";
//
// describe('validating creating Assessment assessment popup functionality', () => {
//
//   beforeEach('User should get navigated to Okta by launching the url', () => {
//     cy.window().then(win => win.location.hash = "/foo/bar")
//     cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
//     cy.visit('/')
//   })
//
//   // it('tc001 validating management assessment popup', () => {
//   //   commonFunction.clickOnElement(landingPage.assessmentNameInGrid(1),'User clicks on th assessment')
//   //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
//   //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
//   //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption(),'Manage assessment option is clicked')
//   //   commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Manage assessment popup is visible')
//   // })
//   //
//   // it('tc002 validating fields in manage assessment popup', () => {
//   //   landingPage.assessmentNameInGrid(1).click()
//   //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
//   //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
//   //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
//   //   commonFunction.elementIsVisible(landingPage.AssessmentName(),'Assessment Name field is visible')
//   //   commonFunction.elementIsVisible(landingPage.OrganisationName(),'Organisation Name field is visible')
//   //   commonFunction.elementIsVisible(landingPage.Domain(),'Domain field is visible')
//   //   commonFunction.elementIsVisible(landingPage.Industry(),'Industry field is visible')
//   //   commonFunction.elementIsVisible(landingPage.teamSizeField(),'teamSizefield is visible')
//   //   commonFunction.elementIsVisible(landingPage.emailField(),'email field is visible')
//   //   commonFunction.elementIsVisible(assessmentPage.manageAssessmentSubmitButton(),'Submit button is visible')
//   //   })
//     it('tc003 change assessment nme and verify name is changed in landing page and assessment header', () => {
//       //commonFunction.clickOnElement(landingPage.createAssessment(),'Create assessment popup should be opened')
//       //landingPage.AssessmentpopupFields('manageAssessmentName','OrgTest','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
//       //commonFunction.clickOnElement(landingPage.saveAssessmentButton(),'Assessment is created')
//       //commonFunction.textBaseAssertions(landingPage.assessmentNameInGrid(1),' manageAssessmentName ','Assessment name is displayed as expected')
//       let initialAssessmentName=landingPage.assessmentNameInGrid(1).invoke('text')
//       commonFunction.clickOnElement(landingPage.assessmentNameInGrid(1),'User clicks on th assessment')
//       commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
//       commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
//       commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
//       commonFunction.elementIsVisible(landingPage.AssessmentPopup(),'Manage assessment popup is visible')
//       assessmentPage.assessmentNameValue().should('have.value','manageassessmentname')
//     })
// //     it('tc004 change Organisation name and verify name is changed in landing page', () => {
// // //   landingPage.assessmentNameInGrid(1).click()
// //       //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
// //       //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
// //       //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
// //       //   commonFunction.elementIsVisible(landingPage.AssessmentName(),'Assessment Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.OrganisationName(),'Organisation Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Domain(),'Domain field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Industry(),'Industry field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.teamSizeField(),'teamSizefield is visible')
// //       //   commonFunction.elementIsVisible(landingPage.emailField(),'email field is visible')
// //       //   commonFunction.elementIsVisible(assessmentPage.manageAssessmentSubmitButton(),'Submit button is visible')
// //     })
// //     it('tc002 update all fields in the manage assessment popup', () => {
// // //   landingPage.assessmentNameInGrid(1).click()
// //       //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
// //       //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
// //       //   commonFunction.elementIsVisible(landingPage.teamSizeField(),'teamSizefield is visible')
// //       //   commonFunction.elementIsVisible(landingPage.emailField(),'email field is visible')
// //       //   commonFunction.elementIsVisible(assessmentPage.manageAssessmentSubmitButton(),'Submit button is visible')
// //     })
// //     it('tc002 update users in management assessment popup', () => {
// // //   landingPage.assessmentNameInGrid(1).click()
// //       //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
// //       //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
// //       //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
// //       //   commonFunction.elementIsVisible(landingPage.AssessmentName(),'Assessment Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.OrganisationName(),'Organisation Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Domain(),'Domain field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Industry(),'Industry field is visible')
// //
// //     })
// //     it('tc007 update all fields with invalid data', () => {
// // //   landingPage.assessmentNameInGrid(1).click()
// //       //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
// //       //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
// //       //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
// //       //   commonFunction.elementIsVisible(landingPage.AssessmentName(),'Assessment Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.OrganisationName(),'Organisation Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Domain(),'Domain field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Industry(),'Industry field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.teamSizeField(),'teamSizefield is visible')
// //       //   commonFunction.elementIsVisible(landingPage.emailField(),'email field is visible')
// //       //   commonFunction.elementIsVisible(assessmentPage.manageAssessmentSubmitButton(),'Submit button is visible')
// //       //   landingPage.assessmentNameInGrid(1).click()
// //       //   commonFunction.elementIsVisible( assessmentPage.assessmentNameHeader(),'User is navigated to Assessment page')
// //       //   commonFunction.clickOnElement(assessmentPage.threeDots(),'menu icon is clicked')
// //       //   commonFunction.clickOnElement(assessmentPage.manageAssessmentOption().click(),'Manage assessment option is clicked')
// //       //   commonFunction.elementIsVisible(landingPage.AssessmentName(),'Assessment Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.OrganisationName(),'Organisation Name field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Domain(),'Domain field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.Industry(),'Industry field is visible')
// //       //   commonFunction.elementIsVisible(landingPage.teamSizeField(),'teamSizefield is visible')
// //       //   commonFunction.elementIsVisible(landingPage.emailField(),'email field is visible')
// //       //   commonFunction.elementIsVisible(assessmentPage.manageAssessmentSubmitButton(),'Submit button is visible')
// //     })
//     it('tc008 update the details and close the popup without clicking on update button', () => {
//
//     })
//     it('tc009 manage assessment popup should be disabled when the assessment is finished', () => {
//
//     })
//
//     it('tc010 manage assessment popup should not be disabled when the assessment is reopened', () => {
//
//     })
//
//     it('tc011 data saved details should be updated when details are updated in the manage assessment popup', () => {
//
//     })
//     it('tc012 update the assessment without filling mandatory fields', () => {
//
//     })
//     it('tc013 update the assessment with invalid userid', () => {
//
//     })
//     it('tc014 update the assessment with max characters in the field', () => {
//
//     })
//     it('tc015 update the assessment with invalid integer in team size field', () => {
//
//     })
//     it('tc016 update the assessment without filling mandatory fields', () => {
//
//     })
//
//   })
//

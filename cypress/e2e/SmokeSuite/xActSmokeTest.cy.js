// const fs=require('fs')
// const xlsx= require('xlsx')
// import loginPage from "../../pageObjects/loginPage.cy";
// import landingPage from "../../pageObjects/landingPage.cy";
// import assessmentPage from "../../pageObjects/assessmentPage.cy";
// import commonFunctionCy from "../../pageObjects/commonFunction.cy";
// describe('Smoke suite to verify all the major functionalities of the xAct application',()=>{
//
//   beforeEach ('Launching the xAct application',()=>{
//     cy.visit('/')
//     cy.wait(500)
//   })
//
//   // it('tc001 loging in to the xact application', () => {
//   // loginPage.xActLogin()
//   //   loginPage.xActHomepagetitleValidation()
//   // })
//
//   // it('tc002 creating an assessment',()=>{
//   //   landingPage.landingPageFields()
//   //   landingPage.createAssessment().should('be.visible')
//   //   landingPage.createAssessment().click()
//   //   landingPage.AssessmentpopupFields('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
//   //   landingPage.saveAssessmentButton().click()
//   //   landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
//   // })
//
//
//   it('Download excel',()=>{
//
//     cy.wait(2000);
// // call the parseXlsx task we created above to parse the excel and return data as json
//     assessmentPage.parseXlsx("/Users/jathin.medurithoughtworks.com/Downloads/xact-report-11.xlsx").then(
//       jsonData => {
//         // finally we write the assertion rule to check if that data matches the data we expected the excel file to have.
//         expect(jsonData[0].data[0]).to.eqls(data);
//       }
//     );
//
//   })
//
//   it('tc003 Searching for an assessment',() => {
//     landingPage.searchBox().clear()
//     landingPage.searchBox().type('TestAssignment')
//     landingPage.searchAssessmentGrid(' TestAssignment ',' testorg ')
//     landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
//   })
//
//   it('tc004 providing notes and maturity assessment rating for Software Engineering category',()=>{
//     landingPage.assessmentNameInGrid(1).click()
//     cy.fixture('ArchitecturalStyle').then((testData) => {
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(1),testData[0].notes[0])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(2),testData[0].notes[1])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(3),testData[0].notes[2])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(4),testData[0].notes[3])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(5),testData[0].notes[4])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(6),testData[0].notes[5])
//
//       assessmentPage.assessmentMaturityScoreRating(2).click()
//       assessmentPage.dataStatus().should('have.text',' Last saved at a few seconds ago ')
//     })
//
//   })
//   it('tc005 providing notes and maturity assessment rating for Product and Design category',()=>{
//     landingPage.assessmentNameInGrid(1).click()
//     assessmentPage.category(2).click()
//     assessmentPage.productAndDesignModules(1).click()
//     assessmentPage.parameterMaturityScore(3).click()
//     cy.fixture('DevOps').then((testData) => {
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(85),testData[0].notes[0])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(86),testData[0].notes[1])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(87),testData[0].notes[2])
//       commonFunctionCy.typeInElement( assessmentPage.notesForQuestions(88),testData[0].notes[3])
//       assessmentPage.parameterMaturityScore(4,3).click()
//       assessmentPage.dataStatus().should('have.text',' Last saved at a few seconds ago ')
//     })
//   })
//   it('tc006 providing notes and maturity assessment rating for Operational efficiency category',()=>{
//     landingPage.assessmentNameInGrid(1).click()
//     assessmentPage.category(3).click()
//     assessmentPage.operationalEfficiencyModules(1).click()
//     cy.fixture('DevOps').then((testData) => {
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(124), testData[0].notes[0])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(125), testData[0].notes[1])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(126), testData[0].notes[2])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(127), testData[0].notes[3])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(128), testData[0].notes[0])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(129), testData[0].notes[0])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(130), testData[0].notes[1])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(131), testData[0].notes[2])
//     })
//     assessmentPage.assessmentMaturityScoreRating(2).click()
//     assessmentPage.dataStatus().should('have.text',' Last saved at a few seconds ago ')
//
//   })
//   it('tc007 providing notes and maturity assessment rating for Cloud platform category',()=>{
//     landingPage.assessmentNameInGrid(1).click()
//     assessmentPage.category(4).click()
//     assessmentPage.cloudPlatformModules(1).click()
//     cy.fixture('DevOps').then((testData) => {
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(220), testData[0].notes[0])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(221), testData[0].notes[1])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(222), testData[0].notes[2])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(223), testData[0].notes[3])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(224), testData[0].notes[4])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(225), testData[0].notes[5])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(226), testData[0].notes[6])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(227), testData[0].notes[4])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(228), testData[0].notes[4])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(229), testData[0].notes[5])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(230), testData[0].notes[6])
//       commonFunctionCy.typeInElement(assessmentPage.notesForQuestions(231), testData[0].notes[4])
//     })
//     assessmentPage.parameterMaturityScore(3,3).click()
//     assessmentPage.dataStatus().should('have.text',' Last saved at a few seconds ago ')
//   })
//
//
//
//
//
//
//
//
// })

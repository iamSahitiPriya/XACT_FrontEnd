import landingPage from "../pageObjects/landingPage.cy";
import commonFunction from '../pageObjects/commonFunction.cy'
import assessmentPage from "../pageObjects/assessmentPage.cy";


describe('validating creating Assessment assessment popup functionality', () => {
  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.visit('/')
    cy.wait(500)
  })

  // Architectural style parameter
  it('tc001 Continuous Integration and Deployment topic validation', () => {
    landingPage.assessmentNameInGrid(1).click()

    assessmentPage.modules(1,2).click()
    //assessmentPage.softwareEngModuleClick()
    assert.exists(assessmentPage.topicTab(1).should('have.text', 'Continuous Integration and Deployment'), 'User is navigated to Devops module')
    cy.fixture('DevOps').then((testData) => {
      assessmentPage.parameter(1).should('be.visible').contains(testData[0].CIDParameters[0])
      assessmentPage.questions(1, 2, 1).click().should('be.visible').contains(testData[0].CIDQuestions[0])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(7), testData[0].notes[0])
      assessmentPage.questions(1, 2, 2).click().should('be.visible').contains(testData[0].CIDQuestions[1])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(8), testData[0].notes[1])
      //commonFunction.typeInElement(assessmentPage.questions(1,2,2),testData[0].notes[1])
      assessmentPage.questions(1, 2, 3).click().should('be.visible').contains(testData[0].CIDQuestions[2])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(9), testData[0].notes[2])
      // commonFunction.typeInElement(assessmentPage.questions(1,2,3),testData[0].notes[2])
      assessmentPage.parameterMaturityScoreDesc(1, 3).click({ multiple: true }).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[0])
      assessmentPage.parameterMaturityScoreDesc(1, 4).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[1])
      assessmentPage.parameterMaturityScoreDesc(1, 5).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[2])
      assessmentPage.parameterMaturityScoreDesc(1, 6).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[3])
      assessmentPage.parameterMaturityScoreDesc(1, 7).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[4])
      assessmentPage.parameter(2).click().should('be.visible').contains(testData[0].CIDParameters[1])
      assessmentPage.questions(2, 2, 1).click().should('be.visible').contains(testData[0].CIDQuestions[3])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(9), testData[0].notes[0])
      // commonFunction.typeInElement(assessmentPage.questions(2,2,1),testData[0].notes[3])
      assessmentPage.questions(2, 2, 2).click().should('be.visible').contains(testData[0].CIDQuestions[4])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(10), testData[0].notes[0])
      // commonFunction.typeInElement(assessmentPage.questions(2,2,2),testData[0].notes[4])
      assessmentPage.questions(2, 2, 3).click().should('be.visible').contains(testData[0].CIDQuestions[5])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(11), testData[0].notes[0])
      cy.log('test')
      assessmentPage.questions(2, 2, 4).click().should('be.visible').contains(testData[0].CIDQuestions[6])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(13), testData[0].notes[0])
      // commonFunction.typeInElement(assessmentPage.questions(2,2,4),testData[0].notes[6])
      assessmentPage.parameterMaturityScoreDesc(2, 3).click({ multiple: true }).should('be.visible')//.contains(testData[0].CIDAssignmentMaturityScoreDesc[5])
      assessmentPage.parameterMaturityScoreDesc(2, 4).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[6])
      assessmentPage.parameterMaturityScoreDesc(2, 5).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[7])
      assessmentPage.parameterMaturityScoreDesc(2, 6).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[8])
      assessmentPage.parameterMaturityScoreDesc(2, 7).should('be.visible').contains(testData[0].CIDAssignmentMaturityScoreDesc[9])
      assessmentPage.editBox().should('have.length', '9')
    })
  })


  it('tc002 Production operations topic validation', () => {
    landingPage.assessmentNameInGrid(1).click()
    assessmentPage.modules(1,2).click()
    assessmentPage.topicTab(2).click()
    cy.fixture('DevOps').then((testData) => {
      //48,55
      assessmentPage.parameter(1).should('be.visible').contains(testData[1].ProductionOperationsParameters[0])
      assessmentPage.questions(1,2,1).last().should('be.visible').contains(testData[1].ProductionOperationsQuestions[0])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(48), testData[0].notes[0])
      assessmentPage.questions(1,2,2).click().should('be.visible').contains(testData[1].ProductionOperationsQuestions[1])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(49), testData[0].notes[1])
      assessmentPage.questions(1,2,3).click().should('be.visible').contains(testData[1].ProductionOperationsQuestions[2])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(50), testData[0].notes[2])
      assessmentPage.questions(1,2,4).click().should('be.visible').click().contains(testData[1].ProductionOperationsQuestions[3])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(51), testData[0].notes[3])
      assessmentPage.questions(1,2,5).click().should('be.visible').contains(testData[1].ProductionOperationsQuestions[4])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(52), testData[0].notes[4])
      assessmentPage.parameterMaturityScoreDesc(1,3).click({ multiple: true }).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[0])
      assessmentPage.parameterMaturityScoreDesc(1,4).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[1])
      assessmentPage.parameterMaturityScoreDesc(1,5).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[2])
      assessmentPage.parameterMaturityScoreDesc(1,6).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[3])
      assessmentPage.parameterMaturityScoreDesc(1,7).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[4])
      assessmentPage.parameter(2).click().should('be.visible').contains(testData[1].ProductionOperationsParameters[1])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(53), testData[0].notes[4])
      assessmentPage.questions(2,2,2).click().should('be.visible').contains(testData[1].ProductionOperationsQuestions[6])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(54), testData[0].notes[4])
      assessmentPage.questions(2,2,3).click().should('be.visible').contains(testData[1].ProductionOperationsQuestions[7])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(55), testData[0].notes[4])
      assessmentPage.parameterMaturityScoreDesc(2,3).click().should('be.visible')//.contains(testData[0].CIDAssignmentMaturityScoreDesc[5])
      assessmentPage.parameterMaturityScoreDesc(2,4).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[6])
      assessmentPage.parameterMaturityScoreDesc(2,5).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[7])
      assessmentPage.parameterMaturityScoreDesc(2,6).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[8])
      assessmentPage.parameterMaturityScoreDesc(2,7).should('be.visible').contains(testData[1].ProductionOperationsAssignmentMaturityScoreDesc[9])
    })
  })

  it('tc003 Environments topic validation', () => {
    landingPage.assessmentNameInGrid(1).click()
    assessmentPage.modules(1,2).click()
    assessmentPage.topicTab(3).click()
    cy.fixture('DevOps').then((testData) => {
      //48,55
      assessmentPage.parameter(1).should('be.visible',{force:true}).contains(testData[2].EnvironmentsParameters[0])
      assessmentPage.questions(1,2,1).first()
      // .should('be.visible').contains(testData[2].EnvironmentsQuestions[0])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(56), testData[0].notes[0])
      assessmentPage.questions(1,2,2).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[1])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(57), testData[0].notes[1])
      assessmentPage.questions(1,2,3).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[2])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(58), testData[0].notes[2])
      assessmentPage.questions(1,2,4).click().should('be.visible').click().contains(testData[2].EnvironmentsQuestions[3])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(59), testData[0].notes[3])
      assessmentPage.parameterMaturityScoreDesc(1,3).click().should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[0])
      assessmentPage.parameterMaturityScoreDesc(1,4).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[1])
      assessmentPage.parameterMaturityScoreDesc(1,5).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[2])
      assessmentPage.parameterMaturityScoreDesc(1,6).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[3])
      assessmentPage.parameterMaturityScoreDesc(1,7).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[4])
      assessmentPage.parameter(2).click().should('be.visible').contains(testData[2].EnvironmentsParameters[1])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(60), testData[0].notes[4])
      assessmentPage.questions(2,2,1).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[4])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(61), testData[0].notes[4])
      assessmentPage.questions(2,2,2).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[5])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(62), testData[0].notes[4])
      assessmentPage.questions(2,2,3).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[6])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(63), testData[0].notes[4])
      assessmentPage.questions(2,2,4).click().should('be.visible').contains(testData[2].EnvironmentsQuestions[7])
      commonFunction.typeInElement(assessmentPage.notesForQuestions(63), testData[0].notes[4])
      assessmentPage.parameterMaturityScoreDesc(2,3).click().should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[5])
      assessmentPage.parameterMaturityScoreDesc(2,4).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[6])
      assessmentPage.parameterMaturityScoreDesc(2,5).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[7])
      assessmentPage.parameterMaturityScoreDesc(2,6).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[8])
      assessmentPage.parameterMaturityScoreDesc(2,7).should('be.visible').contains(testData[2].EnvironmentsMaturityScoreDesc[9])
    })
  })

})






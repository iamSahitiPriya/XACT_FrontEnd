// import loginPage from "../pageObjects/loginPage";
// import landingPage from "../pageObjects/landingPage";
// import commonFunctions from "../pageObjects/commonFunction";
// import assessmentPage from "../pageObjects/assessmentPage";
// describe('validating functionality of login page of xAct application', () => {
//
//   beforeEach('User should get navigated to Okta by launching the url', () => {
//     cy.window().then(win => win.location.hash = "/foo/bar")
//     cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
//     cy.visit('/')
//     })
//
//
//   it('tc001 creating an assessment',()=>{
//     landingPage.createAssessment().click()
//     landingPage.AssessmentpopupFields('E2EAssessment','Organisation','Domain','Industry','11','jathin@thoughtworks.com')
//     landingPage.createAssessmentSaveBtn().click()
//     landingPage.assessmentNameInGrid(1).should('have.text',' E2EAssessment ')
//   })
//
//   it('tc002 provide notes to questions,ratings,ratings to the Architecture quality module of software Engineering category',()=>{
//     landingPage.assessmentNameInGrid(1).click()
//     //Architectural style topic
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(1),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(2),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(3),'modularity is ensured at low-level implementation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(4),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(5),'components have their own data model,they map to the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(6),'overview of the underlying data model')
//     assessmentPage.assessmentMaturityScoreRating(2).click()
//     commonFunctions.typeInElement(assessmentPage.recomendation(1),'recomendation')
//     //API Strategy tab
//     assessmentPage.topicTab(2).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(14),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(15),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(16),'modularity is ensured at low-level implementation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(17),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(18),'components have their own data model,they map to the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(19),'overview of the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(20),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(21),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(22),'components have their own data model,they map to the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(23),'overview of the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(24),'components map to domain at hand')
//     assessmentPage.assessmentMaturityScoreRating(3).click()
//     commonFunctions.typeInElement(assessmentPage.recomendation(2),'recomendation')
//
//
//     //Technology stack tab
//     assessmentPage.topicTab(3).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(25),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(26),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(27),'modularity is ensured at low-level implementation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(28),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(29),'enternal and external system dependencies')
//     assessmentPage.assessmentMaturityScoreRating(2).click()
//     commonFunctions.typeInElement(assessmentPage.recomendation(3),'recomendation')
//
//     //Performance
//     assessmentPage.topicTab(4).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(30),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(31),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(32),'modularity is ensured at low-level implementation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(33),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(34),'components have their own data model,they map to the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(35),'overview of the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(36),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(37),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(38),'components have their own data model,they map to the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(39),'overview of the underlying data model')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(40),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(41),'components map to domain at hand')
//     assessmentPage.assessmentMaturityScoreRating(3).click()
//     commonFunctions.typeInElement(assessmentPage.recomendation(4),'recomendation')
//
//     //Governance
//     assessmentPage.topicTab(5).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(42),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(43),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(44),'modularity is ensured at low-level implementation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(45),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(46),'enternal and external system dependencies')
//     assessmentPage.assessmentMaturityScoreRating(2).click()
//     commonFunctions.typeInElement(assessmentPage.recomendation(5),'recomendation')
//
//   })
//
//   it('tc003 provide notes to questions,ratings,ratings to the DevOps module of software Engineering category',()=> {
//     landingPage.assessmentNameInGrid(1).click()
//     assessmentPage.softwareEngineeringModules(2).click()
//     //Build parameter
//     if(assessmentPage.parameter(1).contains('Build')){
//       assert.isOk(assessmentPage.parameter(1),'User is navigated to Build topic')
//     }else {
//       assert.isNotOk(fail,'User is navigated to Build topic')
//     }
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(7),'components map to domain at hand')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(8),'components interacting with each other')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(9),'modularity is ensured at low-level implementation')
//     assessmentPage.parameterMaturityScore(2,3).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(52),'buildParameterRecomendation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(10),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(11),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(12),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(13),'enternal and external system dependencies')
//     assessmentPage.parameterMaturityScore(2,3).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(53),'DeploymentParameterRecomendation')
//
//     //Production operations
//     assessmentPage.topicTab(2).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(48),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(49),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(50),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(51),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(52),'enternal and external system dependencies')
//     assessmentPage.parameterMaturityScore(1,4).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(54),'ObservabilityRecomendation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(53),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(54),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(55),'enternal and external system dependencies')
//     assessmentPage.parameterMaturityScore(1,4).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(55),'BusinessContinuityParameterRecomendation')
//
//     //Environments
//     assessmentPage.topicTab(3).click()
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(56),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(57),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(58),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(59),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(60),'enternal and external system dependencies')
//     assessmentPage.parameterMaturityScore(1,4).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(56),'ObservabilityRecomendation')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(61),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(62),'enternal and external system dependencies')
//     commonFunctions.typeInElement(assessmentPage.notesForQuestions(63),'enternal and external system dependencies')
//     assessmentPage.parameterMaturityScore(1,4).click()
//     commonFunctions.typeInElement(assessmentPage.parameterRecommendation(57),'BusinessContinuityParameterRecomendation')
//   })
//
//
//
//
//
// })

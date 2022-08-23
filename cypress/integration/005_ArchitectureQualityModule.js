import loginPage from "../pageObjects/loginPage";
import landingPage from "../pageObjects/landingPage";
import commonFunction from '../pageObjects/commonFunction'
import assessmentPage from "../pageObjects/assessmentPage";


describe('validating creating Assessment assessment popup functionality', () => {
  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
    cy.wait(500)
  })

  //Architectural style parameter
  it('tc001 Architectural style parameter validation',()=> {
    landingPage.assessmentNameInGrid(1).click()
    cy.fixture('ArchitecturalStyle').then((testData) => {
      assessmentPage.topicTab(1).should('have.class', 'mat-ripple mat-tab-label mat-focus-indicator mat-tab-label-active ng-star-inserted')
      assessmentPage.parameter(1).should('be.visible').contains(testData[0].ArchitecturalStyleParameters[0])
      assessmentPage.parameter(2).click().should('be.visible').contains(testData[0].ArchitecturalStyleParameters[1])
      assessmentPage.parameter(3).click().should('be.visible').contains(testData[0].ArchitecturalStyleParameters[2])

    })
  })

    it('tc002 Assignment score description validation', () => {
      landingPage.assessmentNameInGrid(1).click()
      cy.fixture('ArchitecturalStyle').then((testData) => {
        assessmentPage.maturityScoreHeader().click()
        assessmentPage.assignmentMaturityScoreDescription(2).should('be.visible').contains(testData[0].ArchitecturalStyleAssignmentMaturityScoreDesc[0])
        assessmentPage.assignmentMaturityScoreDescription(3).should('be.visible').contains(testData[0].ArchitecturalStyleAssignmentMaturityScoreDesc[1])
        assessmentPage.assignmentMaturityScoreDescription(4).should('be.visible').contains(testData[0].ArchitecturalStyleAssignmentMaturityScoreDesc[2])
        assessmentPage.assignmentMaturityScoreDescription(5).should('be.visible').contains(testData[0].ArchitecturalStyleAssignmentMaturityScoreDesc[3])
        assessmentPage.assignmentMaturityScoreDescription(6).should('be.visible').contains(testData[0].ArchitecturalStyleAssignmentMaturityScoreDesc[4])
      })
    })

    it('tc003 questions validation', () => {
      landingPage.assessmentNameInGrid(1).click()
      cy.fixture('ArchitecturalStyle').then((testData) => {
        assessmentPage.questions(1, 2, 1).should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[0])
        assessmentPage.questions(1, 2, 2).should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[1])
        assessmentPage.questions(1, 2, 3).should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[2])
        assessmentPage.questions(2, 2, 1).click()
        assessmentPage.questions(2, 2, 1).should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[3])
        assessmentPage.questions(3, 2, 1).click().should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[4])
        assessmentPage.questions(3, 2, 2).should('be.visible').contains(testData[0].ArchitecturalStyleQuestions[5])

      })
    })

    it('tc004 computed maturity score validation', () => {
      landingPage.assessmentNameInGrid(1).click()
      assessmentPage.topicTab(2).click()
      assessmentPage.computedMaturityScoreHeader().should('be.visible')
      assessmentPage.computedScoreRatingFrame().should('be.visible')
    })

    //API Strategy

    it('tc005 API Strategy parameter validation', () => {
      landingPage.assessmentNameInGrid(1).click()
      assessmentPage.topicTab(2).click()
      cy.fixture('ArchitecturalStyle').then((testData) => {
        assessmentPage.parameter(1).should('be.visible').contains(testData[1].APIStrategyParameters[0])
        assessmentPage.parameter(2).last().click().should('be.visible').contains(testData[1].APIStrategyParameters[1])
        assessmentPage.parameter(3).last().click().should('be.visible').contains(testData[1].APIStrategyParameters[2])
      })
    })

      it('tc006 API Strategy Assignment score description validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(2).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.maturityScoreHeader().last().click()
          assessmentPage.assignmentMaturityScoreDescription(2).should('be.visible').contains(testData[1].ApiStrategyAssignmentMaturityScoreDesc[0])
          assessmentPage.assignmentMaturityScoreDescription(3).should('be.visible').contains(testData[1].ApiStrategyAssignmentMaturityScoreDesc[1])
          assessmentPage.assignmentMaturityScoreDescription(4).should('be.visible').contains(testData[1].ApiStrategyAssignmentMaturityScoreDesc[2])
          assessmentPage.assignmentMaturityScoreDescription(5).should('be.visible').contains(testData[1].ApiStrategyAssignmentMaturityScoreDesc[3])

          assessmentPage.assignmentMaturityScoreDescription(6).last().click().should('be.visible').contains(testData[1].ApiStrategyAssignmentMaturityScoreDesc[4])
        })
      })

      it('tc007 API Strategy questions validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(2).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.questions(1, 2, 1).should('be.visible').contains(testData[1].ApiStrategyQuestions[0])
          assessmentPage.questions(1, 2, 2).should('be.visible').contains(testData[1].ApiStrategyQuestions[1])
          assessmentPage.questions(2, 2, 1).should('be.visible').contains(testData[1].ApiStrategyQuestions[2])
          assessmentPage.questions(2, 2, 2).last().click().should('be.visible').contains(testData[1].ApiStrategyQuestions[3])
          assessmentPage.questions(2, 2, 3).should('be.visible').contains(testData[1].ApiStrategyQuestions[4])
          assessmentPage.questions(2, 2, 4).last().click().should('be.visible').contains(testData[1].ApiStrategyQuestions[5])
          assessmentPage.questions(2, 2, 5).should('be.visible').contains(testData[1].ApiStrategyQuestions[6])
          assessmentPage.questions(2, 2, 6).last().click().should('be.visible').contains(testData[1].ApiStrategyQuestions[7])
          assessmentPage.questions(2, 2, 7).should('be.visible').contains(testData[1].ApiStrategyQuestions[8])
          assessmentPage.questions(3, 2, 1).last().click().should('be.visible').contains(testData[1].ApiStrategyQuestions[9])
          assessmentPage.questions(3, 2, 2).should('be.visible').contains(testData[1].ApiStrategyQuestions[10])
          assessmentPage.questions(3, 2, 3).last().click().should('be.visible').contains(testData[1].ApiStrategyQuestions[11])

        })
      })

      it('tc008 API Strategy computed maturity score validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(2).click()
        assessmentPage.computedMaturityScoreHeader().should('be.visible')
        assessmentPage.computedScoreRatingFrame().should('be.visible')
      })
      //Technology stack
      it('tc009 Technology stack parameter validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(3).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.parameter(1).should('be.visible').contains(testData[2].TechnologyStackParameters)
        })
      })


        it('tc010 Technology stack Assignment score description validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(3).click()
          cy.fixture('ArchitecturalStyle').then((testData) => {
            assessmentPage.maturityScoreHeader().last().click()
            assessmentPage.assignmentMaturityScoreDescription(2).should('be.visible').contains(testData[2].AssignMaturityScoreTechnologyStack[0])
            assessmentPage.assignmentMaturityScoreDescription(3).should('be.visible').contains(testData[2].AssignMaturityScoreTechnologyStack[1])
            assessmentPage.assignmentMaturityScoreDescription(4).should('be.visible').contains(testData[2].AssignMaturityScoreTechnologyStack[2])
            assessmentPage.assignmentMaturityScoreDescription(5).should('be.visible').contains(testData[2].AssignMaturityScoreTechnologyStack[3])
            assessmentPage.assignmentMaturityScoreDescription(6).last().click().should('be.visible').contains(testData[2].AssignMaturityScoreTechnologyStack[4])
          })
        })

        it('tc011 Technology stack questions validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(3).click()
          cy.fixture('ArchitecturalStyle').then((testData) => {
            assessmentPage.questions(1, 2, 1).should('be.visible').contains(testData[2].TechnologyStackQuestions[0])
            assessmentPage.questions(1, 2, 2).last().click().should('be.visible').contains(testData[2].TechnologyStackQuestions[1])
            assessmentPage.questions(1, 2, 3).should('be.visible').contains(testData[2].TechnologyStackQuestions[2])
            assessmentPage.questions(1, 2, 4).should('be.visible').contains(testData[2].TechnologyStackQuestions[3])
            assessmentPage.questions(1, 2, 5).last().click().should('be.visible').contains(testData[2].TechnologyStackQuestions[4])
          })
        })

        it('tc012 Technology stack computed maturity score validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(3).click()
          assessmentPage.computedMaturityScoreHeader().should('be.visible')
          assessmentPage.computedScoreRatingFrame().should('be.visible')
        })

        //Performance
        it('tc013 Performance parameter validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(4).click()
          cy.fixture('ArchitecturalStyle').then((testData) => {
            assessmentPage.parameter(1).should('be.visible').contains(testData[3].PerformanceParameters[0])
            assessmentPage.parameter(2).last().click().should('be.visible').contains(testData[3].PerformanceParameters[1])
            assessmentPage.parameter(3).last().click().should('be.visible').contains(testData[3].PerformanceParameters[2])
          })
        })

        it('tc014 Performance Assignment score description validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(4).click()
          cy.fixture('ArchitecturalStyle').then((testData) => {
            assessmentPage.maturityScoreHeader().last().click()
            assessmentPage.assignmentMaturityScoreDescription(2).should('be.visible').contains(testData[3].AssignMaturityScorePerformance[0])
            assessmentPage.assignmentMaturityScoreDescription(3).should('be.visible').contains(testData[3].AssignMaturityScorePerformance[1])
            assessmentPage.assignmentMaturityScoreDescription(4).should('be.visible').contains(testData[3].AssignMaturityScorePerformance[2])
            assessmentPage.assignmentMaturityScoreDescription(5).should('be.visible').contains(testData[3].AssignMaturityScorePerformance[3])
            assessmentPage.assignmentMaturityScoreDescription(6).last().click().should('be.visible').contains(testData[3].AssignMaturityScorePerformance[4])
          })
        })

        it('tc015 Performance questions validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(4).click()
          cy.fixture('ArchitecturalStyle').then((testData) => {
            assessmentPage.questions(1, 2, 1).should('be.visible').contains(testData[3].PerformanceQuestions[0])
            assessmentPage.questions(1, 2, 2).should('be.visible').contains(testData[3].PerformanceQuestions[1])
            assessmentPage.questions(1, 2, 3).last().click().should('be.visible').contains(testData[3].PerformanceQuestions[2])
            assessmentPage.questions(1, 2, 4).should('be.visible').contains(testData[3].PerformanceQuestions[3])
            assessmentPage.questions(1, 2, 5).last().click().should('be.visible').contains(testData[3].PerformanceQuestions[4])

            assessmentPage.questions(2, 2, 1).should('be.visible').contains(testData[3].PerformanceQuestions[5])
            assessmentPage.questions(2, 2, 2).last().click().should('be.visible').contains(testData[3].PerformanceQuestions[6])
            assessmentPage.questions(2, 2, 3).should('be.visible').contains(testData[3].PerformanceQuestions[7])
            assessmentPage.questions(2, 2, 4).last().click().should('be.visible').contains(testData[3].PerformanceQuestions[8])

            assessmentPage.questions(3, 2, 1).should('be.visible').contains(testData[3].PerformanceQuestions[9])
            assessmentPage.questions(3, 2, 2).should('be.visible').contains(testData[3].PerformanceQuestions[10])
            assessmentPage.questions(3, 2, 3).last().click().should('be.visible').contains(testData[3].PerformanceQuestions[11])
          })
        })

        it('tc016 Performance computed maturity score validation', () => {
          landingPage.assessmentNameInGrid(1).click()
          assessmentPage.topicTab(4).click()
          assessmentPage.computedMaturityScoreHeader().should('be.visible')
          assessmentPage.computedScoreRatingFrame().should('be.visible')
        })

      it('tc013 Governance parameter validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(5).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.parameter(1).should('be.visible').contains(testData[4].GovernanceParameters[0])
          assessmentPage.parameter(2).should('be.visible').contains(testData[4].GovernanceParameters[1])
        })
      })

      it('tc014 Governance Assignment score description validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(5).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.maturityScoreHeader().last().click()
          assessmentPage.assignmentMaturityScoreDescription(2).should('be.visible').contains(testData[4].AssignMaturityScoreGovernance[0])
          assessmentPage.assignmentMaturityScoreDescription(3).should('be.visible').contains(testData[4].AssignMaturityScoreGovernance[1])
          assessmentPage.assignmentMaturityScoreDescription(4).should('be.visible').contains(testData[4].AssignMaturityScoreGovernance[2])
          assessmentPage.assignmentMaturityScoreDescription(5).should('be.visible').contains(testData[4].AssignMaturityScoreGovernance[3])
          assessmentPage.assignmentMaturityScoreDescription(6).last().click().should('be.visible').contains(testData[4].AssignMaturityScoreGovernance[4])
        })
      })

      it('tc015 Governance questions validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(5).click()
        cy.fixture('ArchitecturalStyle').then((testData) => {
          assessmentPage.questions(1, 2, 1).should('be.visible').contains(testData[4].GovernanceQuestions[0])
          assessmentPage.questions(1, 2, 2).should('be.visible').contains(testData[4].GovernanceQuestions[1])
          assessmentPage.questions(2, 2, 1).last().click().should('be.visible').contains(testData[4].GovernanceQuestions[2])
          assessmentPage.questions(2, 2, 2).should('be.visible').contains(testData[4].GovernanceQuestions[3])
          assessmentPage.questions(2, 2, 3).last().click().should('be.visible').contains(testData[4].GovernanceQuestions[4])
        })
      })

      it('tc016 Governance computed maturity score validation', () => {
        landingPage.assessmentNameInGrid(1).click()
        assessmentPage.topicTab(5).click()
        assessmentPage.computedMaturityScoreHeader().should('be.visible')
        assessmentPage.computedScoreRatingFrame().should('be.visible')

      })




})



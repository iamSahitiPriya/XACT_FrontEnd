class landingPage {

  static finishAssessmentButton() {
    return cy.get('#finishAssessment')
  }

  static generateReportButton(){
    return cy.get('#generate-report')
  }

  static assessmentNameHeader(){
    return cy.get('.name')
  }

  static dataStatus(){
    return cy.get('.dataStatus')
  }

  static moduleHeader(){
    return cy.get('.moduleHead')
  }

  static moduleHeader(){
    return cy.get('.mat-toolbar > .mat-focus-indicator')
  }

  static computedMaturityScoreHeader(){
    return cy.get('.maturityScore')
  }

  static computedMaturityScoreBlock(){
    return cy.get('.parameterScoring')
  }

  static computedMaturityScoreRating(){
    return cy.get('app-assessment-average-rating > :nth-child(1) > :nth-child(2) > .mat-toolbar > .rating')
  }

  static threeDots(){
    return cy.get('.menuIcon')
  }



}

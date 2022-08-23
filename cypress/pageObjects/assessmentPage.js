import landingPage from "./landingPage";

class assessmentPage {

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

  static computedScoreRatingFrame(){
    return cy.get('app-assessment-average-rating > :nth-child(1) > :nth-child(2) > .mat-toolbar > .rating')
  }

  static computedMaturityScoreBlock(){
    return cy.get('.parameterScoring')
  }

  static computedMaturityScoreRating(){
    return cy.get('app-assessment-average-rating > :nth-child(1) > :nth-child(2) > .mat-toolbar > .rating')
  }

  static parameter(index){
    return cy.get(':nth-child('+index+') > #questionContainer > .parameter')
  }

  static threeDots(){
    return cy.get('.menuIcon')
  }

  static notesForQuestions(index){
    return cy.get('#assessmentAnswer'+index)
  }

  static recomendation(index){
    return cy.get('#recommendationElement_topic'+index)
  }

  static maturityScoreHeader(){
    return cy.get('.topicScoring > .mat-card')
  }

  static asessmentMaturityScoreDescription(index){

  }

  static assessmentMaturityScoreRating(index){
    return cy.get('.topicScoring > :nth-child('+index+') > .mat-toolbar > .rating')
  }

  static topicSaveButton(){
    return cy.get('.topicQuestions > :nth-child(3) > .mat-focus-indicator')
  }

  static parameterMaturityScore(parameterIndex,parameterRatingIndex){
      return cy.get(':nth-child('+parameterIndex+') > :nth-child(3) > app-parameter-level-rating-and-recommendation.ng-star-inserted > .parameterScoring > :nth-child('+parameterRatingIndex+') > .mat-toolbar > .rating')
    }
  static parameterRecommendation(index){
    return cy.get('#recommendationElement_param'+index)
  }

  static topicTab(index){
    return cy.get('mat-tab-header>.mat-tab-label-container>div>div>div:nth-of-type('+index+')')
  }

  static softwareEngineeringModules(index){
    return cy.get('.sideBar>mat-expansion-panel:first-of-type>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }
  static productAndDesignModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(2)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }
  static cloudPlatformModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(3)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }
  static dataPlatformModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(3)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }
  static orgDesignModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(3)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }

  static category(index){
    return cy.get('mat-expansion-panel:nth-of-type('+index+')')
  }
  static softwareEngineeringTab(){
    return cy.get('.sideBar>mat-expansion-panel:first-of-type>.mat-expansion-panel-content')
  }

  static computedMaturityScoreHeader(){
   return cy.get('.maturityScore')
  }

  static questions(index1,index2,index3){
    return cy.get(':nth-child('+index1+') > :nth-child('+index2+') > :nth-child('+index3+') > .question-content')
  }

  static assignmentMaturityScoreDescription(index){
    return cy.get(':nth-child('+index+') > .mat-toolbar > .reference')
  }

}

export default assessmentPage

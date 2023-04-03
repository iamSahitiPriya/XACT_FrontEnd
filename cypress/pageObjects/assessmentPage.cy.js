import landingPage from "./landingPage.cy";

import fs from "fs";
import commonFunctions from "./commonFunction.cy";

class assessmentPage {

  static finishAssessmentButton() {
    return cy.get('#finishAssessment')
  }

  static reOpenhAssessmentButton() {
      return cy.get('#reopenAssessment')
  }
  static configureOption() {
    return cy.get('#createAssessment')

  }

 static modules(categoryIndex,moduleIndex) {
        return cy.get('.side-bar>.expansion_color:nth-child('+categoryIndex+')>mat-expansion-panel>.mat-expansion-panel-content>.mat-expansion-panel-body>.category-modules> :nth-child('+moduleIndex+') > .mat-card')
      }

    static yesButtonInPopup() {
          return cy.get('.mat-dialog-actions > .mat-focus-indicator')
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

  static backToLandingPage(){
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


  static computedMaturityScoreRating(index){
      return cy.get(':nth-child('+index+') > .mat-toolbar > .rating')
    }


  static parameter(index){
    return cy.get(':nth-child('+index+') > #questionContainer > .parameter')
  }

  static threeDots(){
    return cy.get('button[id=menu-button]')
  }


  static notesForQuestions(index){
    return cy.get('#assessmentAnswer'+index)
  }

  static recomendation(index){
    return cy.get('#recommendationElement_topic'+index)
  }
  static topicRecomendation(){
      return cy.get('.recommendation-text>mat-form-field>div>div:nth-child(1)>div:nth-child(3)>textarea')
    }

  static maturityScoreHeader(){
    return cy.get('.topicScoring > .mat-card')
  }

  static asessmentMaturityScoreDescription(index){

  }

  static assessmentMaturityScoreRating(index){
    return cy.get('.topicScoring > :nth-child('+index+') > .mat-toolbar > .rating')
  }
 static autoSaveMessage(parameterIndex,fieldIndex){
    return cy.get(':nth-child('+parameterIndex+') > :nth-child(2) > :nth-child('+fieldIndex+') > app-assessment-question.ng-star-inserted > :nth-child(1) > form.ng-untouched > #testForm > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > .spinParent >.autoSaveMessage')
  }
 static autoSaveMessageRecomendationsTab(){
    return cy.get('.recommendation-text > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > .spinParent>.autoSaveMessage')
  }

  static topicSaveButton(){
    return cy.get('.topicQuestions > :nth-child(3) > .mat-focus-indicator')
  }

  static parameterMaturityScore(parameterIndex,parameterRatingIndex){

      return cy.get(':nth-child('+parameterIndex+') > :nth-child(4) > app-parameter-level-rating.ng-star-inserted > .parameterScoring > :nth-child('+parameterRatingIndex+') > .mat-toolbar > .rating')
    }

    static parameterMaturityScoreHeader(index){
    return cy.get(':nth-child('+index+') > :nth-child(4) > app-parameter-level-rating.ng-star-inserted > .parameterScoring > .mat-card')
    }
  static parameterRecommendation(index){
    return cy.get('#recommendationElement_param'+index)
  }

  static topicTab(index){
    return cy.get('mat-tab-header>.mat-tab-label-container>div>div>div:nth-of-type('+index+')')
  }

  static softwareEngineeringModules(index){
    return cy.get('.categoryModules > :nth-child('+index+')')
  }
  static productAndDesignModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(2)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }

  static operationalEfficiencyModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(3)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
  }
  static cloudPlatformModules(index){
    return cy.get('.sideBar>mat-expansion-panel:nth-of-type(4)>.mat-expansion-panel-content>.mat-expansion-panel-body>.categoryModules>mat-card:nth-of-type('+index+')')
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



  static parameterMaturityScoreDesc(index2,index){

    return cy.get(' :nth-child('+index2+')  > :nth-child(4) > app-parameter-level-rating.ng-star-inserted > .parameterScoring > :nth-child('+index+') > .mat-toolbar > .reference')

  }
static editBox(){
    return cy.get('textarea')
}
  static activeRating(){
    return cy.get('.rating-active')
  }


  static softwareEngModuleClick(index) {
    if (assessmentPage.softwareEngineeringModules(index).should('be.visible')) {
      assessmentPage.softwareEngineeringModules(index).click()
    } else {
      assessmentPage.softwareEngineeringTab().click()
      assessmentPage.softwareEngineeringModules(index).click()
    }
  }







}

export default assessmentPage

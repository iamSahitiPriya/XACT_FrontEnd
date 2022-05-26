/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

/// <reference types='cypress'/>
class landingPage {



  static xActlogo() {
    return cy.get('#input28')
  }
  static userName() {
    return cy.get('.dropdown-toggle')
  }
  static Search(value) {
    return cy.get('#search')
  }
  static createAssessment() {
    return cy.get('#createAssessment')
  }
  static AssessmentPopup() {
    return cy.get('#mat-dialog-0')
  }
  static AssessmentName() {
   return cy.get('#mat-input-1')
  }
  static OrganisationName() {
    return cy.get('#mat-input-2')
  }
  static Domain() {
    return cy.get('#mat-input-3')
  }
  static Industry() {
    return cy.get('#mat-input-4')
  }
  static teamSizeField() {
    return cy.get('#mat-input-5')
  }
  static email() {
    return cy.get('#userEmails')
  }
  static createAssessmentBtn() {
    return cy.get('.saveButton')
  }
  static AssessmentGrid() {
    return cy.get('tbody')
  }
  static createAssessmentHeader() {
    return cy.get('.heading')
  }
  static logo(){
    return cy.get('#logo')
  }
  static header(){
    return cy.get('.heading')
  }
  static searchBox(){
    return cy.get('app-search > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
  }
  static emailHeader(){
    return cy.get('#mat-dialog-title-1')
  }
  static closeAssessmentPopup(){
    return cy.get('.mat-icon')
  }
  static saveAssessmentButton(){
    return cy.get('.saveButton')
  }

  static assessmentNameInGrid(){
    return cy.get(':nth-child(1) > .cdk-column-assessmentName > span')
  }
  static errorMessages(indValue){
    returncy.get('#mat-error-'+indValue)
  }


  //reusable functions
  static AssessmentpopupFields(AssessmentName,OrgName,Domain,Industry,TeamSize,EmailId){
    landingPage.createAssessment().click()
    cy.wait(2000)
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().type(AssessmentName)
    landingPage.OrganisationName().type(OrgName)
    landingPage.Domain().type(Domain)
    landingPage.Industry().type(Industry)
    landingPage.teamSizeField().type(TeamSize)
    landingPage.email().type(EmailId)
  }

  static landingPageFields(){
    landingPage.logo().should('be.visible')
    landingPage.header().should('be.visible')
    landingPage.searchBox().should('be.visible')
    landingPage.createAssessmentHeader().should('be.visible')
    landingPage.AssessmentGrid().should('be.visible')
    landingPage.userName().should('be.visible')

  }





}

export default landingPage


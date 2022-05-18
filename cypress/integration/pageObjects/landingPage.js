/// <reference types='cypress'/>
class loginPage {



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

  static teamSize() {
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

  static createAssessment() {
    return cy.get('.heading')

  }

  static logo(){
    return cy.get('#logo')
  }

  static header(){
    return cy.get('.heading')
  }

  static searchBox(){
    return cy.get('.ng-tns-c93-0 > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
  }

  static emailHeader(){
    return cy.get('#mat-dialog-title-1')
  }



}

export default loginPage


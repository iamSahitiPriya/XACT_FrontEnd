/// <reference types='cypress'/>
class loginPage {



  xActlogo() {
    const field = cy.get('#logo')
    field.should('be.visible')
    return this
  }

  userName() {
    const field = cy.get('.dropdown-toggle')
    field.should('be.visible').then(   ($el)  =>  {   $el.click}    )
    return this
  }

  Search(value) {
    const field = cy.get('#search')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  createAssessment() {
    const button = cy.get('#createAssessment')
    field.should('be.visible').then(   ($el)  =>  {   $el.click}    )
    return this
  }

  AssessmentPopup() {
    const button = cy.get('#mat-dialog-0')
    field.should('be.visible')
    return this
  }

  AssessmentName() {
    const button = cy.get('#mat-input-1')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  OrganisationName() {
    const button = cy.get('#mat-input-2')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  Domain() {
    const button = cy.get('#mat-input-3')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }uu
  Industry() {
    const button = cy.get('#mat-input-4')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  teamSize() {
    const button = cy.get('#mat-input-5')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  email() {
    const button = cy.get('#userEmails')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    return this
  }

  createAssessment() {
    const button = cy.get('.saveButton')
    field.should('be.visible').then(   ($el)  =>  {   $el.click}    )
    return this
  }

  createAssessment() {
    const button = cy.get('tbody')
    field.should('be.visible')
    return this
  }

  createAssessment() {
    const button = cy.get('.heading')
    field.should('be.visible')
    return this
  }



}

export default loginPage

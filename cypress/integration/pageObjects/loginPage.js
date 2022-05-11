/// <reference types='cypress'/>
class loginPage {

  visit() {
    cy.visit('http://localhost:4200')
  }

  userId(value) {
    const field = cy.get('#input28')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  password(value) {
    const field = cy.get('#input36')
    field.should('be.visible').then(   ($el)  =>  {   $el.clear}    )
    field.type(value)
    return this
  }

  submit() {
    const button = cy.get('.button')
    button.click()
  }
}

export default loginPage

/// <reference types='cypress'/>
class loginPage {



   static userId() {
   return cy.get('#input28')
  }
  static password(){
    return cy.get('#input36')
  }
  static submit(){
    return cy.get('.button')
  }


}

export default loginPage

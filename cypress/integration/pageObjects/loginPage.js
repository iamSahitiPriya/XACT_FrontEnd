/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

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

  //reusable functions
  static xActLogin(userName,passWord){
    cy.clearCookies()
    cy.clearLocalStorage()
    loginPage.userId().type(userName)
    loginPage.password().type(passWord)
    loginPage.submit().click()

    // let element = cy.get(webElementLocation)
    // element.click()
  }

  static xActHomepagetitleValidation(){
    cy.title().should('eq','X-Act | Client maturity assessment tool')
  }
}

export default loginPage

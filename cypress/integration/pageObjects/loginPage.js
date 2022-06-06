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
  static oktaHeader(){
     return cy.get('.okta-sign-in-header > h1')
  }
  static siginTitle(){
    return cy.get('.okta-form-title')
  }
  static userNameheader(){
    return cy.get('.okta-form-title')
  }
  static siginTitle(){
    return cy.get('[data-se="o-form-fieldset-identifier"] > .okta-form-label > label')
  }
  static passwordTitle(){
    return cy.get('[data-se="o-form-fieldset-credentials.passcode"] > .okta-form-label')
  }
  static checkBox(){
     return cy.get('.custom-checkbox > label')
  }
  static forgetPasswordLink(){
     return cy.get('.js-forgot-password')
  }
  static helpLink(){
     return cy.get('.js-help')
  }
  static authContainer(){
     return cy.get('.auth-content')
  }
  static siginContainer(){
    return cy.get('#signin-container')
  }
  static invalidSigninMessage(){
     return cy.get('.okta-form-infobox-error')
  }static emptyuserNameError(){
     return cy.get('#input-container-error57')
  }static emptyPasswordError(){
     return cy.get('p[id^=input-container-error]')
  }
  static userNameDisplay(){
     return cy.get('.dropdown-toggle')
  }
  static logOut(){
     return cy.get('.dropdown-item')
  }
  static rememberMeCheckbox(){
     return cy.get('input[name=rememberMe]')
  }
  static rememberMeCheckboxChecked(){
     return cy.get('.hover')
  }

  //forgot password page
  static oktaHeader(){
     return cy.get('.auth-org-logo')
  }
  static emailId(){
     return cy.get('input[type=text]')
  }
  static nextButton(){
     return cy.get('.button')
  }
  static backToSignIn(){
     return cy.get('.link')
  }
  static emailorUserName(){
     return cy.get('.okta-form-label')
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

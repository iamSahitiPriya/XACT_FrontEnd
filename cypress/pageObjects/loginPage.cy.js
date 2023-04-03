/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

/// <reference types='cypress'/>
class loginPage {

   static userId() {
   return cy.get('input[name=identifier]')
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
     return cy.get(':nth-child(4) > .dropdown-item')
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
  static errorMessage(){
     return cy.get('div[role=alert]')
  }
  static errorDescription(){
    return cy.get('.okta-form-infobox-error > p')
  }
  static emptyFieldError(){
    return cy.get('p[role=alert]')
  }


  //help page
  static helpPageHeader(){
     return cy.get('h1')
  }
  static backToSignInHelp(){
     return cy.get('.header-link')
  }



  //reusable functions
  static xActLogin(){
    cy.clearCookies()
    cy.clearLocalStorage()

    const username ='jathin.meduri@thoughtworks.com'
    const password ='Newspaper@123'
    expect(username, 'username was set').to.be.a('string').and.not.be.empty
    if (typeof password !== 'string' || !password) {
      throw new Error('Missing password value, set using CYPRESS_password=...')
    }
    loginPage.userId().clear().type(username)
    loginPage.password().clear().type(password, {log: false})
    loginPage.submit().click()
  }

  static invalidLogin(userName,passWord){
    loginPage.userId().type(userName)
    loginPage.password().type(passWord, {log: false})
    loginPage.submit().click()
  }

  static xActHomepagetitleValidation(){
    cy.title().should('eq','Thoughtworks X-Act | Client maturity assessment tool')
  }
}

export default loginPage

import loginPage from "./pageObjects/loginPage";
import landingPage from "./pageObjects/landingPage";

describe('validating functionality of login page of xAct application', () => {
  before('User should get navigated to Okta by launching the url', () => {
    cy.visit('/')
  })

  it('tc001 user tries to login  with valid userId and password',()=>{
    loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
    loginPage.xActHomepagetitleValidation()
  })

  it('tc002 validating all fields in the login page',()=>{
    loginPage.authContainer().should('be.visible')
    loginPage.oktaHeader().should('be.visible')
    loginPage.userId().should('be.visible')
    loginPage.password().should('be.visible')
    loginPage.submit().should('be.visible')
    loginPage.checkBox().should('be.visible')
    loginPage.forgetPasswordLink().should('be.visible')
    loginPage.passwordTitle().should('be.visible')
    loginPage.helpLink().should('be.visible')
    loginPage.passwordTitle().should('be.visible')
  })



  it('tc003 user tries to login xAct application with invalid credentials',()=>{
    loginPage.xActLogin('invalid@gmail.com','invalid@12345')
    loginPage.invalidSigninMessage().should('be.visible')
  })

  it('tc004 login xAct application with empty credentials',()=>{
    loginPage.xActLogin('invalid@gmail.com','invalid@12345')
    loginPage.invalidSigninMessage().should('be.visible')
  })

  //it('tc005 loging to ')

})

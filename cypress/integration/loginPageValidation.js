import loginPage from "./pageObjects/loginPage";
import landingPage from "./pageObjects/landingPage";

describe('validating functionality of login page of xAct application', () => {


  it('tc001 validating all fields in the login page',()=>{
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/')
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



  it('tc002 user tries to login xAct application with invalid credentials',()=>{
    loginPage.xActLogin('invalid@gmail.com','invalid@12345')
    loginPage.invalidSigninMessage().should('be.visible')
  })

  it('tc003 login xAct application with empty credentials',()=>{
    loginPage.xActLogin('invalid@gmail.com','invalid@12345')
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.userId().clear()
    loginPage.password().clear()
  })

  it('tc004 login xAct application with empty userId',()=>{
    loginPage.userId().type('invalid@gmail.com')
    loginPage.password().type('   ')
    loginPage.password().clear()
    loginPage.submit().click()
    loginPage.emptyPasswordError().should('be.visible')
    loginPage.userId().clear()
  })

  it('tc005 login xAct application with empty password',()=>{
    loginPage.userId().type('invalid@gmail.com')
    loginPage.password().type('   ')
    loginPage.password().clear()
    loginPage.submit().click()
    loginPage.emptyPasswordError().should('be.visible')
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.userId().clear()
  })

  it('tc006 login xAct application with valid username and invalid password',()=>{
    loginPage.xActLogin('technicalbaba4u@gmail.com','invalidpassword')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })

  it('tc007 login xAct application with invalid username and valid password',()=>{
    loginPage.xActLogin('invalidemail@gmail.com','Sam@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })

  it('tc008 login xAct application with valid username and valid password in uppercase',()=>{
    loginPage.xActLogin('invalidemail@gmail.com','Sam@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })


  it('tc004 login xAct application with invalid username and valid password',()=>{
    loginPage.xActLogin('invalidemail@gmail.com','Sam@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })



  it('tc00 user tries to login  with valid userId and password',()=>{
    cy.visit('/')
    loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
    loginPage.xActHomepagetitleValidation()
    loginPage.userNameDisplay().click()
    loginPage.logOut().click()
    cy.title().should('eq','Thoughtworks - Sign In')
  })


})

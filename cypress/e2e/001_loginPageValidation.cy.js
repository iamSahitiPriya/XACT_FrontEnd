import loginPage from "../pageObjects/loginPage.cy";

describe('validating functionality of login page of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

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
    loginPage.invalidLogin('invalid@gmail.com','invalid@12345')
    loginPage.invalidSigninMessage().should('be.visible')
  })

  it('tc003 login xAct application with empty credentials',()=>{
    loginPage.invalidLogin('invalid@gmail.com','invalid@12345')
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
    loginPage.invalidLogin('technicalbaba4u@gmail.com','invalidpassword')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })

  it('tc007 login xAct application with invalid username and valid password',()=>{
    loginPage.invalidLogin('invalidemail@gmail.com','invalid@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })

  it('tc008 login xAct application with valid username and valid password in uppercase',()=>{
    loginPage.invalidLogin('invalidemail@gmail.com','invalid@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })


  it('tc009 login xAct application with invalid username and valid password',()=>{
    loginPage.invalidLogin('invalidemail@gmail.com','invalid@12345')
    loginPage.submit().click()
    loginPage.invalidSigninMessage().should('be.visible')
    loginPage.invalidSigninMessage().should('have.text','Unable to sign in')
  })

  it('tc010 validating whether keep me signed in can be checked successfully',()=>{
    loginPage.checkBox().click()
    loginPage.rememberMeCheckboxChecked().should('be.visible')
  })

  it('tc011 validating forgot password page',()=>{
    loginPage.forgetPasswordLink().click()
    loginPage.authContainer().should('be.visible')
    loginPage.oktaHeader().should('be.visible')
    loginPage.userNameheader().should('be.visible')
    loginPage.userNameheader().should('have.text','Reset your password')
    loginPage.emailorUserName().should('be.visible')
    loginPage.emailId().should('be.visible')
    loginPage.nextButton().should('be.visible')
    loginPage.backToSignIn().should('be.visible')
    loginPage.backToSignIn().click()
    loginPage.userId().should('be.visible')
  })

  it('tc012 clicking on help link',()=>{
    loginPage.helpLink().should('be.visible')
    loginPage.helpLink().click()
    loginPage.helpPageHeader().should('be.visible')
    loginPage.helpPageHeader().should('have.text','Sign-In Help')
    loginPage.helpPageHeader().click()
  })

  it('tc013 clicking on next button with empty email id and validating the error messages',()=>{
    loginPage.forgetPasswordLink().should('be.visible')
    loginPage.forgetPasswordLink().click()
    cy.wait(1000)
    loginPage.emailId().should('be.visible')
    loginPage.authContainer().should('be.visible')
    loginPage.oktaHeader().should('be.visible')
    loginPage.nextButton().click()
    //commonFunctions.elementIsDisplayed(loginPage.userNameheader())
    loginPage.errorMessage().should('be.visible')
    loginPage.errorDescription().should('be.visible')
    loginPage.errorDescription().should('have.text','We found some errors. Please review the form and make corrections.')
    loginPage.emptyFieldError().should('be.visible')
    loginPage.emptyFieldError().should('have.text','This field cannot be left blank')

  })


  it('tc00 user tries to login  with valid userId and password',()=>{
    cy.visit('/')
    loginPage.xActLogin()
    loginPage.xActHomepagetitleValidation()
    //loginPage.userNameDisplay().click()
    //loginPage.logOut().click()
    // cy.title().should('eq','Thoughtworks - Sign In')
  })






})

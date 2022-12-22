import manageModules from "../pageObjects/manageModules.cy";

describe('validating functionality of Restarting an assessment of xAct application', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 User should be able to restart a closed assessment', () => {
    manageModules.selectModule('Software Engineering')


  })


})

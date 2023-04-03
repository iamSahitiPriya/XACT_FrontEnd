
import landingPage from "../pageObjects/landingPage.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";
import assessmentPage from "../pageObjects/assessmentPage.cy";

describe('Validation of Organisation name and ', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET', 'https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 suggestions should be displayed when user provides two characters in the organisation name field', () => {


  })





})


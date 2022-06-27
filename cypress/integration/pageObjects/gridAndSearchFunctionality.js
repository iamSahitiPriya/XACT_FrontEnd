import loginPage from "./loginPage";
import landingPage from "./landingPage";
import commonFunctions from "../../support/commonFunctions";


describe('validating creating Assessment assessment popup functionality', () => {
  before('User should get navigated to Okta by launching the url', () => {
    //cy.visit(appUrl)
    cy.visit('/')
    // let url=Cypress.config().baseUrl;
    // baseUrlcy.visit(url)
    loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
  })


  it('tc001 Validating contents of table and header',()=>{
    landingPage.AssessmentGrid().should('be.visible')
    landingPage.header().should('be.visible')
    landingPage.headerRow().should('be.visible')
    landingPage.assessmentColumnHeader().should('be.visible')
    landingPage.organisationColumnHeader().should('be.visible')
    landingPage.statusHeader().should('be.visible')
    landingPage.lastUpdatedHeader().should('be.visible')
  })

  it('tc002 Latest Assessment should be on top of the table for all pagenation options available',()=>{
    //pagenation value 5
    landingPage.AssessmentpopupFields('latestAssessment','latestOrg','Domain','Industry','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid('have.text','latestAssessment')
    //pagenation value 10
    landingPage.pagenationDropdown().click()
    landingPage.pagenation10().click()
    landingPage.assessmentGridRowCount('10')
    landingPage.assessmentNameInGrid('have.text','latestAssessment')
    landingPage.pagenationDropdown().click()
    landingPage.pagenation25().click()
    landingPage.assessmentGridRowCount('25')
    landingPage.assessmentNameInGrid('have.text','latestAssessment')
    landingPage.pagenation100().click()
    landingPage.assessmentGridRowCount('100')
    landingPage.assessmentNameInGrid('have.text','latestAssessment')
  })

  it('tc003 searching an existing assessment with assessment name in both upper and lower cases',()=>{
    landingPage.searchBox().type('LatestAssessment')
    landingPage.searchAssessmentGrid(' LatestAssessment ',' LatestOrg')
    landingPage.searchBox().clear()
    //landingPage.assessmentNameInGrid().should('have.text',' TestAssessment1 ')
  })
  it('tc004 searching an existing assessment with organisation name both upper and lower cases',()=>{

  })
  it('tc005 searching an assessment which is in other page',()=>{
    landingPage.searchBox().type('testassessment1')
    landingPage.assessmentNameInGrid().should('have.text',' TestAssessment1 ')
  })
  it('tc006 searching a non existing assessment',()=>{
    landingPage.searchBox().type('!!!!!')
    landingPage.noDataMessage().should('be.visible')
    landingPage.noDataMessage().should('have.text','No data matching the filter')

  })
  it('tc007 searching an assessment with domain or industry or team size',()=>{

  })
  it('tc008 searching an assessment with numbers and special characters',()=>{

  })
  it('tc009 validating the page numbers beside pagenation',()=>{

  })
  it('tc009 validating search icon is displayed in the search box',()=>{

  })
  it('tc010 Complete data is displayed when search box is cleared',()=>{

  })





})

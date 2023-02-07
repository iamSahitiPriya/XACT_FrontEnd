
import landingPage from "../pageObjects/landingPage.cy";
import commonFunctions from '../pageObjects/commonFunction.cy'


describe('validating creating Assessment grid and search functionality', () => {
  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
    cy.wait(500)
  })

  // it('tc001 user tries to login  with valid userId and password',()=>{
  //   loginPage.xActLogin()
  //   loginPage.xActHomepagetitleValidation()
  // })

  it('tc001 Validating contents of table and header',()=>{
    landingPage.AssessmentGrid().should('be.visible')
    landingPage.header().should('be.visible')
    landingPage.headerRow().should('be.visible')
    landingPage.assessmentColumnHeader().should('be.visible')
    landingPage.organisationColumnHeader().should('be.visible')
    landingPage.statusHeader().should('be.visible')
    landingPage.lastUpdatedHeader().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(3),'Just exploring t option is clicked')
    landingPage.AssessmentpopupFields('latestassessment','Infinity International','Description of the assessment','Domain','22','test@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
  })

  it('tc002 Latest Assessment should be on top of the table for all pagenation options available',()=>{
    //pagenation value 5
    landingPage.assessmentNameInGrid(1).should('have.text',' latestassessment ')
    //pagenation value 10
    // landingPage.header().click()
    // landingPage.pagenationDropdown().click()
    // landingPage.pagenation10().click()
    // landingPage.assessmentGridRowCount('10')
    // landingPage.assessmentNameInGrid(1).should('have.text',' latestassessment ')
    // landingPage.header().click()
    // landingPage.pagenationDropdown().click()
    // landingPage.pagenation25().click()
    // landingPage.assessmentGridRowCount('25')
    // landingPage.assessmentNameInGrid(1).should('have.text',' latestassessment ')
    // landingPage.header().click()
    // landingPage.pagenationDropdown().click()
    // landingPage.pagenation100().click()
    // landingPage.assessmentGridRowCount('100')
    // landingPage.assessmentNameInGrid(1).should('have.text',' latestassessment ')

  })

  it('tc003 searching an existing assessment with assessment name in both upper and lower cases',()=>{
    cy.reload()
    landingPage.searchBox().clear()
    landingPage.searchBox().type('Hi Hello')
    landingPage.searchAssessmentGrid(' Hi Hello ',' how are you ')
    //landingPage.assessmentNameInGrid(1).should('have.text',' hi hello ')
  })
  it('tc004 searching an existing assessment with organisation name both upper and lower cases',()=>{

  })
  it('tc005 searching an assessment which is in other page',()=>{
    landingPage.header().click()
    landingPage.searchBox().click()
    landingPage.searchBox().clear()
    landingPage.searchBox().type('Hi Hello')
    // landingPage.assessmentNameInGrid(1).should('have.text',' hi hello ')
  })
  it('tc006 searching a non existing assessment',()=>{
    landingPage.searchBox().type('!!!!!')
    landingPage.noDataMessage().should('be.visible')
    landingPage.noDataMessage().should('have.text','No Assessments Found.')
  })
  it('tc007 searching an assessment with domain or industry or team size',()=>{
    landingPage.searchBox().clear()
    landingPage.searchBox().type('Domain')
    landingPage.noDataMessage().should('be.visible')
    landingPage.noDataMessage().should('have.text','No Assessments Found.')
    landingPage.searchBox().clear()
    landingPage.searchBox().type('industry')
    landingPage.noDataMessage().should('be.visible')
    landingPage.noDataMessage().should('have.text','No Assessments Found.')

  })
  it('tc008 searching an assessment with numbers and special characters',()=>{
    landingPage.searchAssessment('!!!!!!')
    landingPage.noDataMessage().should('be.visible')
    landingPage.noDataMessage().should('have.text','No Assessments Found.')
    landingPage.searchAssessment('123456789')
    //landingPage.assessmentNameInGrid(1).should('have.text',' 123456789 ')
  })
  it('tc009 validating the page numbers beside pagenation',()=>{

  })
  it('tc0010 validating search icon is displayed in the search box',()=>{
    landingPage.SearchIcon().should('be.visible')
    landingPage.searchPlaceholder().should('be.visible').should('have.text','Search')
  })
  it('tc011 Complete data is displayed when search box is cleared',()=>{

    landingPage.assessmentNameInGrid(1).then(function(Assessment1) {
      const assessName1=Assessment1.text()

      landingPage.assessmentNameInGrid(2).then(function(Assessment2) {
        const assessName2=Assessment2.text()

        landingPage.assessmentNameInGrid(3).then(function(Assessment3) {
          const assessName3=Assessment3.text()

          landingPage.assessmentNameInGrid(4).then(function(Assessment4) {
            const assessName4=Assessment4.text()

            landingPage.assessmentNameInGrid(5).then(function(Assessment5) {
              const assessName5=Assessment5.text()

              landingPage.searchAssessment('123456789')
              landingPage.searchBox().clear()
              landingPage.assessmentGridRowCount('5')
              landingPage.assessmentNameInGrid(1).should('have.text',assessName1)
              landingPage.assessmentNameInGrid(2).should('have.text',assessName2)
              landingPage.assessmentNameInGrid(3).should('have.text',assessName3)
              landingPage.assessmentNameInGrid(4).should('have.text',assessName4)
              landingPage.assessmentNameInGrid(5).should('have.text',assessName5)
              if(landingPage.assessmentGridRowCount('5') && landingPage.assessmentNameInGrid(1).should('have.text',assessName1) &&
                landingPage.assessmentNameInGrid(2).should('have.text',assessName2) && landingPage.assessmentNameInGrid(3).should('have.text',assessName3)
                && landingPage.assessmentNameInGrid(4).should('have.text',assessName4) && landingPage.assessmentNameInGrid(5).should('have.text',assessName5)){
                assert.isOk('tc012','Complete data in assessment grid is displayed when search box is cleared')
              }

            })
          })
        })
      })
    })
  })

  it('tc012')





})



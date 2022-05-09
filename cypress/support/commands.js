
import selectors from '/Users/jathin.medurithoughtworks.com/Desktop/XAct_Frontend_App/cypress/fixtures/Locators/LandingPage_locators.json';

  before(() => {
    cy.fixture('Locators//LandingPage_locators.json').then(function(locator){
    this.locator=locator
    })
    cy.visit('http://localhost:4200')
  })


  Cypress.Commands.add('login',(userName, passWord)=> {
    cy.get('#input28').type(userName)
    cy.get('#input36').type(passWord)
    cy.get('.button').click()
    cy.wait(3000);
    expect(cy.get('#logo')).to.exist;
    cy.title().should('eq','X-Act | Client maturity assessment tool')
  })

  Cypress.Commands.add('landingPageVerification',()=> {
})

  Cypress.Commands.add('createAssessment',(AssessmentName,OrgName,Domain,Industry,TeamSize,EmailId)=> {
    cy.get('#createAssessment').click()
    cy.get('#mat-dialog-0').should('be.visible')
    cy.wait(3000);
    cy.get('#mat-input-1').type(AssessmentName)
    cy.get('#mat-input-2').type(OrgName)
    cy.get('#mat-input-3').type(Domain)
    cy.get('#mat-input-4').type(Industry)
    cy.get('#mat-input-5').type(TeamSize)
    cy.get('#userEmails').type(EmailId)
    cy.get('.saveButton').click()

    //validating the new assessment added
    cy.get('tbody > :nth-child(1) > .cdk-column-assessmentName').invoke('text').then((actualText) => {
      actualText.replace(' ','').trim()
      expect(actualText).to.eq(AssessmentName)

    })


  })












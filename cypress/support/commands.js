
import selectors from '/Users/jathin.medurithoughtworks.com/Desktop/XAct_Frontend_App/cypress/fixtures/Locators/LandingPage_locators.json';
import loginPage from "../integration/pageObjects/loginPage";
  before(() => {
    const lp=new loginPage()
    lp.visit()
  })


  Cypress.Commands.add('login',(userName, passWord)=> {
    const lp=new loginPage()
    lp.userId('technicalbaba4u@gmail.com')
    lp.password('Sam@12345')
    lp.submit()
    cy.wait(3000)
    cy.title().should('eq','X-Act | Client maturity assessment tool')
    // cy.get('#input28').type(userName)
    // cy.get('#input36').type(passWord)
    // cy.get('.button').click()
    // cy.wait(3000);
    // expect(cy.get('#logo')).to.exist;
    // cy.title().should('eq','X-Act | Client maturity assessment tool')
  })

  Cypress.Commands.add('landingPageValidation',()=> {
    cy.get('#logo').should('be.visible')
    cy.get('.ng-tns-c92-0 > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').should('be.visible')
    cy.get('.heading').should('be.visible')
    cy.get('.ng-tns-c92-0 > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').should('be.visible')
    cy.get('#createAssessment').should('be.visible')
    cy.get('.mat-table').should('be.visible')
    cy.get('.dropdown-toggle').should('be.visible')
  })

  Cypress.Commands.add('createAssessment',(AssessmentName,OrgName,Domain,Industry,TeamSize,EmailId)=> {
    cy.get('#createAssessment').click()
    cy.get('#mat-dialog-0').should('be.visible')
    cy.wait(1000);
    cy.get('#mat-input-1').type(AssessmentName)
    cy.get('#mat-input-2').type(OrgName)
    cy.get('#mat-input-3').type(Domain)
    cy.get('#mat-input-4').type(Industry)
    cy.get('#mat-input-5').type(TeamSize)
    cy.get('#userEmails').type(EmailId)
    cy.get('.saveButton').click()
    cy.wait(1000);
    //validating the new assessment added

    cy.get(':nth-child(1) > .cdk-column-assessmentName > .ng-tns-c92-0').should('have.text',AssessmentName)
    // cy.get(':nth-child(1) > .cdk-column-assessmentName > .ng-tns-c92-0').invoke('text').then((actualText) => {
    //   actualText.replace(' ','').trim()
    //   expect(actualText).to.eq(AssessmentName)
    //
    // })


  })












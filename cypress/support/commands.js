
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import selectors from '/Users/jathin.medurithoughtworks.com/Desktop/XAct_Frontend_App/cypress/fixtures/Locators/LandingPage_locators.json';


import loginPage from "../integration/pageObjects/loginPage"
import landingPage from "../integration/pageObjects/landingPage";

  Cypress.Commands.add('launchxAct',(userName, passWord)=> {
    cy.visit(Cypress.env('url'))
  })


  Cypress.Commands.add('loginWith',(userName, passWord)=> {
    cy.clearCookies()
    cy.clearLocalStorage()
    loginPage.userId().type(userName)
    loginPage.password().type(passWord)
    loginPage.submit().click()
  })


  Cypress.Commands.add('landingPageTitleValidation',()=> {
    cy.title().should('eq','X-Act | Client maturity assessment tool')
  })

  Cypress.Commands.add('landingPageValidation',()=> {
    landingPage.logo().should('be.visible')
    landingPage.header().should('be.visible')
    landingPage.searchBox().should('be.visible')
    landingPage.createAssessment.should('be.visible')
    landingPage.AssessmentGrid().should('be.visible')
    landingPage.userName.should('be.visible')
  })

  Cypress.Commands.add('createAssessment',(AssessmentName,OrgName,Domain,Industry,TeamSize,EmailId)=> {
    landingPage.createAssessment().click()
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().type(AssessmentName)
    landingPage.OrganisationName().type(OrgName)
    landingPage.Domain().type(Domain)
    landingPage.Industry().type(Industry)
    landingPage.teamSize().type(TeamSize)
    landingPage.email().type(EmailId)
    // landingPage.createAssessmentBtn().click()
    // cy.get(':nth-child(1) > .cdk-column-assessmentName > .ng-tns-c92-0').should('have.text',AssessmentName)
  })














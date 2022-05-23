/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

//import  loginPage from './pageObjects/loginPage'


describe('Validating create assessment feature', () => {

  before(() => {
  cy.visit(Cypress.env('url'))
  cy.login(Cypress.env('userName'),Cypress.env('password'))
  })


  it('Creating an assessment', () => {
  cy.createAssessment('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
  })


})

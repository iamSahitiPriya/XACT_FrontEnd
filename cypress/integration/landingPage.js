/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

describe('landingpage', () => {


  before(() => {
    cy.fixture('users/admin.json')
  })


  it('LandingPage', () => {

  cy.visit('http://localhost:4200')
  cy.get('#input28').type("technicalbaba4u@gmail.com")
  cy.get('#input36').type("Sam@12345")
  cy.get('').click()

  })
})

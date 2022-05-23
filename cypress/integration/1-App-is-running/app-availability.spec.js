/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {appUrl, email, pwd} from '../../constants';
// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress


describe('Validate app is up & running', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit(appUrl)
  })

  it('Should get redirected to Okta', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    //cy.url().contains( oktaUrl)
    cy.get('#input28').type(email);
    cy.get('#input36').type(pwd);
    cy.get('.button').click();
    cy.wait(2000);
    expect(cy.get('#logo')).to.exist;
     cy.get('#username').contains('Dummy User');
  })


})

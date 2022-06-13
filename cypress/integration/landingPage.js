/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {appUrl, email, pwd} from "../constants";

describe('landingpage', () => {


  before(() => {
    cy.fixture('users/admin.json')
  })


  it('LandingPage', () => {

    cy.visit(appUrl)
    cy.get('#input28').type(email)
    cy.get('#input36').type(pwd)
    cy.get('').click()

  })
})

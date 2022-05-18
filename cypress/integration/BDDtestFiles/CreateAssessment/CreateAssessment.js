  import { Given,When, Then,And } from "cypress-cucumber-preprocessor/steps";
  import  loginPage from './pageObjects/loginPage'
  import loginPage from "../integration/pageObjects/loginPage"
  import landingPage from "../../pageObjects/landingPage";

  Given('User launches the xAct application by providing valid url',function (){
    cy.launchxAct()
    //loginPage.visit()
  })

  And('User should provides valid UserId and password and click on Sigin button',function (){
    cy.login(Cypress.env('userName'),Cypress.env('password'))
  })

  Then('User should be navigated to home page of xAct',function (){
    cy.landingPageValidation()
  })

  Given('User clicks on create assessment popup and the popup appears',function (){
    landingPage.createAssessment().click()
    landingPage.AssessmentPopup().should('be.visible')
  })

  And('Add New User sub header should be present above the Email Id field',function (){
    landingPage.emailHeader().should('be.visible')
  })












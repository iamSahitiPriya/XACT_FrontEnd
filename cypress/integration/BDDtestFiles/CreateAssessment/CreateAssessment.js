  import { Given,When, Then,And } from "cypress-cucumber-preprocessor/steps";
  import  loginPage from './pageObjects/loginPage'
  import loginPage from "../integration/pageObjects/loginPage"
  import landingPage from "../../pageObjects/landingPage";

  Given('User launches the xAct application by providing valid url',function (){
    cy.launchxAct()
    //loginPage.visit()
  })

  And('User should provides valid UserId and password and click on Sigin button',function (){
    cy.loginWith(Cypress.env('userName'),Cypress.env('password'))
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

  And('Save and closebutton should be present in the bottom of the popup',function (){
    landingPage.saveAssessmentButton().should('be.visible')
    expect(landingPage.closeAssessmentPopup()).to.exist;
    landingPage.closeAssessmentPopup().should('be.visible')
  })

  Given('Create assessment popup is displayed',function (){
    landingPage.createAssessment().click()
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentPopup().should('not.be.visible')
  })

  And('provide valid AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId and click on close button',function (){
    cy.createAssessment('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')

  })

  Then('Popup should be closed and assessment should not be created',function (){
    landingPage.closeAssessmentPopup().click()
    //need to add validation here
  })

  And('user provides valid AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId and click on save button',(AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId),function (){
    cy.createAssessment(AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId)
    landingPage.saveAssessmentButton().click()
  })

  Then('New assessment is created and displayed My Assessments table with active status',function (){
    //add validation

  })















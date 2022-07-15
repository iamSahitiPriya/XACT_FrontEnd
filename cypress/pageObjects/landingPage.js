/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

/// <reference types='cypress'/>
import exp from "constants";

class landingPage {

  static xActlogo() {
    return cy.get('#input28')
  }
  static userName() {
    return cy.get('.dropdown-toggle')
  }
  static Search(value) {
    return cy.get('#search')
  }
  static SearchIcon(value) {
    return cy.get('.search')
  }
  static searchPlaceholder(){
    return cy.get('.text')
  }
  static createAssessment() {
    return cy.get('#createAssessment',{ timeout: 10000 })
  }
  static AssessmentPopup() {
    return cy.get('mat-dialog-container',{ timeout: 10000 })
  }

  static AssessmentNamePlaceholder(){
    return cy.get('#mat-input-1')
  }
  static AssessmentName() {
   return cy.get('.assessmentName',{ timeout: 10000 })
  }
  static OrganisationName() {
    return cy.get('.organizationName')
  }
  static Domain() {
    return cy.get('.domain')
  }
  static Industry() {
    return cy.get('.industry')
  }
  static teamSizeField() {
    return cy.get('.teamSize')
  }

  static pagenationDropdown(){
    //return cy.get('.mat-paginator-page-size > .mat-form-field > .mat-form-field-wrapper')
    return cy.get('.mat-paginator-page-size > .mat-form-field')
  }
  static pagenation10(){
    return cy.get('#mat-option-1 > .mat-option-text')
  }

  static pagenation25(){
    return cy.get('#mat-option-2 > .mat-option-text')
  }
  static pagenation100(){
    return cy.get('#mat-option-3 > .mat-option-text')
  }
  static pagenation5(){
    return cy.get('#mat-option-0 > .mat-option-text')
  }

  static teamSize(){
    return cy.get('.teamSize > .mat-form-field-wrapper > .mat-form-field-flex')
  }
  static email() {
    return cy.get('#userEmails')
  }
  static createAssessmentSaveBtn() {
    return cy.get('.saveButton')
  }
  static AssessmentGrid() {
    return cy.get('.mat-table')
  }
  static AssessmentNameColumn(){
    return cy.get('tbody>tr td:nth-child(1)')
  }
  static OrganizationNameColumn(){
    return cy.get('tbody>tr td:nth-child(2)')
  }
  static createAssessmentHeader() {
    return cy.get('.heading')
  }
  static logo(){
    return cy.get('#logo')
  }
  static header(){
    return cy.get('.heading')
  }
  static headerRow(){
    return cy.get('.mat-header-row')
  }
  static assessmentColumnHeader(){
    return cy.get('.mat-header-row > .cdk-column-assessmentName')
  }static organisationColumnHeader(){
    return cy.get('.mat-header-row > .cdk-column-organisationName')
  }static statusHeader(){
    return cy.get('.mat-header-row > .cdk-column-assessmentStatus')
  }static lastUpdatedHeader(){
    return cy.get('.mat-header-row > .cdk-column-updatedAt')
  }
  static searchBox(){
    return cy.get('#search')
  }
  static emailHeader(){
    return cy.get('#mat-dialog-title-0')
  }
  static closeAssessmentPopup(){
    return cy.get('button[id=close]')
  }
  static saveAssessmentButton(){
    return cy.get('.saveButton')
  }

  static assessmentNameInGrid(index){
    return cy.get(':nth-child('+index+') > .cdk-column-assessmentName > span')
  }
  static assessmentNameError(){
    return cy.get('.assessmentName > .mat-form-field-wrapper > .mat-form-field-subscript-wrapper')
  }static organisationNameError(){
    return cy.get('.organizationName > .mat-form-field-wrapper > .mat-form-field-subscript-wrapper')
  }static domainFieldError(){
    return cy.get('.domain > .mat-form-field-wrapper > .mat-form-field-subscript-wrapper')
  }static industryFieldError(){
    return cy.get('.industry > .mat-form-field-wrapper > .mat-form-field-subscript-wrapper')
  }static teamSizeFieldError(){
    return cy.get('.teamSize > .mat-form-field-wrapper > .mat-form-field-subscript-wrapper')
  }
  static serverError(){
    return cy.get('.mat-snack-bar-container')
  }
  static noDataMessage(){
    return cy.get('.mat-cell')
  }
  static emailError(){
    return cy.get('mat-error')
  }
  static emailChip(){
    return cy.get('.mat-chip')
  }

  //placeholders
  static AssessmentPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Assessment Name\']')
  }
  static organisationPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Organisation Name\']')
  }
  static domainPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Domain of Target Assessment\']')
  }
  static industryPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Industry of Organisation\']')
  }
  static emailPlaceHolder(){
    return cy.get('input[placeholder=\'abc@thoughtworks.com\']')
  }


  //reusable functions
  static AssessmentpopupFields(AssessmentName,OrgName,Domain,Industry,TeamSize,EmailId){
    expect(landingPage.AssessmentPopup()).to.exist;
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().should('be.visible')
    expect(landingPage.AssessmentName()).to.exist;
    cy.wait(1000)
    landingPage.AssessmentName().type(AssessmentName)
    landingPage.OrganisationName().should('be.visible')
    landingPage.OrganisationName().type(OrgName)
    landingPage.Domain().should('be.visible')
    landingPage.Domain().type(Domain)
    landingPage.Industry().should('be.visible')
    landingPage.Industry().type(Industry)
    landingPage.teamSizeField().should('be.visible')
    landingPage.teamSizeField().type(TeamSize)
    landingPage.email().type(EmailId)
  }

  static landingPageFields(){
    landingPage.logo().should('be.visible')
    landingPage.header().should('be.visible')
    landingPage.searchBox().should('be.visible')
    landingPage.createAssessmentHeader().should('be.visible')
    landingPage.AssessmentGrid().should('be.visible')
    landingPage.userName().should('be.visible')

  }

  static assessmentPopupErrorValidation(errorMessage,teamSizeFieldErrorMessage){
    landingPage.assessmentNameError().should('have.text',errorMessage)
    landingPage.organisationNameError().should('have.text',errorMessage)
    landingPage.domainFieldError().should('have.text',errorMessage)
    landingPage.industryFieldError().should('have.text',errorMessage)
    landingPage.teamSizeFieldError().should('have.text',teamSizeFieldErrorMessage)
  }


  static assessmentGridRowCount(rowCount){
    //landingPage.AssessmentNameColumn()
    cy.get('tbody')
      .find('tr')
      .then((row) => {
        //row.length will give you the row count
        const count=row.length.toString()
        cy.log(count)
      expect(count).to.equal(rowCount)
      });
  }

  static searchAssessmentGrid(AssessmentName,OrganizationName) {

    landingPage.AssessmentNameColumn().each(($assessName,index,$rowCont)=>{
      const text = $assessName.text()

      if(text.includes(AssessmentName)){
        landingPage.OrganizationNameColumn().eq(index).then(function (oName) {
          const orgName = oName.text()
          expect(orgName).to.equal(OrganizationName)
        })

      }
    })
  }
  static clickCreateAssessmentButton(){
    if(landingPage.createAssessment().should('be.visible')) {
      landingPage.createAssessment().click({force:true})
    }
    else{
      assert.isNotOk('createassessment button is not visible')
    }
  }

  static displayeOfElement(element,passMessage,failureMessage){
    cy.get("body").then($body => {
      if ($body.find(element).length > 0) {
        //evaluates as true
        return element
        assert.isOk('everything',passMessage);
      }else{
        assert.fail(true,failureMessage);

      }
    });
  }

  static clickCreateAssessment(){
    cy.wait(500)
    cy.get('#createAssessment', { timeout: 10000 }).should('be.visible');
    //landingPage.createAssessment().click({force:true});
    landingPage.createAssessment().trigger("click")
  }

  static searchAssessment(value){
    landingPage.searchBox().click()
    landingPage.searchBox().clear()
    landingPage.searchBox().type(value)
  }

}

export default landingPage


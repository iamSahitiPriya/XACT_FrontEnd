/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

/// <reference types='cypress'/>
import exp from "constants";
import commonFunction from "./commonFunction.cy";
import commonFunctions from "./commonFunction.cy";

class landingPage {

  static xActlogo() {
    return cy.get('#logo')
  }
  static userName() {
    return cy.get('.dropdown-toggle')
  }
  static noAssessmentFoundRow() {
      return cy.get('.mat-cell')
    }

  static adminPortalLink() {
    return cy.get('.mat-list-icon > .li-text')
  }
  static assessmentOption(rowCount){
    return cy.get('tr:nth-child('+rowCount+')>td:nth-child(5)>div>app-assessment-menu>div>div>button')
  }
  static configureOption(){
    return cy.get('#open-assessment')
  }

  static menu() {
    return cy.get('[role=menuitem]')
  }
  static menuFrame() {
      return cy.get('.mat-menu-content')
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
  static configurePopUpHeader(){
    return cy.get('.mat-dialog-title.ng-star-inserted')
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

  static  purposeOfAssessment(){
    return cy.get(':nth-child(3) > .mat-form-field-type-mat-select > .mat-form-field-wrapper')
  }

  static  purposeOfAssessment1(){
    return cy.get('.assessment-purpose > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
  }

  static  pageNationDropDown(){
    return cy.get('.mat-paginator-page-size-label')
  }

  static  purposeOfAssessment2(){
    return cy.get('.assessment-purpose > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
  }
  static  purposeOfAssessmentOption(index){
    return cy.get('mat-option:nth-child('+index+')')
  }

  static AssessmentName() {

    return cy.get('[formcontrolname=assessmentNameValidator]')
  }
  static OrganisationName() {
    return cy.get('.organisation-name > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
  }
  static description() {
    return cy.get('.assessment-description')
  }

  static Domain() {
    return cy.get('[formcontrolname=domainNameValidator]')

  }
  static Industry() {
    return cy.get('.industry')
  }
  static teamSizeField() {
    return cy.get('input[placeholder=\'Enter Team size\']')
  }

  static pagenationDropdown(){

    return cy.get('.mat-paginator-page-size > .mat-form-field')
  }
  static optionsMenu(index){
    return cy.get(':nth-child('+index+')> .cdk-column-link > .menuButton1 > app-assessment-menu > div.ng-star-inserted')
  }

  static manageModulesOption(){
    return cy.get('.mat-menu-content > .mat-focus-indicator.mat-tooltip-trigger > span')
  }
  static deleteAssessmentOption(){
      return cy.get('#deleteAssessment')
    }
  static yesButton(){
        return cy.get('mat-dialog-actions>button')
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
    return cy.get('.team-size > .mat-form-field-wrapper > .mat-form-field-flex')
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
    return cy.get('#close')
  }
  static saveAssessmentButton(){
    return cy.get('.saveButton')
  }

  static optionsButton(){
    return cy.get(':nth-child(1) >td:nth-child(5) > div >app-assessment-menu> div > div>button>span>mat-icon')
  }

  static menuOptions(index) {//index=1,2,3,4
    return cy.get('[role=menuitem]:nth-child('+index+')>span')
  }

  static purposeOfAssessment(){
    return cy.get('.mat-select-placeholder')
  }

  static purposeOfAssessmentOptions(index){
    return cy.get('mat-option:nth-child('+index+')')
  }

  static assessmentNameInGrid(index){
    return cy.get(':nth-child('+index+') > .cdk-column-assessmentName > span')
  }
  static orgNameInGrid(index){
      return cy.get(':nth-child('+index+') > .cdk-column-organisationName > span')
    }

  static assessmentStatusInGrid(index){
    return cy.get(':nth-child('+index+') > .cdk-column-assessmentStatus > span')
  }
  static assessmentNameError(){
    return cy.get('.assessment-name > .mat-form-field > .mat-form-field-wrapper>div:nth-child(2)')
  }static organisationNameError(){
    return cy.get('.organisation-name > .mat-form-field > .mat-form-field-wrapper>div:nth-child(2)')
  }static domainFieldError(){
    return cy.get('.domain > .mat-form-field > .mat-form-field-wrapper>div:nth-child(2)')
  }static industryFieldError(){
    return cy.get('.assessment-industry > .mat-form-field > .mat-form-field-wrapper>div:nth-child(2)')
  }static teamSizeFieldError(){
    return cy.get('.team-size > .mat-form-field > .mat-form-field-wrapper>div:nth-child(2)')
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

  static OrganisationSuggestion() {
    return cy.get('.mat-option-text')
  }
  //placeholders
  static AssessmentPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Assessment Name\']')
  }
  static organisationPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Organisation Name\']')
  }
  static domainPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Domain of Target\']')
  }
  static industryPlaceHolder(){
    return cy.get('input[placeholder=\'Enter Industry of Organisation\']')
  }
  static emailPlaceHolder(){
    return cy.get('input[placeholder=\'abc@thoughtworks.com\']')
  }
  static tableColumns(row,column){
    return cy.get('tr:nth-child('+row+')>td:nth-child('+column+')')
  }
 static statusColumn(row){
    return cy.get(':nth-child('+row+') > .cdk-column-assessmentStatus > span')
  }


  //reusable functions
  static AssessmentpopupFields(AssessmentName,OrgName,Desc,Domain,TeamSize,EmailId){
    expect(landingPage.AssessmentPopup()).to.exist;
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().should('be.visible')
    expect(landingPage.AssessmentName()).to.exist;
    cy.wait(1000)
    landingPage.AssessmentName().clear().type(AssessmentName)
    landingPage.OrganisationName().should('be.visible').clear().type(OrgName)
    landingPage.OrganisationSuggestion().click({ force: true })
    commonFunction.clickElement(landingPage.description(),'clicking on description edit box')
    landingPage.description().should('be.visible').clear().type(Desc)
    landingPage.Domain().should('be.visible')
    landingPage.Domain().clear().type(Domain)
    landingPage.teamSizeField().should('be.visible')
    landingPage.teamSizeField().clear().type(TeamSize)
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
    landingPage.domainFieldError().should('have.text',errorMessage)
    landingPage.industryFieldError().should('have.text',errorMessage)
    landingPage.teamSizeFieldError().should('have.text',teamSizeFieldErrorMessage)
  }


  static assessmentGridRowCount(rowCount){

    cy.get('tbody')
      .find('tr')
      .then((row) => {
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

    landingPage.createAssessment().trigger("click")
  }

  static searchAssessment(value){
    landingPage.searchBox().click({ force: true })
    landingPage.searchBox().clear()
    landingPage.searchBox().type(value)
  }

  static assessmentCreation(purposeOfAssessment,assessmentTitle,OrganisationName){
    cy.wait(500)
    landingPage.landingPageFields()
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(purposeOfAssessment),'Client Request option is clicked')
    landingPage.AssessmentpopupFields(assessmentTitle,OrganisationName,'Description of the assessment','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid(1).should('have.text',' '+assessmentTitle+' ')

  }

}

export default landingPage



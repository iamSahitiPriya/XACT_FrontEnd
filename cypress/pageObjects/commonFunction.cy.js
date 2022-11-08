/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import landingPage from "./landingPage.cy";
import assessmentPage from "./assessmentPage.cy";

class commonFunction{

  static clickOnElement(webElementLocation){
    //let element = cy.get(webElementLocation)
    webElementLocation.click({ force: true })
  }

  static typeInElement(webElementLocation,value) {
    webElementLocation.clear().type(value)
    if(webElementLocation.should('have.value',value)){
      assert.isOk(value+' is entered successfully')
    }else {
      assert.fail(value+' is not entered successfully')
    }
  }

  static elementShould(webElementLocation, shouldMatch){
    let element = cy.get(webElementLocation)
    element.should(shouldMatch)
  }

  static textBaseAssertions(webEleAdd, assertionText, msg){
    let webElement = cy.get(webEleAdd)
    webElement.then(($text)=>{
      let val = $text.text()
      var myReg = new RegExp(assertionText, 'i')
      expect(val).to.match(myReg,msg)
    })
  }

  static elementIsDisplayed(element){
    element.then($body => {
      if ($body.element.length() > 0) {
        //evaluates as true if button exists at all
        element.then($header => {
          if ($header.is(element,'element is visible')){
            return element
          } else {
            assert.isNotOk(false,'element is not visible')
          }
        });
      } else {
        //you get here if the button DOESN'T EXIST
        assert.isNotOk(false,'element doesnot exist')
      }
    });
  }

  static elementIsVisible(element,message){
    if(element.should('be.visible')){
      cy.log(message)
      assert.isOk(element+' is visible for test')
    }else {
      assert.isNotOk(false, element+' is not visible')
    }
  }
  static verifyText(element,text,message){
    if(element.should('have.text',text)){
      cy.log(message)
      assert.isOk(element+' has '+text)
    }else {
      assert.fail(false, element+' does not have'+text)
    }
  }

  static containsText(element,text,message){
    // if(element.should('contain',text)){
    //   cy.log(message)
    //   assert.isOk(element+' contains '+text)
    // }else {
    //   assert.fail(false, element+' does not contain '+text)
    // }

    try{
      element.should('contain',text)
      cy.log(message)
    }catch (e) {
      assert.fail(false, element+' does not contain '+text)
    }
  }
  static valueOfElement(element,text,message){

      try{
        element.should('have.value',text)
        cy.log(message)
      }catch (e) {
        assert.fail(false, element+' does not have '+text+' as value')
      }
    }

  static CloseOrReopenAssessment(){
    cy.wait(1000)
    cy.get('body').then(($body) => {
      if ($body.find('button[id=finishAssessment]').text().includes('Finish')) {
        cy.get('#finishAssessment').click()
        assessmentPage.yesButtonInPopup().click()
        commonFunctions.elementIsVisible(assessmentPage.reOpenhAssessmentButton(),'Assessment is closed')
      }
      cy.get('body').then(($body) => {
        if ($body.find('button[id=reopenAssessment]').text().includes('Reopen')) {
          cy.get('#reopenAssessment').click()
          commonFunctions.elementIsVisible(assessmentPage.finishAssessmentButton(),'Assessment is Reopened')
        }
      })
    })
  }



}




export default commonFunction

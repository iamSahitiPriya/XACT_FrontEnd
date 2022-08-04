/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import landingPage from "./landingPage";

class commonFunction{

  static clickOnElement(webElementLocation){
    let element = cy.get(webElementLocation)
    element.click()
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




}




export default commonFunction

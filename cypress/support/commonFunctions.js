/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import landingPage from "../pageObjects/landingPage.cy";

class commonFunction{

  static clickOnElement(webElementLocation){
    let element = cy.get(webElementLocation)
    element.click()
  }

  static typeInElement(value, webElementLocation){
    let typeElement = cy.get(webElementLocation)
    typeElement.type(value)
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
      if ($body.element.length > 0) {
        //evaluates as true if button exists at all
        element.then($header => {
          if ($header.is(':visible')){
            return element
          } else {
            assert.isNotOk(false,'element is not visible')
          }
        });
      } else {
        //you get here if the button DOESN'T EXIST
        assert.isOk('everything','everything is OK');
      }
    });
  }
}

export default commonFunction

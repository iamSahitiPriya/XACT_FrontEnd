import commonFunctions from "./commonFunction.cy";
import landingPage from "./landingPage.cy";

class assessmentChart {

  static chart() {
    return cy.get('#chart')
  }

  static radioButtonGroup() {
    return cy.get('.gauge')
  }

  static backButton() {
    return cy.get('.mat-toolbar>button')
  }

  static assessmentName() {
    return cy.get('.name')
  }
}

export default assessmentChart

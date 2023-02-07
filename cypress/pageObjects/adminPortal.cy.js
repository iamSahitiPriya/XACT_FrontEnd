import commonFunctions from "./commonFunction.cy";
import landingPage from "./landingPage.cy";

class adminPortal {

  static adminConsole(){
    return cy.get('.console > .mat-card')
  }
  static adminConsoleHeader(){
    return cy.get('.console > .mat-card > .mat-card-title')
  }
  static dashboardHeader(){
    return cy.get('.dashBoardText')
  }
  static dropDown(){
    return cy.get('.mat-form-field-flex')
  }
  static totalAssessmentCard(){
    return cy.get('.Total')
  }
  static totalAssessmentCardHeader(){
    return cy.get('.Total > .mat-card-title')
  }
  static totalAssessmentCardCount(){
    return cy.get('.total')
  }

  static activeAssessmentCard(){
    return cy.get('.Active')
  }
  static activeAssessmentCardHeader(){
    return cy.get('.Total > .mat-card-title')
  }
  static activeAssessmentCardCount(){
    return cy.get('.active')
  }
  static completedAssessmentCard(){
    return cy.get('.Completed')
  }
  static completedAssessmentCardHeader(){
    return cy.get('.Completed > .mat-card-title')
  }
  static completedAssessmentCardCount(){
    return cy.get('.complete')
  }
  static downloadButton(){
    return cy.get('.downloadButton')
  }
  static dashBoard(){
    return cy.get('.dashboardButton')
  }
  static category(){
    return cy.get('.categoryButton')
  }
  static modules(){
    return cy.get('.moduleButton')
  }
  static topic(){
    return cy.get('.topicButton')
  }
  static parameter(){
    return cy.get('.parameterButton')
  }
  static addButton(){//for category and modules pages
    return cy.get('.button1')
  }

  static addButtonTopic(){
    return cy.get('.topicButton1')
  }
  static addParameter(){
    return cy.get('.parameterButton1')
  }


  //table headers
  static categoryHeader(){
    return cy.get('.mat-header-row > .cdk-column-categoryName')
  }
  static moduleHeader(){
    return cy.get('.mat-header-row > .cdk-column-moduleName')
  }
  static topicHeader(){
    return cy.get('.mat-header-row > .cdk-column-topicName')
  }
  static parameterHeader(){
    return cy.get('.mat-header-row > .cdk-column-parameterName')
  }




  static dateHeader(){
    return cy.get('.mat-header-row > .cdk-column-updatedAt')
  }

  static activeHeader(){
    return cy.get('.mat-header-row > .cdk-column-active')
  }

  static actionHeader(){
    return cy.get('.mat-header-row > .cdk-column-edit')
  }
  static actionHeader(){
    return cy.get('.mat-header-row > .cdk-column-edit')
  }
  static pagenationDropDown(){
    return cy.get('.mat-paginator-page-size')
  }

  static pagenation(){
    return cy.get('.mat-paginator-range-actions')
  }

  static toggleCategory(index){//index=1,3,5,7,9
    return cy.get('tbody>tr:nth-child('+index+')>.categoryActive >.mat-slide-toggle')
  }
  static editButtonCategory(index){//index=1,3,5,7,9
    return cy.get('tbody>tr:nth-child('+index+')>.categoryActive >.mat-slide-toggle')
  }




  static navigateToAdmin(){
    commonFunctions.clickElement(landingPage.userName(),'Clicking on username to see the options available')
    commonFunctions.clickElement(landingPage.adminPortalLink(),'Clicking on Admin option to navigate to admin portal')
    commonFunctions.elementIsVisible(adminPortal.adminConsole(),'User is navigated to admin portal')
  }



}

export default adminPortal


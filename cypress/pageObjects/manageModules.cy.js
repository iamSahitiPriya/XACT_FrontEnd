import landingPage from "./landingPage.cy";
import numberDefault from "lodash-es/number.default";


class manageModules {

  iInactiveCards=0
  iTotalCards=0

  static ModuleHeader(index) {
    return cy.get(':nth-child('+index+') > :nth-child(1) > .categoryCard > .mat-card-title-group > div > .mat-card-title')
  }
  static categoryCheckBox(index){
    return cy.get('.assessmentCards:nth-child('+index+') >div>.categoryCard>.category-card>.category-name>mat-checkbox>.mat-checkbox-layout>.mat-checkbox-inner-container')

  }
  static catCheckBox(index){
    return cy.get('.assessmentCards:nth-child('+index+') >div>.categoryCard>.category-card>.category-name>mat-checkbox>.mat-checkbox-layout>.mat-checkbox-inner-container>input')

  }
  static categoryName(index){
    return cy.get(':nth-child('+index+') > :nth-child(1) > .categoryCard > .mat-card-title-group > .categoryName > .mat-card-title')

  }
  static topicList(index){
    return cy.get(':nth-child(2) > :nth-child(1) > .moduleCards > .row > :nth-child('+index+') > .moduleText')
  }
   static moduleName(categoryIndex,moduleIndex){
      return cy.get(':nth-child('+categoryIndex+') > :nth-child(1) > .moduleCards > .row > :nth-child('+moduleIndex+') > .mat-tooltip-trigger')
    }

  static assessmentHeader(){
    return cy.get('.assessment-name')
  }
   static searchBox(){
      return cy.get('#searchModule')
    }

  static ManageModulesPageHeader(){
    return cy.get('.moduleHeading')
  }
  static saveButton(){
    return cy.get(':nth-child(2) > .mat-focus-indicator')
  }

  static categoryCard(){
    return cy.get('.categoryCard')
  }

  static moduleCard(index){
      return cy.get(':nth-child('+index+') > :nth-child(1) > .moduleCards > .row')
    }

  static activeCards(){
    return '.assessmentCards'
  }




  static selectModule(module){

    let iInactiveCards=0
    let  iTotalCards=0

    cy.get('.categoryCard').its('length').then((totalCards) => {
      iTotalCards = totalCards
      cy.log(iTotalCards)
    })

    cy.get('.categoryCard.active').its('length').then((inactiveCards) => {
      iInactiveCards = inactiveCards
      cy.log(iInactiveCards)
    })

    cy.wait(2000)
    cy.log(iTotalCards-iInactiveCards)
    cy.log(iTotalCards)

    this.ModuleHeader(1).invoke('text').then((moduleHeader)=>{
      if(moduleHeader.includes(module)){
        this.categoryCheckBox(1).check()
      }
    })




  }


}

export default manageModules


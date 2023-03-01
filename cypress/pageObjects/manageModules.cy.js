import landingPage from "./landingPage.cy";
import numberDefault from "lodash-es/number.default";


class manageModules {

  iInactiveCards=0
  iTotalCards=0

  static ModuleHeader(index) {
    return cy.get(':nth-child('+index+') > :nth-child(1) > .categoryCard > .mat-card-title-group > div > .mat-card-title')
  }
  static moduleCheckBox(index){
    return cy.get('.assessmentCards:nth-child('+index+') >div>.categoryCard>.category-card>.category-name>mat-checkbox>.mat-checkbox-layout>.mat-checkbox-inner-container')
                   //.assessmentCards:nth-child('+index+') >div>.categoryCard>.category-card>.category-name>mat-checkbox>.mat-checkbox-layout
  }
  static topicList(index){
    return cy.get(':nth-child(2) > :nth-child(1) > .moduleCards > .row > :nth-child('+index+') > .moduleText')
  }
  static ManageModulesPageHeader(){
    return cy.get('.moduleHeading')
  }
  static saveButton(){
    return cy.get(':nth-child(2) > .mat-focus-indicator')
  }
  static activeCards(){
    return '.assessmentCards'
  }




  static selectModule(module){

    let iInactiveCards=0
    let  iTotalCards=0
//this.iTotalCards= cy.get('.categoryCard').its('length')
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
    // for (let iModuleCount = 1; iModuleCount < cars.length; iModuleCount++) {
    //   text += cars[i] + "<br>";
    // }
    this.ModuleHeader(1).invoke('text').then((moduleHeader)=>{
      if(moduleHeader.includes(module)){
        this.moduleCheckBox(1).check()
      }
    })




    // switch (module){
    //   case 'Software Engineering':
    //     console.log('test')
    //     break
    //    case 'Product And Design':
    //     console.log('test')
    //      break
    //    case 'Cloud Platform':
    //     console.log('test')
    //      break
    //    case 'Operational Efficiency':
    //     console.log('test')
    //      break
    //   case 'Org Design':
    //     console.log('test')
    //      break

  }


}

export default manageModules


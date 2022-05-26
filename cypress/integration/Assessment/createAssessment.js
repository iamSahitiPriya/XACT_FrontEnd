import {appUrl, email, pwd} from "../../constants";
import LoginPage from "../pageObjects/loginPage";
import landingPage from "../pageObjects/landingPage";

describe('validating creating Assessment assessment popup functionality', () => {
  before('User should get navigated to Okta by launching the url',() => {
    //cy.visit(appUrl)
    cy.visit('http://localhost:4200')

  })

  it('Should get redirected to Okta', () => {
    loginPage.xActLogin('technicalbaba4u@gmail.com','Sam@12345')
    //loginPage.xActHomepagetitleValidation()
  })

  it()


  it('tc002 Create Assessment with valid input ',()=>{
    landingPage.AssessmentpopupFields('TestAssignment','testOrg','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton()

  })


})

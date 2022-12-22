import landingPage from "../pageObjects/landingPage.cy";
import commonFunctionCy from "../pageObjects/commonFunction.cy";
import commonFunctions from "../pageObjects/commonFunction.cy";

describe('validating creating Assessment assessment popup functionality', () => {

  beforeEach('User should get navigated to Okta by launching the url', () => {
    cy.window().then(win => win.location.hash = "/foo/bar")
    cy.intercept('GET','https://dev-47045452.okta.com/oauth2/default/v1/userinfo').as('pageLoad')
    cy.visit('/')
  })

  it('tc001 validate landing page of xAct application',()=>{
    landingPage.landingPageFields()
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
  })

  it('tc002 validating the error messages by providing empty values in all fields',()=>{
    landingPage.createAssessmentHeader().should('be.visible')
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().click()
    landingPage.OrganisationName().click()
    landingPage.Domain().click()
    landingPage.Industry().click()
    landingPage.teamSizeField().click()
    landingPage.email().click()
    landingPage.assessmentPopupErrorValidation(' Mandatory field ',' Mandatory number field ')
    landingPage.closeAssessmentPopup().click()
  })


  it('tc003 providing special characters in fields and validating the error message',()=> {
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('!@#$','!@#$','!@#$','!@#$','!@@@','jathin@thoughtworks.com')
    landingPage.assessmentPopupErrorValidation(' No Special Characters allowed except hyphen and underscore ',' Mandatory number field ')
    landingPage.closeAssessmentPopup().click()
  })


  it('tc004 creating assessment with more than 50 characters in assessment,organisation,domain,industry',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('morethan50charactersmorethan50charatersmorethan50characters','Infinity International','morethan50charactersmorethan50charatersmorethan50characters','morethan50charactersmorethan50charatersmorethan50characters','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()
    //landingPage.serverError().should('be.visible')
    // landingPage.closeAssessmentPopup().click()
    // landingPage.assessmentNameInGrid().should('not.have.text','morethan50charactersmorethan50charatersmorethan50characters')
  })

  it('tc005 close the assessment popup with out saving the assessment',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('donotsave the assessment','Infinity International','donotsave the assessment','donotsave the assessment','22','jathin@thoughtworks.com')
    landingPage.closeAssessmentPopup().click()
    landingPage.assessmentNameInGrid(1).should('not.have.text','donotsave the assessment')
  })

  it('tc006 validate color of the assessment popup fields hen values are not provided',()=>{

    landingPage.createAssessmentHeader().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentName().click()
    landingPage.OrganisationName().click()
    landingPage.Domain().click()
    landingPage.Industry().click()
    landingPage.teamSizeField().click()
    landingPage.email().click()
    //var const1=landingPage.AssessmentName().should('have.a.property','color')
  })


  it('tc007 Saving the assessment without filling few mandatory fields',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('donotsave the assessment','Infinity International','donotsave the assessment','donotsave the assessment','22','jathin@thoughtworks.com')
    landingPage.AssessmentName().clear()
    landingPage.Domain().clear()
    landingPage.closeAssessmentPopup().click()

    landingPage.assessmentNameInGrid(1).should('not.have.text','donotsave the assessment')
  })


  it('tc008 Saving the assessment without filling few mandatory fields',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('donotsave the assessment','Infinity International','donotsave the assessment','donotsave the assessment','-22','jathin@thoughtworks.com')
    landingPage.teamSizeFieldError().should('have.text',' Positive integer value allowed ')
    landingPage.closeAssessmentPopup().click()
    landingPage.assessmentNameInGrid(1).should('not.have.text','donotsave the assessment')
  })

  it('tc009 Error message should be disappeared when mandatory fields are populated again',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('    ','    ','donotsave the assessment','donotsave the assessment','22','jathin@thoughtworks.com')
    landingPage.assessmentNameError().should('have.text',' No Special Characters allowed except hyphen and underscore ')
    landingPage.AssessmentName().clear().type('testAssessment')
    landingPage.OrganisationName().clear().type('sa mint')
    landingPage.OrganisationSuggestion().click()
    landingPage.assessmentNameError().should('not.be.visible')
    landingPage.organisationNameError().should('not.be.visible')
    landingPage.closeAssessmentPopup().click()
  })

  it('tc010 functionality of up and down arrows in teamsize field',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    //landingPage.teamSizeField().click().type('{upArrow}').type('{upArrow}')
    landingPage.teamSize().click().type(100)
    landingPage.email().click()
    //validation
    //landingPage.teamSize().should('have.string','100')
  })

  // it('tc011 validating placeholders of all edit boxes',()=>{
  //   landingPage.createAssessment().click()
  //   landingPage.AssessmentName().should('have.text','Assessment Name * *')
  //   landingPage.OrganisationName().should('have.text','Organisation Name * *')
  //   landingPage.Domain().should('have.text','Domain of Target * *')
  //   landingPage.Industry().should('have.text','Industry of Organisation * *')
  //   landingPage.teamSizeField().should('have.text','Size of Target Team * *')
  //   landingPage.closeAssessmentPopup().click()
  // })

  it('tc012 validating placeholders after clicking in all edit boxes',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentName().click()
    landingPage.AssessmentName().clear()
    landingPage.AssessmentPlaceHolder().invoke('attr', 'placeholder').should('contain', 'Enter Assessment Name')
    landingPage.OrganisationName().click()
    landingPage.OrganisationName().clear()
    landingPage.organisationPlaceHolder().invoke('attr', 'placeholder').should('contain', 'Enter Organisation Name')
    landingPage.Domain().click()
    landingPage.Domain().clear()
    landingPage.domainPlaceHolder().invoke('attr', 'placeholder').should('contain', 'Enter Domain of Target')
    landingPage.Industry().click()
    landingPage.Industry().clear()
    landingPage.industryPlaceHolder().invoke('attr', 'placeholder').should('contain', 'Enter Industry of Organisation')
    //landingPage.email().click()
    //landingPage.email().clear()
    //landingPage.emailPlaceHolder().invoke('attr', 'placeholder').should('contain', 'Valid list of comma separated thoughtworks email address')
    landingPage.closeAssessmentPopup().click()
  })

  it('tc013 saving assessment without providing any fields in the popup',()=>{
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentPopupErrorValidation(' Mandatory field ',' Mandatory number field ')
  })

  it('tc014 creating assessment with multiple emails with commas',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.saveAssessmentButton().click()

    landingPage.assessmentNameInGrid(1).should('have.text',' testassignment ')
  })

  it('tc015 refresh the page when assessment popup is displayed',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    cy.reload()
    landingPage.AssessmentPopup().should('not.exist')
  })

  it('tc016 Creating assessment with invalid email domain',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com,jathin@gmail.com')
    landingPage.teamSize().click()
    landingPage.emailError().should('have.text',' Valid list of comma separated thoughtworks.com email address ')
  })

  it('tc017 Creating assessment with comma in the end of email',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com      ')
    landingPage.teamSize().click()
    //landingPage.emailError().should('have.text',' Valid list of comma separated thoughtworks email address ')
    //code for chip is formed
  })

  it('tc018 Creating assessment with special characters with email',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','!!!!!@thoughtworks.com,')
    landingPage.teamSize().click()
    landingPage.emailError().should('have.text',' Valid list of comma separated thoughtworks.com email address ')
  })

  it('tc019 Creating assessment with special characters with email',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@!!!.com,')
    landingPage.teamSize().click()
    landingPage.emailError().should('have.text',' Valid list of comma separated thoughtworks.com email address ')
  })
  //
  // it('tc020 close the assessment popup without providing input',()=>{
  //   landingPage.createAssessment().click()
  //   landingPage.AssessmentPopup().should('be.visible')
  //
  //   landingPage.closeAssessmentPopup().dblclick()
  //   landingPage.AssessmentPopup().should('not.be.visible')
  // })

  it('tc021 enter values in the fields and clear them, then mandatory field error should be displayed',()=>{
    landingPage.createAssessmentHeader().should('be.visible')
    landingPage.createAssessment().should('be.visible')
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(2),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.AssessmentpopupFields('TestAssignment','Infinity International','testIndustry','testDOMAIN','22','jathin@thoughtworks.com')
    landingPage.AssessmentName().clear()
    landingPage.OrganisationName().clear()
    landingPage.Domain().clear()
    landingPage.Industry().clear()
    landingPage.teamSizeField().clear()
    landingPage.email().clear()
    landingPage.assessmentPopupErrorValidation(' Mandatory field ',' Mandatory number field ')
    landingPage.closeAssessmentPopup().click()
  })

  it('tc022 A chip should be formed when valid email id is entered',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    commonFunctionCy.typeInElement(landingPage.email(),'jathin@thoughtworks.com')
    landingPage.email().type('{enter}')
    landingPage.emailChip().should('be.visible')
    landingPage.emailChip().contains(' jathin@thoughtworks.com ')
  })

  it('tc023 Chip should not be formed when invalid email is provided',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    commonFunctionCy.typeInElement(landingPage.email(),'@thoughtworks.com')
    landingPage.emailChip().should('not.exist')
  })

  it('tc024 chip should be formed when , is entered after a valid email',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.email().clear()
    landingPage.email().type('jathin@thoughtworks.com,')
    //landingPage.emailChip().should('be.visible')
    landingPage.emailChip().contains('jathin@thoughtworks.com')
  })

  it('tc025 chip should be formed when user hits enter after a valid email',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.email().clear()
    landingPage.email().type('jathin@thoughtworks.com')
    cy.wait(100)
    landingPage.email().type('{enter}')
    landingPage.emailChip().should('be.visible')
    landingPage.emailChip().contains('jathin@thoughtworks.com')
  })


  it('tc025 Chip should not be formed when invalid email domain is provided',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    commonFunctionCy.typeInElement(landingPage.email(),'jathin@gmail.com')
    landingPage.emailChip().should('not.exist')
  })


  it('tc026 Email place holder should be displayed even after valid email ids are provided in the email field',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentPopup().should('be.visible')
    landingPage.email().clear()
    landingPage.email().type('jathin@thoughtworks.com')
    landingPage.email().type('{enter}')
    landingPage.emailChip().should('be.visible')
    landingPage.emailPlaceHolder().should('be.visible')
    landingPage.emailPlaceHolder().invoke('attr', 'placeholder').should('contain', 'abc@thoughtworks.com')
  })

  it('tc027 create an assessment without providing email id',()=>{
    landingPage.createAssessment().click()
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessment2(),'purpose of element dropdown options are visible')
    commonFunctions.clickOnElement(landingPage.purposeOfAssessmentOption(1),'Client Request option is clicked')
    landingPage.AssessmentpopupFields('noemailid','Infinity International','testIndustry','testDOMAIN','22','{enter}')
    landingPage.saveAssessmentButton().click()
    landingPage.assessmentNameInGrid(1).should('have.text',' noemailid ')
  })







})

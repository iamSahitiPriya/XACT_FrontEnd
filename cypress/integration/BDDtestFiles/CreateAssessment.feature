Feature: Implement create assessment and user profile

  Background: User navigates to X-Actby via Okta
    #Given User provides valid "UserName" and clicks on Next button
    #Then provide valid "Password" and clicks on Verify button
    #And complete the SSO verification
    #Then User should be navigated to Okta homepage and click on the X-Act chicklet
    #And User clicks on Create assessment button in homepage of the application
    Given User launches the xAct application by providing valid url
    And User should provides valid UserId and password and click on Signin button
    Then User should be navigated to home page of xAct

  Scenario: Verify all the fields are available on Create assessments pop up
    Given User clicks on create assessment popup and fills all the details in the popup
    And it should have  AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId edit fields
    And Add New User sub header should be present above the Email Id field
    And + button should be present corresponding to email id field
    And Save button should be present in the bottom of the popup
    And A close button is present in top right corner of the pop up

  Scenario: Populate all the fields with valid input and close the pop up without saving the assessment
    Given Create assessment popup is displayed
    And provide valid AssessmentName,OrganisationName,Domain,IndustryName,TeamSize,EmailId and click on close button
    Then Popup should be closed and assessment should not be created

  Scenario: Create assessment button should be disabled when create assessment popup is open
    Given Create assessment popup is displayed
    And the create assessment button should be disabled and not clickable
    Then close the create asssessment popup
    Then  the create assessment button should be enabled and clickable


  Scenario Outline: Create an assessment by providing valid details
    Given Create assessment popup is displayed
    And user provides valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>","<EmailId>" and click on save button
    Then New assessment is created and displayed My Assessments table with active status
    Examples:
      | Description                               | AssessmentName                                                                     | OrganisationName                                                                   | Domain                                                                             | IndustryName | TeamSize | EmailId                        |
      | valid input                               | Reliance Energy(Loren ipsum is a simple dummy)                                     | Reliance Energy(Loren ipsum is a simple dummy)                                     | Reliance Energy(Loren ipsum is a simple dummy)                                     | Energy       | 12       | jathin.meduri@thoughtworks.com |
      | valid input with special charcters        | Reliance Energy(Loren ipsum is a simple dummy)!@#                                  | Reliance Energy(Loren ipsum is a simple dummy)!@#$                                 | Reliance Energy(Loren ipsum is a simple dummy)!@#$                                 | Energy       | 12       | jathin.meduri@thoughtworks.com |
      | valid input with alphanumerical charcters | Reliance Energy(Loren ipsum is a simple dummy)123                                  | Reliance Energy(Loren ipsum is a simple dummy)123                                  | Reliance Energy(Loren ipsum is a simple dummy)123                                  | Energy       | 12       | jathin.meduri@thoughtworks.com |
      | invalid input with more than 50 char      | qweqrwrwrwrqfhgdhsbfjkhdsbfjhbdsjvhbdsjhbvytdfvytdsbcbycytvgbberuyberuhbvhebvubrub | qweqrwrwrwrqfhgdhsbfjkhdsbfjhbdsjvhbdsjhbvytdfvytdsbcbycytvgbberuyberuhbvhebvubrub | qweqrwrwrwrqfhgdhsbfjkhdsbfjhbdsjvhbdsjhbvytdfvytdsbcbycytvgbberuyberuhbvhebvubrub | Energy       | 12       | jathin.meduri@thoughtworks.com |
      | invalid input with special                | @@@@@                                                                              | !!!!!!                                                                             | ###@#@                                                                             | ##@#@y       | ##       | jathin.meduri@thoughtworks.com |
      | invalid input with spaces                 |                                                                                    |                                                                                    |                                                                                    |              |          |                                |


  Scenario Outline: Create an assessment with multiple users
    Given Create assessment popup is displayed
    And provide valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>"
    And provide multiple users "<user1>","<user2>","<user3>" and click on save
    Then New assessment is created and displayed My Assessments table with active status
    Examples:
      | Description                  | AssessmentName                                 | OrganisationName                               | Domain                                         | IndustryName | TeamSize | user1                          | user2                           | user3                           |
      | valid input multiple users   | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Energy       | 12       | jathin.meduri@thoughtworks.com | jathin.meduri1@thoughtworks.com | jathin.meduri2@thoughtworks.com |
      | invalid input multiple users | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Energy       | 12       | @thoughtworks.com              | jathin.meduri@thoughtworks.com  | 123@thoughtworks.com            |

  Scenario: All th fields in the create assessment popup are mandatory fields and highlighted with red border when not populated
    Given Create assessment popup is displayed
    And click  and leave the fields empty
    Then the fields which are click and left empty should be highlightd in a red border and Mandatory field error message below it

  Scenario: Leave few mandatory fields empty and the click on save button
    Given Create assessment popup is displayed
    Then provide valid AssessmentName,OrganisationName,Domain values and leave the other fields empty
    And click on save buttonNew assessment
    Then new assessment should not be created
    And Fields which are left empty should be highlighted with red border with error message


  Scenario: Only positive integer values should be accepted in Team size edit box
    Given Create assessment popup is displayed
    And provide valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>","<EmailId>" and click on save
    When alphabetical values are provided in the team size field
    Then the user cannot enter values in the field
    And provide negative values in the team size field
  Then

  @@@@@@@@@@@
  Scenario: The red colored border and the error must disappear when the fields are filled wih proper input
    Given Create assessment popup is displayed
    And click  and leave the fields empty
    Then the fields which are click and left empty should be highlightd in a red border and Mandatory field error message below it
    When provide valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>","<EmailId>"
    Then the error messages and red line border for the fields should disappear


  Scenario: Up and down arrows in team size field to increase or decrease team size count
    Given Create assessment popup is displayed
    And user clicks on the up arrow "1" should be appeared and decreased by one everytime the button is clicked
    When user clicks on the down arrow "-1" should be appeared and decreased by one everytime the button is clicked

  Scenario: Verifying all the headers of the edit boxes in the popup
    Given Create assessment popup is displayed
    Then verify all the headers for respective edit boxes in the popup

  Scenario: Click on save button without populating the edit boxes in the popup
    Given  Create assessment popup is displayed
    When user clicks on the save button without entering values in the edit boxes and click on the save button
    Then  All the empty mandatory fields should be highlighted with the red border and error message

  Scenario: Edit boxes in popup should be blank when the User reopens the create assessment popup
    Given  Create assessment popup is displayed
    When provide valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>","<EmailId>" and close the popup without saving
  And User clicks on Create assessment button in homepage of the application
  Then All the edit boxes in the popup should be empty









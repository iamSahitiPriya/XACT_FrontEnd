Feature: Validation of X-Act landing page


  Background: User navigates to X-Actby via Okta
    Given User provides valid "UserName" and clicks on Next button
    Then provide valid "Password" and clicks on Verify button
    And complete the SSO verification
    Then User should be navigated to Okta homepage and click on the X-Act chicklet

  Scenario: Verify whether username is displayed on the application and is clickable and logout option
    Given user is navigated to the landing page of the X-Act application
    Then Verify whether user profile name is displayed
    And the profile name is clickable,down arrow is next to it
    When the profile name or down arrow is clicked ,a drop down should be displayed
    And up ward arrow should be displayed when dropdown is present
    Then verify logout option is present in the dropdown and click on logout
    Then user should be loggedout of X-Act and navigated to Okta home page

  Scenario: Verification of X-Act logo
    Given  user is navigated to the landing page of the X-Act application
    Then X-Act logo should be displayed on the top right corner of the application

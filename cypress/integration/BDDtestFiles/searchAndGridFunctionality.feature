Feature: User should be able to search assessments in the grid using the search box available

  Background: User navigates to X-Actby via Okta
    Given User provides valid "UserName" and clicks on Next button
    Then provide valid "Password" and clicks on Verify button
    And complete the SSO verification
    Then User should be navigated to Okta homepage and click on the X-Act chicklet
    And User clicks on Create assessment button in homepage of the application

  Scenario Outline: User should be able to search assessments available in the grid
    Given user searches with a "<SearchValue>" in the search box available
    When the assessments results should be appeared on the grid as per the search criteria
    Then search results will be displayed matching the search anywhere in the columns
    Examples:
      | Description                                    | SearchValue |
      | Valid Assessment search                        | Test        |
      | Valid Organisation search                      | Tst         |
      | Search with last updated date                  | 29/04/2022  |
      | Search wih status                              | Active      |
      | Search with exact values                       | Test        |
      | Search with incomplete value                   | Te          |
      | Search with numbers                            | 234         |
      | Search with special characters                 | !@#$        |
      | Search with spaces in the tring                | test test   |
      | Search with alpha numeric values               | test!@#     |
      | Search with spaces before the string           | test        |
      | Search with spaces after the string            | test        |
      | Search with empty spaces                       |             |
      | Search with text whichis not available in page | Test        |
      | Search with all capital alphabetis             | TEST        |
      | Search with only small letters                 | test        |
      | Search withsmall and capital alphabets         | TesTT       |
      | Search with assessment which is unavailable    | z           |


  Scenario: Validating water mark text in the search box
    Given Search icon and search text should be displayed as water text in the search box
    When user clicks on the both icon and search should be shifted up
    And "Ex. My Assessment" should be displayed as water text
    When Search text is displayed , "Ex. My Assessment" is disappeared and search,its icon remains same


  Scenario: Search box should be disabled when user clicks outside the search box
    Given Search box should be editable when user clicks on the search box
    And User should be able to enter value in search box
    When user clicks outside the search box,it is no more editable and disabled
    Then user cannot enter any value in the searchbox
    And Value entered in the searchbox should remain same

    #Grid

  Scenario Outline: Latest created assessment should be on the top of the grid and verify the grid headers
    Given User clicks on the create assessments button
    When user provides valid "<AssessmentName>","<OrganisationName>","<Domain>","<IndustryName>","<TeamSize>","<EmailId>" and click on save button
    Then the latest created assessment should be displayed on top of the grid with "Active" status
    And verify the grid has "Assessment Name","Organisation Name","Status","Last Updated"
    Examples:
      | Description | AssessmentName                                 | OrganisationName                               | Domain                                         | IndustryName | TeamSize | EmailId                        |
      | valid input | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Reliance Energy(Loren ipsum is a simple dummy) | Energy       | 12       | jathin.meduri@thoughtworks.com |

  Scenario: Assessments page will only show assessments where the user is an owner or participant
    #######################################################################################################################################

  Scenario Outline: The item count in the grid should be displayed according to the items per page drop down
    Given User select "<ItemPerPage>" from the items per page drop down
    Then the number of assessments displayed in the should be equal to "<ItemPerPage>"
    Examples:
      | ItemPerPage |
      | 5           |
      | 10          |
      | 25          |
      | 100         |

    Scenario:







Feature: Registration Feature 

    As a visitor I can create a new account by the registration feature

@e2e
Scenario Outline: New User Registration E2E Scenario
Given I open the registration page
When I select the gender
And I enter First Name "<firstname>"
And I enter Last Name "<lastname>"
And I select Date of Birth "<day>"
And I select Month of Birth "<month>"
And I select Year of Birth "<year>"
And I enter Email "<email>"
And I enter Password "<password>"
And I enter Confirm Password "<password>"
And I click register button
Then successful message is displayed
Examples:
| firstname | lastname | email | password | day | month | year|
| moataz  | nabil  | moataznabil |123456| 5 | November |1983|
| james | bond | jamesbond | 789443 | 6 | July | 1970 |
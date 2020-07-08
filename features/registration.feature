Feature: Registration Feature

As a vistior I can create new account by the registration
feature

@e2e
Scenario Outline: New User Registration E2E
Given I open the registration page
When I select the gender
And I enter First name "<firstname>"
And I enter Last name "<lastname>"
And I select Date of Birth "<day>"
And I select Month of Birth "<month>"
And I select Year of Birth "<year>"
And I enter Email "<email>"
And I enter Password "<password>"
And I enter Confirm Password "<password>"
And I click register button
Then successfull message is displayed
Examples:
| firstname | lastname | email | password | day | month | year|
| moataz  | nabil  | moataz@test.com |123456| 5 | November |1983|
| james | pond | james@test.com| 789443 | 6 | July | 1970 |
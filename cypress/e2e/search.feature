Feature: Search Functionality
  As a user
  I want to search for recipes
  So that I can find food items I'm interested in

  Scenario: Search for a specific recipe
    Given I am on the homepage
    When I type "pizza" in the search box
    Then I should see recipes related to "pizza"

  Scenario: Search with empty query
    Given I am on the homepage
    When I clear the search box
    Then I should see the default search results
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// We'll use a before hook to set up the API key
before(() => {
  // Set up environment variable
  cy.window().then((win) => {
    win.env = {
      VITE_SPOONACULAR_API_KEY: Cypress.env('VITE_SPOONACULAR_API_KEY')
    };
  });
});

Given('I am on the homepage', () => {
  // Set up API interception for the initial load
  cy.intercept('GET', '**/recipes/complexSearch*').as('initialSearch');
  cy.visit('/');
  // Wait for the initial search request that happens on component mount
  cy.wait('@initialSearch');
  // Verify that we have results from the initial load
  cy.get('[class*="itemContainer"]', { timeout: 10000 }).should('exist');
});

When('I type {string} in the search box', (searchTerm) => {
  // Set up new interception for the search action
  cy.intercept('GET', '**/recipes/complexSearch*').as('searchRequest');
  
  // Clear the input and type the new search term
  cy.get('input[type="text"]').clear().type(searchTerm);
  
  // Wait for the search request
  cy.wait('@searchRequest');
  
  // Wait for the UI to update with new results
  cy.get('[class*="itemContainer"]', { timeout: 10000 }).should('exist');
});

When('I clear the search box', () => {
  // Set up new interception for the clear action
  cy.intercept('GET', '**/recipes/complexSearch*').as('searchRequest');
  cy.get('input[type="text"]').clear();
  cy.wait('@searchRequest');
  // Wait for the UI to update
  cy.get('[class*="itemContainer"]', { timeout: 10000 }).should('exist');
});

Then('I should see recipes related to {string}', (searchTerm) => {
  // Log the actual recipe names for debugging
  cy.get('[class*="itemName"]').then($elements => {
    const recipeNames = Array.from($elements).map(el => el.innerText);
    cy.log('Found recipes:', recipeNames);
  });
  
  // Check if at least one recipe name contains the search term
  cy.get('[class*="itemName"]', { timeout: 10000 }).should('have.length.at.least', 1)
    .then($elements => {
      const recipeNames = Array.from($elements).map(el => el.innerText.toLowerCase());
      expect(recipeNames.some(name => name.includes(searchTerm.toLowerCase()))).to.be.true;
    });
});

Then('I should see the default search results', () => {
  // Check if any recipes are displayed
  cy.get('[class*="itemContainer"]', { timeout: 10000 }).should('exist');
}); 
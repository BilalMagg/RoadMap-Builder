/// <reference types="cypress" />

// ***********************************************
// Custom Commands for Roadmap Builder E2E Tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('test@example.com', 'password123', true)
       */
      login(email: string, password: string, rememberMe?: boolean): Chainable<void>;
      
      /**
       * Custom command to signup
       * @example cy.signup({ name: 'Test User', email: 'test@example.com', password: 'password123' })
       */
      signup(userData: { name: string; email: string; password: string }): Chainable<void>;
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
      
      /**
       * Custom command to create a roadmap (no form - creates directly)
       * @example cy.createRoadmap()
       */
      createRoadmap(): Chainable<void>;
      
      /**
       * Custom command to get element by data-cy attribute
       * @example cy.getBySel('submit-button')
       */
      getBySel(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string, rememberMe: boolean = false) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  
  if (rememberMe) {
    cy.get('input[type="checkbox"]#remember').check();
  }
  
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to roadmaps page
  cy.url().should('include', '/roadmaps', { timeout: 10000 });
});

// Signup command - Updated to use "name" instead of "username"
Cypress.Commands.add('signup', (userData: { name: string; email: string; password: string }) => {
  cy.visit('/signup');
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="password"]').type(userData.password);
  cy.get('input[name="confirmPassword"]').type(userData.password);
  cy.get('input[type="checkbox"]#terms').check();
  cy.get('button[type="submit"]').click();
  
  // Wait for successful signup (redirect to login or roadmaps)
  cy.url().should('match', /\/(login|roadmaps)/, { timeout: 10000 });
});

// Logout command
Cypress.Commands.add('logout', () => {
  // Click logout button
  cy.contains('button', 'Logout').click();
  
  // Verify redirect to home (not login)
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

// Create roadmap command - NO FORM, creates directly
Cypress.Commands.add('createRoadmap', () => {
  cy.visit('/roadmaps');
  
  // Click create new roadmap button (creates with default title "New Roadmap")
  cy.get('[data-cy="create-roadmap-button"]').first().click();
  
  // Wait for redirect to canvas
  cy.url().should('include', '/canvas', { timeout: 10000 });
});

// Get by data-cy attribute
Cypress.Commands.add('getBySel', (selector: string) => {
  return cy.get(`[data-cy="${selector}"]`);
});

export {};
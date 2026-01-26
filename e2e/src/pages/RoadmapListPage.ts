export class RoadmapListPage {
  // Selectors - Updated for CSS modules
  private createButton = '[data-cy="create-roadmap-button"]';
  private roadmapCard = '[data-cy="roadmap-card"]';
  private deleteButton = 'button[title="Delete roadmap"]';

  visit() {
    cy.visit('/roadmaps');
    return this;
  }

  clickCreateRoadmap() {
    cy.get(this.createButton).first().click();
    return this;
  }

  createRoadmap(title: string = 'Integration Test Roadmap', category: string = 'Backend') {
    this.clickCreateRoadmap();
    
    // Wait for modal to be visible
    cy.contains('h2', 'Create Roadmap').should('be.visible');
    
    // Fill Title
    cy.get('input[name="title"]').type(title);
    
    // Select Category
    // Open the select dropdown
    cy.get('button[role="combobox"]').click();
    // Select the option
    cy.get('[role="option"]').contains(category).click();
    
    // Submit form
    cy.contains('button', 'Launch Roadmap').click();
    
    return this;
  }

  verifyRoadmapExists(title: string) {
    cy.contains(this.roadmapCard, title).should('exist');
    return this;
  }

  clickRoadmap(title: string) {
    cy.contains(this.roadmapCard, title).click();
    return this;
  }

  deleteRoadmap(title: string) {
    cy.contains(this.roadmapCard, title).within(() => {
      cy.get(this.deleteButton).click({ force: true });
    });
    
    // Confirm deletion in browser alert
    cy.on('window:confirm', () => true);
    
    return this;
  }

  verifyRoadmapCount(count: number) {
    if (count === 0) {
      cy.contains('No roadmaps yet').should('be.visible');
    } else {
      cy.get(this.roadmapCard).should('have.length', count);
    }
    return this;
  }

  verifyRedirectToCanvas() {
    cy.url().should('include', '/canvas');
    return this;
  }
}

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
    // Creates directly with default title "New Roadmap"
    cy.contains('button', /create.*roadmap/i).click();
    return this;
  }

  createRoadmap() {
    // No form - creates directly
    this.clickCreateRoadmap();
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

import { RoadmapListPage } from '../../src/pages/RoadmapListPage';

describe('Roadmap CRUD Operations', () => {
  const roadmapListPage = new RoadmapListPage();

  beforeEach(() => {
    // Login before each test
    cy.fixture('user').then((users) => {
      cy.login(users.validUser.email, users.validUser.password);
    });
  });

  describe('Create Roadmap', () => {
    it('should create a new roadmap', () => {
      roadmapListPage
        .visit()
        .createRoadmap()
        .verifyRedirectToCanvas();
    });
  });

  describe('View Roadmaps', () => {
    beforeEach(() => {
      // Create a roadmap first
      cy.createRoadmap();
      cy.visit('/roadmaps');
    });

    it('should display created roadmaps', () => {
      // Verify "Integration Test Roadmap" appears in the list
      roadmapListPage.verifyRoadmapExists('Integration Test Roadmap');
    });

    it('should navigate to canvas when clicking a roadmap', () => {
      roadmapListPage
        .clickRoadmap('Integration Test Roadmap')
        .verifyRedirectToCanvas();
    });
  });

  describe('Delete Roadmap', () => {
    beforeEach(() => {
      // Create a roadmap to delete
      cy.createRoadmap();
      cy.visit('/roadmaps');
    });

    it('should delete a roadmap', () => {
      // Get initial count of roadmaps
      cy.get('[class*="roadmapCard"]').then($cards => {
        const initialCount = $cards.length;
        
        roadmapListPage.deleteRoadmap('Integration Test Roadmap');

        // Wait for deletion
        cy.wait(2000);

        // Verify count decreased or empty state shown
        cy.get('body').then($body => {
          if ($body.find('[class*="roadmapCard"]').length > 0) {
            // If there are still cards, verify count decreased
            cy.get('[class*="roadmapCard"]').should('have.length', initialCount - 1);
          } else {
            // If no cards, verify empty state
            cy.contains('No roadmaps yet').should('be.visible');
          }
        });
      });
    });
  });
});

export class LoginPage {
  // Selectors - Updated to match actual form structure
  private emailInput = 'input[type="email"]';
  private passwordInput = 'input[type="password"]';
  private rememberMeCheckbox = 'input[type="checkbox"]#remember';
  private submitButton = 'button[type="submit"]';
  private errorMessage = '[data-cy="auth-error"]';
  private signupLink = 'a[href="/signup"]';

  visit() {
    cy.visit('/login');
    return this;
  }

  fillEmail(email: string) {
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.passwordInput).clear().type(password);
    return this;
  }

  checkRememberMe() {
    cy.get(this.rememberMeCheckbox).check();
    return this;
  }

  submit() {
    cy.get(this.submitButton).click();
    return this;
  }

  login(email: string, password: string, rememberMe: boolean = false) {
    this.fillEmail(email);
    this.fillPassword(password);
    
    if (rememberMe) {
      this.checkRememberMe();
    }
    
    this.submit();
    return this;
  }

  verifyErrorMessage(message?: string) {
    if (message) {
      cy.get(this.errorMessage).should('be.visible').and('contain', message);
    } else {
      cy.get(this.errorMessage).should('be.visible');
    }
    return this;
  }

  verifyRedirectToRoadmaps() {
    cy.url().should('include', '/roadmaps');
    return this;
  }

  clickSignupLink() {
    cy.get(this.signupLink).click();
    return this;
  }
}

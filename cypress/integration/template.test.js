/// <reference types="cypress" />

context("Test template", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice");
  });

  it("Action buttons disabled when form is invalid", () => {
    cy.visit("/");

    cy.get("#aboutButton").click();
    cy.get(".pf-c-about-modal-box").contains("About");
    cy.get("button[aria-label='Close Dialog']").click();
  });
});

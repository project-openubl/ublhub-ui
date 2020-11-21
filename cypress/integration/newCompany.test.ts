/// <reference types="cypress" />

context("Test NewCompany", () => {
  it("Form should work", () => {
    cy.visit("/companies/~new");

    cy.get("input[name='name']").type("myProject");
    cy.get("input[name='webServices.factura']").type("http://factura.com");
    cy.get("input[name='webServices.guia']").type("http://guia.com");
    cy.get("input[name='webServices.retenciones']").type(
      "http://retenciones.com"
    );
    cy.get("input[name='credentials.username']").type("myUsername");
    cy.get("input[name='credentials.password']").type("myPassword");

    cy.get("button[type='submit']").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/companies");
  });
});

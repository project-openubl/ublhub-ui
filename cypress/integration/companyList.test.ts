/// <reference types="cypress" />

context("Test company list", () => {
  before(() => {
    const headers = {
      "Content-Type": "application/json",
    };

    // Delete all companies
    cy.request({
      method: "GET",
      headers: headers,
      url: `${Cypress.env("REST_API")}/user/companies?limit=1000`,
    }).then((result) => {
      result.body.data.forEach((e) => {
        cy.request({
          method: "DELETE",
          headers: headers,
          url: `${Cypress.env("REST_API")}/companies/${e.name}`,
        });
      });
    });

    // Create companies
    for (let i = 1; i <= 12; i++) {
      cy.request({
        method: "POST",
        headers: headers,
        body: {
          name: `Company${i}`,
          webServices: {
            factura: "http://url1.com",
            guia: "http://url2.com",
            retenciones: "http://url3.com",
          },
          credentials: {
            username: "myUsername",
            password: "myPassword",
          },
        },
        url: `${Cypress.env("REST_API")}/user/companies`,
      });
    }
  });

  it("Company list - filtering", () => {
    cy.visit("/companies");
    cy.get("tbody > tr").should("have.length", 10);

    cy.get("input[name='filterText']").type("company12");
    cy.get("button[aria-label='search button']").click();
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("tbody > tr").contains("company12");

    cy.get("input[name='filterText']").clear().type("COMPANY5");
    cy.get("button[aria-label='search button']").click();
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("tbody > tr").contains("company5");
  });

  it("Company list - pagination", () => {
    cy.visit("/companies");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("company1");
    cy.get("tbody > tr").contains("company10");

    cy.get("button[data-action='next']").first().click();
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").contains("company11");
    cy.get("tbody > tr").contains("company12");

    cy.get("button[data-action='previous']").first().click();
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("company1");
    cy.get("tbody > tr").contains("company10");
  });

  it("Company list - edit", () => {
    cy.visit("/companies");

    // Redirect to edit
    cy.get(".pf-c-table__action").first().click();
    cy.get(".pf-c-dropdown__menu-item").contains("Edit").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/companies/company1");
  });

  it("Company list - new", () => {
    cy.visit("/companies");

    // Redirect to new
    cy.get("Button[aria-label='new-company']").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/companies/~new");
  });
});

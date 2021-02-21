/// <reference types="cypress" />

context("Test company list", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access_token,
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
  });

  it("Company list - filtering", () => {
    cy.visit("/companies");
    cy.get("tbody > tr").should("have.length", 10);

    cy.get("input[aria-label='filter-text']").type("company12");
    cy.get("button[aria-label='search']").click();
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("tbody > tr").contains("company12");

    cy.get("input[aria-label='filter-text']").clear().type("COMPANY5");
    cy.get("button[aria-label='search']").click();
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

    cy.url().should(
      "eq",
      Cypress.config().baseUrl + "/companies/company1/overview"
    );
  });

  it("Company list - new", () => {
    cy.visit("/companies");

    // Redirect to new
    cy.get("Button[aria-label='new-company']").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/companies/~new");
  });

  it("Company list - delete", () => {
    cy.visit("/companies");

    // Verify table has 12 elements
    cy.get(".pf-c-options-menu__toggle-text").contains(12);

    // Open delete modal
    cy.get("button[aria-label='Actions']").last().click();
    cy.get(".pf-c-dropdown__menu-item").contains("Delete").click();

    cy.get(".pf-c-modal-box").should("have.length", 1);
    cy.get(".pf-m-danger").contains("Delete").should("be.disabled");
    cy.get(".pf-m-link").contains("Cancel").should("not.be.disabled");

    // Edit data and save
    cy.get("input[name='matchText']").type("project");
    cy.get(".pf-m-danger").contains("Delete").should("be.disabled");

    cy.get("input[name='matchText']").clear().type("company10");
    cy.get(".pf-m-danger").contains("Delete").should("not.be.disabled");

    cy.get(".pf-m-danger").contains("Delete").click();
    cy.get(".pf-c-modal-box").should("have.length", 0);

    // Verify company has been deleted
    cy.get(".pf-c-options-menu__toggle-text").contains(11);
  });
});

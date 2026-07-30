/* global cy, describe, it */

const registerUrl = "http://localhost:5173/register";

function visitRegister() {
  cy.clearLocalStorage();
  cy.visit(registerUrl, {
    onBeforeLoad(win) {
      win.localStorage.clear();
    },
  });
}

describe("Register page", () => {
  it("shows the register page content", () => {
    visitRegister();

    cy.url().should("include", "/register");
    cy.contains(/finebank\.io/i).should("be.visible");

    cy.get("#name")
      .should("be.visible")
      .and("have.attr", "name", "name")
      .and("have.attr", "placeholder", "Tanzir Rahman");
    cy.get("#signup-email")
      .should("be.visible")
      .and("have.attr", "name", "email")
      .and("have.attr", "placeholder", "hello@example.com");
    cy.get("#signup-password")
      .should("be.visible")
      .and("have.attr", "name", "password")
      .and("have.attr", "placeholder", "********");
    cy.get("#terms")
      .should("be.visible")
      .and("have.attr", "name", "terms");

    cy.contains("button", /^create account$/i).should("be.visible");
  });

  it("accepts register form input", () => {
    visitRegister();

    cy.get("#name").type("John Doe").should("have.value", "John Doe");
    cy.get("#signup-email")
      .type("test@example.com")
      .should("have.value", "test@example.com");
    cy.get("#signup-password")
      .type("123456")
      .should("have.value", "123456");
    cy.get("#terms").check().should("be.checked");
  });

  it("shows native validation when the form is empty", () => {
    visitRegister();

    cy.contains("button", /^create account$/i).click();

    cy.url().should("include", "/register");
    cy.contains("Name wajib diisi").should("be.visible");
    cy.contains("Email wajib diisi").should("be.visible");
    cy.contains("Password wajib diisi").should("be.visible");
  });
});

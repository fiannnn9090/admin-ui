/* global cy, Cypress, describe, expect, it */

const apiUrl = "https://jwt-auth-eight-neon.vercel.app";
const fakeToken =
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImhlbGxvQGV4YW1wbGUuY29tIiwiZXhwIjo0MTAyNDQ0ODAwfQ.";

function visitProtectedHome() {
  cy.clearLocalStorage();
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.clear();
    },
  });
}

describe("Login page", () => {
  it("logs in with valid credentials and shows the dashboard shell", () => {
    cy.intercept("POST", `${apiUrl}/login`, (req) => {
      expect(req.body).to.deep.equal({
        email: "hello@example.com",
        password: "123456",
      });

      req.reply({
        body: {
          refreshToken: fakeToken,
        },
        statusCode: 200,
      });
    });
    cy.intercept("GET", `${apiUrl}/goals`, {
      body: {
        data: [
          {
            present_amount: 12500,
            target_amount: 20000,
          },
        ],
      },
      statusCode: 200,
    });
    cy.intercept("GET", `${apiUrl}/bills`, {
      body: {
        data: [
          {
            amount: 150,
            date: "14 May, 2023",
            id: 1,
            name: "Figma - Monthly",
          },
        ],
      },
      statusCode: 200,
    });

    visitProtectedHome();

    cy.url().should("include", "/login");
    cy.get("#email").type("hello@example.com");
    cy.get("#password").type("123456");
    cy.contains("button", /^login$/i).click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.get("nav").should("exist");
    cy.get("header").should("exist");
    cy.contains(/hello john/i).should("be.visible");
  });

  it("shows an error message for invalid credentials", () => {
    cy.intercept("POST", `${apiUrl}/login`, {
      body: {
        msg: "Wrong Password",
      },
      statusCode: 400,
    });

    visitProtectedHome();

    cy.url().should("include", "/login");
    cy.get("#email").type("hello@example.com");
    cy.get("#password").type("123");
    cy.contains("button", /^login$/i).click();

    cy.contains("Wrong Password").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("logs in with an account created from the register page", () => {
    cy.intercept("POST", `${apiUrl}/register`, {
      body: {
        msg: "Register Berhasil",
      },
      statusCode: 200,
    });
    cy.intercept("POST", `${apiUrl}/login`, {
      body: {
        msg: "Email not found",
      },
      statusCode: 404,
    });
    cy.intercept("GET", `${apiUrl}/goals`, {
      body: {
        data: [
          {
            present_amount: 7500,
            target_amount: 15000,
          },
        ],
      },
      statusCode: 200,
    });

    cy.clearLocalStorage();
    cy.visit("/register", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get("#name").type("Local User");
    cy.get("#signup-email").type("local-user@example.com");
    cy.get("#signup-password").type("12345678");
    cy.get("#terms").check();
    cy.contains("button", /^create account$/i).click();

    cy.url().should("include", "/login");
    cy.get("#email").type("local-user@example.com");
    cy.get("#password").type("12345678");
    cy.contains("button", /^login$/i).click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains(/hello local/i).should("be.visible");
  });
});

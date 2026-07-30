/* global cy, Cypress, describe, expect, it */

const apiUrl = "https://jwt-auth-eight-neon.vercel.app";
const fakeToken =
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImhlbGxvQGV4YW1wbGUuY29tIiwiZXhwIjo0MTAyNDQ0ODAwfQ.";

describe("Overview dashboard", () => {
  it("lets a user log in and see the important dashboard components", () => {
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
          {
            amount: 559,
            date: "17 Jun, 2023",
            id: 2,
            name: "Adobe - Yearly",
          },
        ],
      },
      statusCode: 200,
    });

    cy.clearLocalStorage();
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.url().should("include", "/login");
    cy.get("#email").type("hello@example.com");
    cy.get("#password").type("123456");
    cy.contains("button", /^login$/i).click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("Total Balance").should("be.visible");
    cy.contains("Goals").should("be.visible");
    cy.contains("Upcoming Bill").should("be.visible");
    cy.contains("Recent Transactions").should("be.visible");
    cy.contains("Figma - Monthly").should("be.visible");
  });
});

import "@cypress/code-coverage/support";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-test=${value}]`);
});

export {};

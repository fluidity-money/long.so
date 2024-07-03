import "./commands";
import { mount } from "cypress/react18";
// add tailwindcss
import "@/app/globals.css";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
Cypress.Commands.add("mount", mount);

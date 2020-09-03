import { Cookie } from 'puppeteer';

import { AdCookiesOptions } from '../../plugins/azure-ad-sso/plugin';

// This code is adapted from
// https://gist.github.com/csuzw/845b589549b61d3a5fe18e49592e166f, which itself
// was adapted from https://github.com/cypress-io/cypress/issues/1342/.
// Unfortunately, there is not a standard way to do AD Azure logins from Cypress.

Cypress.Commands.add('setCookies', () => {
  const options: AdCookiesOptions = {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    loginUrl: Cypress.env('appUrl'),
    postLoginSelector: '[data-cy = logout]',
    headless: false,
    logs: true,
    getAllBrowserCookies: false,
  };

  cy.task<{ cookies: Cookie[] }>('AzureAdSingleSignOn', options).then(
    (result) => {
      cy.clearCookies();

      result.cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });
        Cypress.Cookies.preserveOnce(cookie.name);
      });
    },
  );
});

// Add typing to global namespace:
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Add typing to allow the then above to specify its return type
       */
      task<T>(
        event: string,
        arg?: any,
        options?: Partial<Loggable & Timeoutable>,
      ): Chainable<T>;
      /**
       * Log into Azure AD and set the cookies
       */
      setCookies(): Chainable<Subject>;
    }
  }
}

export {}; // Indicate to compiler that this file is a module

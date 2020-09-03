import { getTitle } from '../support/app.po';

describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getTitle().contains('MSAL Angular - Sample App');
  });
});

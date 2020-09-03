/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { preprocessTypescript } = require('@nrwl/cypress/plugins/preprocessor');
const AzureAdSingleSignOn = require('./azure-ad-sso/plugin')
  .AzureAdSingleSignOn;

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Preprocess Typescript
  on('file:preprocessor', preprocessTypescript(config));
  on('task', { AzureAdSingleSignOn });
};

# MSAL Angular Sample Application

Demonstrates how to use
[MSAL Angular](https://www.npmjs.com/package/@azure/msal-angular) to login,
logout, protect a route, and acquire an access token for a protected resource
such as Microsoft Graph

In the
[original repo](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-angular),
the MSAL configuration is hard-coded in the
[app.module.ts](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-angular/blob/master/src/app/app.module.ts#L34)
file. This fork extends the capability to load the configuration dynamically
from an assets file. The technique is based on a
[comment](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/1403)
from vinusorout.

**Note:** A quickstart guide covering this sample can be found
[here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v2-angular).

**Note:** A more detailed tutorial covering this sample can be found
[here](https://docs.microsoft.com/azure/active-directory/develop/tutorial-v2-angular).

## Key concepts

This sample demonstrates the following MSAL Angular concepts:

- Configuration
- Login
- Logout
- Protecting a route
- Acquiring an access token and attaching it to http calls

**Note:** This sample's structure was generated with the
[Angular CLI](https://cli.angular.io/).

## Prerequisites

[Node.js](https://nodejs.org/en/) must be installed to run this sample.

## Setup

1. [Register a new application](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-app-registration)
   in the [Azure Portal](https://portal.azure.com). Ensure that the application
   is enabled for the
   [implicit flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-implicit-grant-flow).

2. Open [src/assets/config.json](./src/assets/config.json). Provide the required
   configuration values - in particular: `clientId`, `authority`, `redirectUri`,
   `postLogoutRedirectUri`, and `protectedResourceMap`.

```json
{
  "clientId": "Enter_the_Application_Id_Here",
  "authority": "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here",
  "redirectUri": "Enter_the_Redirect_Uri_Here",
  "postLogoutRedirectUri": "Enter_the_Post_Logout_Redirect_Uri_Here",
  "cacheLocation": "localStorage",
  "consentScopes": ["user.read", "openid", "profile"],
  "protectedResourceMap": [
    ["Enter_the_Graph_Endpoint_Herev1.0/v1.0/me", ["user.read"]]
  ],
  "extraQueryParameters": {}
}
```

> **Note**: In order to support sign-ins with **work and school accounts** as
> well as **personal Microsoft accounts**, set your `authority` to use the
> /common endpoint i.e. `https://login.microsoftonline.com/common`. Read more
> about
> [msal.js configuration options](https://docs.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options).

3. Install project dependencies from the command line by navigating to the root
   of the repository and running `yarn`.

## Run the sample

1. Start the sample application with `yarn start`.
2. In your browser, navigate to [http://localhost:4200](http://localhost:4200).

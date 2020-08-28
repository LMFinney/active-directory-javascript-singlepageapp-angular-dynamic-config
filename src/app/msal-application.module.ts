import { InjectionToken, NgModule, APP_INITIALIZER } from '@angular/core';
import {
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalAngularConfiguration,
  MsalService,
  MsalModule,
  MsalInterceptor,
} from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Configuration } from 'msal';
import { ConfigService } from './config/config.service';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

export function initializerFactory(env: ConfigService, configUrl: string): any {
  // APP_INITIALIZER, except a function return which will return a promise
  // APP_INITIALIZER, angular doesnt starts application untill it completes
  const promise = env.init(configUrl).then(() => {
    console.log(env.getSettings('clientId'));
  });
  return () => promise;
}

export function msalConfigFactory(config: ConfigService): Configuration {
  const auth = {
    auth: {
      clientId: config.getSettings('clientId'),
      authority: config.getSettings('authority'),
      redirectUri: config.getSettings('redirectUri'),
      postLogoutRedirectUri: config.getSettings('postLogoutRedirectUri'),
    },
    cache: {
      cacheLocation: config.getSettings('cacheLocation'),
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
  return auth as Configuration;
}

export function msalAngularConfigFactory(
  config: ConfigService,
): MsalAngularConfiguration {
  const auth = {
    popUp: !isIE,
    consentScopes: config.getSettings('consentScopes'),
    unprotectedResources: config.getSettings('unprotectedResources'),
    protectedResourceMap: config.getSettings('protectedResourceMap'),
    extraQueryParameters: config.getSettings('extraQueryParameters'),
  };
  return auth as MsalAngularConfiguration;
}

@NgModule({
  providers: [],
  imports: [MsalModule],
})
export class MsalApplicationModule {
  static forRoot(configFile: string) {
    return {
      ngModule: MsalApplicationModule,
      providers: [
        ConfigService,
        { provide: AUTH_CONFIG_URL_TOKEN, useValue: configFile },
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [ConfigService, AUTH_CONFIG_URL_TOKEN],
          multi: true,
        },
        {
          provide: MSAL_CONFIG,
          useFactory: msalConfigFactory,
          deps: [ConfigService],
        },
        {
          provide: MSAL_CONFIG_ANGULAR,
          useFactory: msalAngularConfigFactory,
          deps: [ConfigService],
        },
        MsalService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
      ],
    };
  }
}

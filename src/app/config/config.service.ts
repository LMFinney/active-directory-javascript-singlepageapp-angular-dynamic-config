import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapTo, tap } from 'rxjs/operators';

export interface Config {
  clientId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  cacheLocation: string;
  consentScopes: string[];
  protectedResourceMap: (string[] | string)[][];
  extraQueryParameters?: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private settings: Config;
  private http: HttpClient;

  constructor(httpHandler: HttpBackend) {
    // Note: We are intentionally not injecting HttpClient. If you inject
    // HttpClient, then Angular first resolves all the HTTP_INTERCEPTORS.
    // When you use MsalInterceptor in app module, this makes Angular load
    // MsalService and other components used by Msalinterceptor before
    // APP_INITIALIZER.
    // To resolve this issue, we need to bypass HTTP_INTERCEPTORS by creating
    // our own instance of HttpClient from the HttpBackend handler.
    // This will bypass the HTTP_INTERCEPTORS, while getting config file.
    this.http = new HttpClient(httpHandler);
  }

  init(endpoint: string) {
    return this.http
      .get<Config>(endpoint)
      .pipe(
        tap((value) => (this.settings = value)),
        mapTo(true),
      )
      .toPromise();
  }

  getSettings(key?: string | string[]): any {
    if (!key || (Array.isArray(key) && !key[0])) {
      return this.settings;
    }

    if (!Array.isArray(key)) {
      key = key.split('.');
    }

    return key.reduce(
      (acc: any, current: string) => acc && acc[current],
      this.settings,
    );
  }
}

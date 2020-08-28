import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private settings: any;
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

  init(endpoint: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .get(endpoint)
        .pipe(map((res) => res))
        .subscribe(
          (value) => {
            this.settings = value;
            resolve(true);
          },
          (error) => {
            reject(error);
          },
        );
    });
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
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // Ajoutez un jeton d'accès uniquement sur les points de terminaison sécurisés
    const theEndPoint = environment.magasinEnLigneApiUrl + "/orders";
    const securedEndpoints = [theEndPoint];
    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      // Obtenir un jeton d'accès
      const accessToken = this.oktaAuth.getAccessToken();
      // Clonez la demande et ajoutez un nouvel en-tête avec un jeton d'accès
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return await lastValueFrom(next.handle(request));
  }
}
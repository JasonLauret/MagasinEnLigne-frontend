import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
// Ce service permet de communiquer avec le backend via l'api
export class CheckoutService {

  private purchaseUrl = environment.magasinEnLigneApiUrl + '/checkout/purchase';

  private paymentIntentUrl = environment.magasinEnLigneApiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) { }

  // Envoyer les données de l'achat
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);    
  }

  // Envoie les données de paiment (prix, devise, adresse e-mail du client)
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}

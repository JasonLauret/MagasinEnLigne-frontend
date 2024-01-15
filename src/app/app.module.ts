import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule, Router} from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';

import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AdminComponent } from './components/admin/admin.component';
import { CountryComponent } from './components/admin/country/country.component';
import { FormCountryComponent } from './components/admin/forms/form-country/form-country.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { StateComponent } from './components/admin/state/state.component';
import { FormStateComponent } from './components/admin/forms/form-state/form-state.component';

const oktaAuth = new OktaAuth(myAppConfig.oidc);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // Utilisation de l'injecteur pour accéder à n'importe quel service disponible dans votre application
  const router = injector.get(Router);
  // Redirection de l'utilisateur vers la page de connexion personnalisée
  router.navigate(['/login']);
}

const routes: Routes = [
  { path: 'admin/form-country/:code', component: FormCountryComponent }, // Formulaire modif de country
  { path: 'admin/form-country', component: FormCountryComponent }, // Formulaire modif de country
  { path: 'admin/form-state/:id', component: FormStateComponent }, // Formulaire modif de country
  { path: 'admin/form-state', component: FormStateComponent }, // Formulaire modif de country
  { path: 'admin', component: AdminComponent }, // Route page Admin
  { path: 'country', component: CountryComponent }, // Affiche la liste des pays
  { path: 'state', component: StateComponent }, // Affiche la liste des état

  
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], // Affiche la liste des commandes, accès aux personnes connecté (grace au guard)
   data: {onAuthRequired: sendToLoginPage} },

  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], // Affiche la page des membres, accès aux personnes connecté (grace au guard)
   data: {onAuthRequired: sendToLoginPage} },

  {path: 'login/callback', component: OktaCallbackComponent}, // A revoir
  {path: 'login', component: LoginComponent}, // Affiche la page de login

  {path: 'checkout', component: CheckoutComponent}, // Affiche le formulaire de checkout (validation)
  {path: 'cart-details', component: CartDetailsComponent}, // Affiche le panier
  {path: 'products/:id', component: ProductDetailsComponent}, // Affiche le détail d'un produit
  {path: 'search/:keyword', component: ProductListComponent}, // Affiche les produits en fonction d'un mot-clé
  {path: 'category/:id', component: ProductListComponent}, // Affiche les produits en fonction d'une catégorie
  {path: 'category', component: ProductListComponent}, // Affiche la liste des produits
  {path: 'products', component: ProductListComponent}, // Affiche la liste des produits
  {path: '', redirectTo: '/products', pathMatch: 'full'}, // Affiche la liste des produits si il n'y a rien dans l'url
  {path: '**', redirectTo: '/products', pathMatch: 'full'} // Affiche la liste des produits si la route n'éxiste pas
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    FormCountryComponent,
    AdminComponent,
    CountryComponent,
    NavBarComponent,
    StateComponent,
    FormStateComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule, // HttpClient permet de réaliser des requêtes http
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    ProductService,
    { provide: OKTA_CONFIG, useValue: { oktaAuth }},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
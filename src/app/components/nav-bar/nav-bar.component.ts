import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {


  productCategories: ProductCategory[] = [];
  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(
    private productService: ProductService,
    private router: Router,
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth){ }

  ngOnInit(): void {
    this.listProductCategories();

    // S'abonner aux changements d'état d'authentification
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  // Liste de categorie de produits
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  // Barre de recherche
  doSearch(value: string) {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }
  
  // Récupération des détails de l'utilisateur connecté
  getUserDetails() {
    if (this.isAuthenticated) {
      // le nom complet de l'utilisateur est exposé en tant que nom de propriété
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          // Récupération de l'e-mail de l'utilisateur à partir de la réponse d'authentification
          const theEmail = res.email;
          // Stockage de l'e-mail dans le storage du navigateur
          this.storage.setItem('userEmail', JSON.stringify(theEmail));          
        }
      );
    }
  }

  logout() {
    // Termine la session avec Okta et supprime les jetons.
    this.oktaAuth.signOut();
  }
}

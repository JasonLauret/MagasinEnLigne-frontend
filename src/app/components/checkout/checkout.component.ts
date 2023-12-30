/**********************************
******Mon code avant stripe********
***********************************
***********************************/

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  checkoutFormGroup?: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private magasinEnLigneService: MagasinEnLigneService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),

        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),

        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  /**
   * Initialise les détails du panier, les mois et années de la carte de crédit, et les pays.
   */
  ngOnInit(): void {
    this.reviewCartDetails();

    // Remplir le mois de la carte de crédit
    const startMonth: number = new Date().getMonth() + 1;
    this.magasinEnLigneService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Mois de la carte de crédit récupérés: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
    // Remplir l'années de la carte de crédit
    this.magasinEnLigneService.getCreditCardYears().subscribe((data) => {
      console.log('Années de la carte de crédit récupérées: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    // Remplir les pays
    this.magasinEnLigneService.getCountries().subscribe((data) => {
      console.log('Pays récupérés: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  /**
   * S'abonne à totalQuantity et totalPrice pour affecter leur valeur a this.totalQuantity et this.totalPrice
   */
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup?.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup?.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup?.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup?.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup?.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup?.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup?.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup?.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup?.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup?.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup?.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup?.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup?.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup?.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup?.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup?.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup?.get('creditCard.securityCode'); }


  /**
   * Copie l'adresse de livraison dans l'adresse de facturation si l'option est activée
   */
  copyShippingAddressToBillingAddress(event: any) {
    if (this.checkoutFormGroup) {
      if (event.target.checked) {
        this.checkoutFormGroup?.controls['billingAddress'].setValue(
          this.checkoutFormGroup?.controls['shippingAddress'].value
        );
        this.billingAddressStates = this.shippingAddressStates;
      } else {
        this.checkoutFormGroup?.controls['billingAddress'].reset();
        this.billingAddressStates = [];
      }
    }
  }

  /**
   * Permet de soumettre le formulaire. Effectue la création de la commande et l'appel à l'API REST pour enregistrer la commande en base.
   */
  onSubmit() {
    if (this.checkoutFormGroup?.invalid) {
      this.checkoutFormGroup?.markAllAsTouched();
      return;
    }
    // Créer la commande
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Récupérer les articles du panier
    const cartItems = this.cartService.cartItems;

    // Créer un orderItems à partir de cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // Instancié l'achat
    let purchase = new Purchase();

    // Remplir l'achat avec le client
    purchase.customer = this.checkoutFormGroup?.controls['customer'].value;

    //----------------- 
    // // Remplir l'achat avec l'adresse de livraison
    // purchase.shippingAddress = this.checkoutFormGroup?.controls['shippingAddress'].value;
    // const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    // const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    // purchase.shippingAddress.state = shippingState.name;
    // purchase.shippingAddress.country = shippingCountry.name;

    // // Remplir l'achat avec l'adresse de facturation
    // purchase.billingAddress = this.checkoutFormGroup?.controls['billingAddress'].value;
    // const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    // const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    // purchase.billingAddress.state = billingState.name;
    // purchase.billingAddress.country = billingCountry.name;


    // Remplir l'achat avec l'adresse de livraison
    purchase.shippingAddress =
      this.checkoutFormGroup?.controls['shippingAddress'].value;

    if (purchase.shippingAddress) {
      purchase.shippingAddress.state = this.checkoutFormGroup?.get('shippingAddress.state')?.value.name;
      purchase.shippingAddress.country = this.checkoutFormGroup?.get('shippingAddress.country')?.value.name;
    }

    // Remplir l'achat avec l'adresse de facturation
    purchase.billingAddress =
      this.checkoutFormGroup?.controls['billingAddress'].value;
    if (purchase.billingAddress) {
      purchase.billingAddress.state = this.checkoutFormGroup?.get('billingAddress.state')?.value.name;
      purchase.billingAddress.country = this.checkoutFormGroup?.get('billingAddress.country')?.value.name;
    }
    //--------------------

    // Remplir l'achat avec la commande et les articles de commande
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Appeller API REST via le CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Votre commande a été reçue.\nNuméro de suivi de commande: ${response.orderTrackingNumber}`);
          // Réinitialiser le panier
          this.resetCart();
        },
        error: err => {
          alert(`Il y a eu une erreur: ${err.message}`);
        }
      }
    );

  }

  /**
   * Permet e réinitialiser le panier et le formulaire puis redirige vers la page des produits.
   */
  resetCart() {
    // Réinitialiser les données du panier
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // Réinitialiser le formulaire
    this.checkoutFormGroup?.reset();
    // Revenir à la page des produits
    this.router.navigateByUrl("/products");
  }

  /**
   * Gère la mise à jour des mois de la carte de crédit en fonction de l'année sélectionnée.
   */
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup?.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );
    // Si l'année en cours est égale à l'année sélectionnée, alors commencez la liste par le mois en cours
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.magasinEnLigneService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  /**
   * Récupère les États en fonction du groupe de formulaire (adresse de livraison ou de facturation).
   * @param formGroupName - Nom du groupe de formulaire ('shippingAddress' ou 'billingAddress').
   */
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup?.get(formGroupName);
    if (formGroup) {
      const countryCode = formGroup.value.country.code;
      this.magasinEnLigneService.getStates(countryCode).subscribe((data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        // Sélectionne le premier élément par défaut
        formGroup.get('state')?.setValue(data[0]);
      });
    }
  }
}


/***********************************************
*****Mon code a la video 313 (apres stripe)*****
************************************************
************************************************/


// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Country } from 'src/app/common/country';
// import { Order } from 'src/app/common/order';
// import { OrderItem } from 'src/app/common/order-item';
// import { PaymentInfo } from 'src/app/common/payment-info';
// import { Purchase } from 'src/app/common/purchase';
// import { State } from 'src/app/common/state';
// import { CartService } from 'src/app/services/cart.service';
// import { CheckoutService } from 'src/app/services/checkout.service';
// import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
// import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css'],
// })
// export class CheckoutComponent {
//   checkoutFormGroup?: FormGroup;

//   totalPrice: number = 0;
//   totalQuantity: number = 0;

//   creditCardYears: number[] = [];
//   creditCardMonths: number[] = [];

//   countries: Country[] = [];

//   shippingAddressStates: State[] = [];
//   billingAddressStates: State[] = [];

//   storage: Storage = sessionStorage;

//   // initialize Stripe API
//   stripe = Stripe(environment.stripePublishableKey);

//   paymentInfo: PaymentInfo = new PaymentInfo();
//   cardElement: any;
//   displayError: any = "";

//   isDisabled: boolean = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private magasinEnLigneService: MagasinEnLigneService,
//     private cartService: CartService,
//     private checkoutService: CheckoutService,
//     private router: Router
//   ) {

//     const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

//     this.checkoutFormGroup? = this.formBuilder.group({
//       customer: this.formBuilder.group({
//         firstName: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),

//         lastName: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),

//         email: new FormControl(theEmail, [
//           Validators.required,
//           Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
//         ]),
//       }),
//       shippingAddress: this.formBuilder.group({
//         street: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//         city: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//         state: new FormControl('', [Validators.required]),
//         country: new FormControl('', [Validators.required]),
//         zipCode: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//       }),
//       billingAddress: this.formBuilder.group({
//         street: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//         city: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//         state: new FormControl('', [Validators.required]),
//         country: new FormControl('', [Validators.required]),
//         zipCode: new FormControl('', [
//           Validators.required,
//           Validators.minLength(2),
//           MagasinEnLigneValidators.notOnlyWhitespace,
//         ]),
//       }),
//       creditCard: this.formBuilder.group({}),
//     });
//   }

//   /**
//    * Initialise les détails du panier, les mois et années de la carte de crédit, et les pays.
//    */
//   ngOnInit(): void {
//     // Configurer le formulaire de paiement Stripe
//     // this.setupStripePaymentForm();
//     // Récap détail du panier
//     this.reviewCartDetails();
//     // Remplir les pays
//     this.magasinEnLigneService.getCountries().subscribe((data) => {
//       console.log('Pays récupérés: ' + JSON.stringify(data));
//       this.countries = data;
//     });
//   }

//   ngAfterViewInit(): void {
//     // Code d'initialisation qui dépend du DOM
//     this.setupStripePaymentForm();
//   }

//   setupStripePaymentForm() {
//     // Obtient un handle pour séparer les éléments
//     var elements = this.stripe.elements();
//     // Crée un élément card, et masque le champ du code postal
//     this.cardElement = elements.create('card', { hidePostalCode: true });
//     // Ajout d'une instance de la card du composant d'interface utilisateur, dans la div 'card-element'
//     this.cardElement.mount('#card-element');
//     // Ajout d'un event binding pour l'événement 'change' sur l'élément card
//     this.cardElement.on('change', (event: any) => {
//       // Obtenir un handle sur l'élément card-errors
//       this.displayError = document.getElementById('card-errors');
//       if (event.complete) {
//         this.displayError.textContent = "";
//       } else if (event.error) {
//         // Afficher l'erreur de validation au client
//         this.displayError.textContent = event.error.message;
//       }
//     });
//   }

//   /**
//    * S'abonne à totalQuantity et totalPrice pour affecter leur valeur a this.totalQuantity et this.totalPrice
//    */
//   reviewCartDetails() {
//     this.cartService.totalQuantity.subscribe(
//       totalQuantity => this.totalQuantity = totalQuantity
//     );
//     this.cartService.totalPrice.subscribe(
//       totalPrice => this.totalPrice = totalPrice
//     );
//   }

//   get firstName() { return this.checkoutFormGroup?.get('customer.firstName'); }
//   get lastName() { return this.checkoutFormGroup?.get('customer.lastName'); }
//   get email() { return this.checkoutFormGroup?.get('customer.email'); }

//   get shippingAddressStreet() { return this.checkoutFormGroup?.get('shippingAddress.street'); }
//   get shippingAddressCity() { return this.checkoutFormGroup?.get('shippingAddress.city'); }
//   get shippingAddressState() { return this.checkoutFormGroup?.get('shippingAddress.state'); }
//   get shippingAddressZipCode() { return this.checkoutFormGroup?.get('shippingAddress.zipCode'); }
//   get shippingAddressCountry() { return this.checkoutFormGroup?.get('shippingAddress.country'); }

//   get billingAddressStreet() { return this.checkoutFormGroup?.get('billingAddress.street'); }
//   get billingAddressCity() { return this.checkoutFormGroup?.get('billingAddress.city'); }
//   get billingAddressState() { return this.checkoutFormGroup?.get('billingAddress.state'); }
//   get billingAddressZipCode() { return this.checkoutFormGroup?.get('billingAddress.zipCode'); }
//   get billingAddressCountry() { return this.checkoutFormGroup?.get('billingAddress.country'); }

//   get creditCardType() { return this.checkoutFormGroup?.get('creditCard.cardType'); }
//   get creditCardNameOnCard() { return this.checkoutFormGroup?.get('creditCard.nameOnCard'); }
//   get creditCardNumber() { return this.checkoutFormGroup?.get('creditCard.cardNumber'); }
//   get creditCardSecurityCode() { return this.checkoutFormGroup?.get('creditCard.securityCode'); }


//   /**
//    * Copie l'adresse de livraison dans l'adresse de facturation si l'option est activée
//    */
//   copyShippingAddressToBillingAddress(event: any) {
//     if (this.checkoutFormGroup?) {
//       if (event.target.checked) {
//         this.checkoutFormGroup?.controls['billingAddress'].setValue(
//           this.checkoutFormGroup?.controls['shippingAddress'].value
//         );
//         this.billingAddressStates = this.shippingAddressStates;
//       } else {
//         this.checkoutFormGroup?.controls['billingAddress'].reset();
//         this.billingAddressStates = [];
//       }
//     }
//   }

//   /**
//    * Permet de soumettre le formulaire. Effectue la création de la commande et l'appel à l'API REST pour enregistrer la commande en base.
//    */
//   onSubmit() {
//     if (this.checkoutFormGroup?.invalid) {
//       this.checkoutFormGroup?.markAllAsTouched();
//       return;
//     }
//     // Créer la commande
//     let order = new Order();
//     order.totalPrice = this.totalPrice;
//     order.totalQuantity = this.totalQuantity;
//     // Récupérer les articles du panier
//     const cartItems = this.cartService.cartItems;
//     // Créer un orderItems à partir de cartItems
//     let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
//     // Instancié l'achat
//     let purchase = new Purchase();
//     // Remplir l'achat avec le client
//     purchase.customer = this.checkoutFormGroup?.controls['customer'].value;
//     // Remplir l'achat avec l'adresse de livraison
//     purchase.shippingAddress =
//       this.checkoutFormGroup??.controls['shippingAddress'].value;
//     if (purchase.shippingAddress) {
//       purchase.shippingAddress.state = this.checkoutFormGroup??.get('shippingAddress.state')?.value.name;
//       purchase.shippingAddress.country = this.checkoutFormGroup??.get('shippingAddress.country')?.value.name;
//     }
//     // Remplir l'achat avec l'adresse de facturation
//     purchase.billingAddress =
//       this.checkoutFormGroup??.controls['billingAddress'].value;
//     if (purchase.billingAddress) {
//       purchase.billingAddress.state = this.checkoutFormGroup??.get('billingAddress.state')?.value.name;
//       purchase.billingAddress.country = this.checkoutFormGroup??.get('billingAddress.country')?.value.name;
//     }
//     // Remplir l'achat avec la commande et les articles de commande
//     purchase.order = order;
//     purchase.orderItems = orderItems;

//     // Appeller API REST via le CheckoutService
//     // Calculer les informations de paiement
//     this.paymentInfo.amount = Math.round(this.totalPrice * 100);
//     this.paymentInfo.currency = "EUR"; 
//     this.paymentInfo.receiptEmail = purchase.customer.email;

//     // if valid form then
//     // - create payment intent
//     // - confirm card payment
//     // - place order

//     if (!this.checkoutFormGroup?.invalid && this.displayError.textContent === "") {

//       this.isDisabled = true;

//       this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
//         (paymentIntentResponse) => {
//           this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
//             {
//               payment_method: {
//                 card: this.cardElement,
//                 billing_details: {
//                   email: purchase.customer.email,
//                   name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
//                   address: {
//                     line1: purchase.billingAddress.street,
//                     city: purchase.billingAddress.city,
//                     state: purchase.billingAddress.state,
//                     postal_code: purchase.billingAddress.zipCode,
//                     country: this.billingAddressCountry?.value.code
//                   }
//                 }
//               }
//             }, { handleActions: false })
//           .then((result: any) => {
//             if (result.error) {
//               // Informer le client qu'il y a eu une erreur
//               alert(`There was an error: ${result.error.message}`);
//               this.isDisabled = false;
//             } else {
//               // Appeler l'API REST via le CheckoutService
//               this.checkoutService.placeOrder(purchase).subscribe({
//                 next: response => {
//                   alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

//                   // Réinitialiser le panier
//                   this.resetCart();
//                   this.isDisabled = false;
//                 },
//                 error: err => {
//                   alert(`There was an error: ${err.message}`);
//                   this.isDisabled = false;
//                 }
//               })
//             }            
//           });
//         }
//       );
//     } else {
//       this.checkoutFormGroup?.markAllAsTouched();
//       return;
//     }

//   }

//   /**
//    * Permet e réinitialiser le panier et le formulaire puis redirige vers la page des produits.
//    */
//   resetCart() {
//     // Réinitialiser les données du panier
//     this.cartService.cartItems = [];
//     this.cartService.totalPrice.next(0);
//     this.cartService.totalQuantity.next(0);
//     // Réinitialiser le formulaire
//     this.checkoutFormGroup?.reset();
//     // Revenir à la page des produits
//     this.router.navigateByUrl("/products");
//   }

//   /**
//    * Gère la mise à jour des mois de la carte de crédit en fonction de l'année sélectionnée.
//    */
//   handleMonthsAndYears() {
//     const creditCardFormGroup = this.checkoutFormGroup?.get('creditCard');
//     const currentYear: number = new Date().getFullYear();
//     const selectedYear: number = Number(
//       creditCardFormGroup?.value.expirationYear
//     );
//     // Si l'année en cours est égale à l'année sélectionnée, alors commencez la liste par le mois en cours
//     let startMonth: number;
//     if (currentYear === selectedYear) {
//       startMonth = new Date().getMonth() + 1;
//     } else {
//       startMonth = 1;
//     }
//     this.magasinEnLigneService
//       .getCreditCardMonths(startMonth)
//       .subscribe((data) => {
//         console.log('Retrieved credit card months: ' + JSON.stringify(data));
//         this.creditCardMonths = data;
//       });
//   }

//   /**
//    * Récupère les États en fonction du groupe de formulaire (adresse de livraison ou de facturation).
//    * @param formGroupName - Nom du groupe de formulaire ('shippingAddress' ou 'billingAddress').
//    */
//   getStates(formGroupName: string) {
//     const formGroup = this.checkoutFormGroup?.get(formGroupName);
//     if (formGroup) {
//       const countryCode = formGroup.value.country.code;
//       this.magasinEnLigneService.getStates(countryCode).subscribe((data) => {
//         if (formGroupName === 'shippingAddress') {
//           this.shippingAddressStates = data;
//         } else {
//           this.billingAddressStates = data;
//         }
//         // Sélectionne le premier élément par défaut
//         formGroup.get('state')?.setValue(data[0]);
//       });
//     }
//   }
// }

/**********************************
***********Copie du mec ***********
***********************************
***********************************/


// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Country } from 'src/app/common/country';
// import { State } from 'src/app/common/state';
// import { CartService } from 'src/app/services/cart.service';
// import { CheckoutService } from 'src/app/services/checkout.service';
// import { Router } from '@angular/router';
// import { Order } from 'src/app/common/order';
// import { OrderItem } from 'src/app/common/order-item';
// import { Purchase } from 'src/app/common/purchase';
// import { environment } from 'src/environments/environment';
// import { PaymentInfo } from 'src/app/common/payment-info';
// import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
// import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {

//   checkoutFormGroup?: FormGroup | undefined;

//   totalPrice: number = 0;
//   totalQuantity: number = 0;
  
//   creditCardYears: number[] = [];
//   creditCardMonths: number[] = [];

//   countries: Country[] = [];

//   shippingAddressStates: State[] = [];
//   billingAddressStates: State[] = [];
    
//   storage: Storage = sessionStorage;

//   // initialize Stripe API
//   stripe = Stripe(environment.stripePublishableKey);

//   paymentInfo: PaymentInfo = new PaymentInfo();
//   cardElement: any;
//   displayError: any = "";

//   constructor(private formBuilder: FormBuilder,
//               private magasinEnLigneFormService: MagasinEnLigneService,
//               private cartService: CartService,
//               private checkoutService: CheckoutService,
//               private router: Router) { }

//   ngOnInit(): void {

//     // setup Stripe payment form
//     this.setupStripePaymentForm();
    
//     this.reviewCartDetails();

//     // read the user's email address from browser storage
//     const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

//     this.checkoutFormGroup = this.formBuilder.group({
//       customer: this.formBuilder.group({
//         firstName: new FormControl('', 
//                               [Validators.required, 
//                                Validators.minLength(2), 
//                                MagasinEnLigneValidators.notOnlyWhitespace]),

//         lastName:  new FormControl('', 
//                               [Validators.required, 
//                                Validators.minLength(2), 
//                                MagasinEnLigneValidators.notOnlyWhitespace]),
                               
//         email: new FormControl(theEmail,
//                               [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
//       }),
//       shippingAddress: this.formBuilder.group({
//         street: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                      MagasinEnLigneValidators.notOnlyWhitespace]),
//         city: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                    MagasinEnLigneValidators.notOnlyWhitespace]),
//         state: new FormControl('', [Validators.required]),
//         country: new FormControl('', [Validators.required]),
//         zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                       MagasinEnLigneValidators.notOnlyWhitespace])
//       }),
//       billingAddress: this.formBuilder.group({
//         street: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                      MagasinEnLigneValidators.notOnlyWhitespace]),
//         city: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                    MagasinEnLigneValidators.notOnlyWhitespace]),
//         state: new FormControl('', [Validators.required]),
//         country: new FormControl('', [Validators.required]),
//         zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
//                                       MagasinEnLigneValidators.notOnlyWhitespace])
//       }),
//       creditCard: this.formBuilder.group({
//         /*
//         cardType: new FormControl('', [Validators.required]),
//         nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
//                                           MagasinEnLigneValidators.notOnlyWhitespace]),
//         cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
//         securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
//         expirationMonth: [''],
//         expirationYear: ['']
//         */
//       })
//     });

//     /*
//     // populate credit card months

//     const startMonth: number = new Date().getMonth() + 1;
//     console.log("startMonth: " + startMonth);

//     this.magasinEnLigneFormService.getCreditCardMonths(startMonth).subscribe(
//       data => {
//         console.log("Retrieved credit card months: " + JSON.stringify(data));
//         this.creditCardMonths = data;
//       }
//     );

//     // populate credit card years

//     this.magasinEnLigneFormService.getCreditCardYears().subscribe(
//       data => {
//         console.log("Retrieved credit card years: " + JSON.stringify(data));
//         this.creditCardYears = data;
//       }
//     );
//     */

//     // populate countries

//     this.magasinEnLigneFormService.getCountries().subscribe(
//       (data: Country[]) => {
//         console.log("Retrieved countries: " + JSON.stringify(data));
//         this.countries = data;
//       }
//     );
//   }

//   setupStripePaymentForm() {

//     // get a handle to stripe elements
//     var elements = this.stripe.elements();

//     // Create a card element ... and hide the zip-code field
//     this.cardElement = elements.create('card', { hidePostalCode: true });

//     // Add an instance of card UI component into the 'card-element' div
//     this.cardElement.mount('#card-element');

//     // Add event binding for the 'change' event on the card element
//     this.cardElement.on('change', (event: any) => {

//       // get a handle to card-errors element
//       this.displayError = document.getElementById('card-errors');

//       if (event.complete) {
//         this.displayError.textContent = "";
//       } else if (event.error) {
//         // show validation error to customer
//         this.displayError.textContent = event.error.message;
//       }

//     });

//   }

//   reviewCartDetails() {

//     // subscribe to cartService.totalQuantity
//     this.cartService.totalQuantity.subscribe(
//       totalQuantity => this.totalQuantity = totalQuantity
//     );

//     // subscribe to cartService.totalPrice
//     this.cartService.totalPrice.subscribe(
//       totalPrice => this.totalPrice = totalPrice
//     );

//   }

//   get firstName() { return this.checkoutFormGroup?.get('customer.firstName'); }
//   get lastName() { return this.checkoutFormGroup?.get('customer.lastName'); }
//   get email() { return this.checkoutFormGroup?.get('customer.email'); }

//   get shippingAddressStreet() { return this.checkoutFormGroup?.get('shippingAddress.street'); }
//   get shippingAddressCity() { return this.checkoutFormGroup?.get('shippingAddress.city'); }
//   get shippingAddressState() { return this.checkoutFormGroup?.get('shippingAddress.state'); }
//   get shippingAddressZipCode() { return this.checkoutFormGroup?.get('shippingAddress.zipCode'); }
//   get shippingAddressCountry() { return this.checkoutFormGroup?.get('shippingAddress.country'); }

//   get billingAddressStreet() { return this.checkoutFormGroup?.get('billingAddress.street'); }
//   get billingAddressCity() { return this.checkoutFormGroup?.get('billingAddress.city'); }
//   get billingAddressState() { return this.checkoutFormGroup?.get('billingAddress.state'); }
//   get billingAddressZipCode() { return this.checkoutFormGroup?.get('billingAddress.zipCode'); }
//   get billingAddressCountry() { return this.checkoutFormGroup?.get('billingAddress.country'); }

//   get creditCardType() { return this.checkoutFormGroup?.get('creditCard.cardType'); }
//   get creditCardNameOnCard() { return this.checkoutFormGroup?.get('creditCard.nameOnCard'); }
//   get creditCardNumber() { return this.checkoutFormGroup?.get('creditCard.cardNumber'); }
//   get creditCardSecurityCode() { return this.checkoutFormGroup?.get('creditCard.securityCode'); }



//   copyShippingAddressToBillingAddress(event: any) {

//     if (event.target.checked) {
//       this.checkoutFormGroup?.controls['billingAddress']
//             .setValue(this.checkoutFormGroup?.controls['shippingAddress'].value);

//       // bug fix for states
//       this.billingAddressStates = this.shippingAddressStates;

//     }
//     else {
//       this.checkoutFormGroup?.controls['billingAddress'].reset();

//       // bug fix for states
//       this.billingAddressStates = [];
//     }
    
//   }

//   onSubmit() {
//     console.log("Handling the submit button");

//     if (this.checkoutFormGroup?.invalid) {
//       this.checkoutFormGroup?.markAllAsTouched();
//       return;
//     }

//     // set up order
//     let order = new Order();
//     order.totalPrice = this.totalPrice;
//     order.totalQuantity = this.totalQuantity;

//     // get cart items
//     const cartItems = this.cartService.cartItems;

//     // create orderItems from cartItems
//     // - long way
//     /*
//     let orderItems: OrderItem[] = [];
//     for (let i=0; i < cartItems.length; i++) {
//       orderItems[i] = new OrderItem(cartItems[i]);
//     }
//     */

//     // - short way of doing the same thingy
//     let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

//     // set up purchase
//     let purchase = new Purchase();
    
//     // populate purchase - customer
//     purchase.customer = this.checkoutFormGroup?.controls['customer'].value;
    
//     // populate purchase - shipping address
//     purchase.shippingAddress = this.checkoutFormGroup?.controls['shippingAddress'].value;
//     const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
//     const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
//     purchase.shippingAddress.state = shippingState.name;
//     purchase.shippingAddress.country = shippingCountry.name;

//     // populate purchase - billing address
//     purchase.billingAddress = this.checkoutFormGroup?.controls['billingAddress'].value;
//     const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
//     const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
//     purchase.billingAddress.state = billingState.name;
//     purchase.billingAddress.country = billingCountry.name;
  
//     // populate purchase - order and orderItems
//     purchase.order = order;
//     purchase.orderItems = orderItems;

//     // compute payment info
//     this.paymentInfo.amount = this.totalPrice * 100;
//     this.paymentInfo.currency = "USD";

//     // if valid form then
//     // - create payment intent
//     // - confirm card payment
//     // - place order

//     if (!this.checkoutFormGroup?.invalid && this.displayError.textContent === "") {

//       this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
//         (paymentIntentResponse) => {
//           this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
//             {
//               payment_method: {
//                 card: this.cardElement
//               }
//             }, { handleActions: false })
//           .then((result:any) => {
//             if (result.error) {
//               // inform the customer there was an error
//               alert(`There was an error: ${result.error.message}`);
//             } else {
//               // call REST API via the CheckoutService
//               this.checkoutService.placeOrder(purchase).subscribe({
//                 next: response => {
//                   alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

//                   // reset cart
//                   this.resetCart();
//                 },
//                 error: err => {
//                   alert(`There was an error: ${err.message}`);
//                 }
//               })
//             }            
//           });
//         }
//       );
//     } else {
//       this.checkoutFormGroup?.markAllAsTouched();
//       return;
//     }

//   }

//   resetCart() {
//     // reset cart data
//     this.cartService.cartItems = [];
//     this.cartService.totalPrice.next(0);
//     this.cartService.totalQuantity.next(0);
    
//     // reset the form
//     this.checkoutFormGroup?.reset();

//     // navigate back to the products page
//     this.router.navigateByUrl("/products");
//   }
 
//   getStates(formGroupName: string) {

//     const formGroup = this.checkoutFormGroup?.get(formGroupName);

//     const countryCode = formGroup?.value.country.code;
//     const countryName = formGroup?.value.country.name;

//     console.log(`${formGroupName} country code: ${countryCode}`);
//     console.log(`${formGroupName} country name: ${countryName}`);

//     this.magasinEnLigneFormService.getStates(countryCode).subscribe(
//       (      data: any[]) => {

//         if (formGroupName === 'shippingAddress') {
//           this.shippingAddressStates = data; 
//         }
//         else {
//           this.billingAddressStates = data;
//         }

//         // select first item by default
//         formGroup?.get('state')?.setValue(data[0]);
//       }
//     );
//   }
// }


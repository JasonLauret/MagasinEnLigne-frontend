import { Component, OnInit } from '@angular/core';
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
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // Initialisation de l'API stripe
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private magasinEnLigneService: MagasinEnLigneService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    // Récupération de l'e-mail dans le storage en string et on le parse pour le convertir en objet
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Création des formulaires
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
      creditCard: this.formBuilder.group({}),
    });
  }

  /**
   * Initialise les détails du panier, les mois et années de la carte de crédit, et les pays.
   */
  ngOnInit(): void {
    // Récap détail du panier
    this.reviewCartDetails();
    // Remplir les pays
    this.magasinEnLigneService.getCountries().subscribe((data) => {
      console.log('Pays récupérés: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  ngAfterViewInit(){
    // Configurer le formulaire de paiement Stripe
    this.setupStripePaymentForm();
  }

  setupStripePaymentForm() {
    // Obtient un handle pour séparer les éléments
    var elements = this.stripe.elements();
    // Crée un élément card, et masque le champ du code postal
    this.cardElement = elements.create('card', { hidePostalCode: true });
    // Ajout d'une instance de la card du composant d'interface utilisateur, dans la div 'card-element'
    this.cardElement.mount('#card-element');
    // Ajout d'un event binding pour l'événement 'change' sur l'élément card
    this.cardElement.on('change', (event: any) => {
      // Obtenir un handle sur l'élément card-errors
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // Afficher l'erreur de validation au client
        this.displayError.textContent = event.error.message;
      }
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

  // Permet de récupérer les valeurs des formaulaires
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  /**
   * Copie l'adresse de livraison dans l'adresse de facturation si l'option est activée
   */
  copyShippingAddressToBillingAddress(event: any) {
    if (this.checkoutFormGroup) {
      if (event.target.checked) {
        this.checkoutFormGroup.controls['billingAddress'].setValue(
          this.checkoutFormGroup.controls['shippingAddress'].value
        );
        this.billingAddressStates = this.shippingAddressStates;
      } else {
        this.checkoutFormGroup.controls['billingAddress'].reset();
        this.billingAddressStates = [];
      }
    }
  }

  /**
   * Permet de soumettre le formulaire. Effectue la création de la commande et l'appel à l'API REST pour enregistrer la commande en base.
   */
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
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
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // Remplir l'achat avec l'adresse de livraison
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    if (purchase.shippingAddress) {
      purchase.shippingAddress.state = this.checkoutFormGroup.get('shippingAddress.state')?.value.name;
      purchase.shippingAddress.country = this.checkoutFormGroup.get('shippingAddress.country')?.value.name;
    }
    // Remplir l'achat avec l'adresse de facturation
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    if (purchase.billingAddress) {
      purchase.billingAddress.state = this.checkoutFormGroup.get('billingAddress.state')?.value.name;
      purchase.billingAddress.country = this.checkoutFormGroup.get('billingAddress.country')?.value.name;
    }
    // Remplir l'achat avec la commande et les articles de commande
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Appeller API REST via le CheckoutService
    // Calculer les informations de paiement
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "EUR"; 
    this.paymentInfo.receiptEmail = purchase.customer.email;

    // Si le form est valide
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      // On active le bouton
      this.isDisabled = true;

      // On créer le paymentIntent

      // Appel de la méthode createPaymentIntent pour communiquer avec le backend via une adresse exposée par l'API
      // Les informations de paiement, telles que le prix, la devise et l'adresse e-mail du client, y sont incluses. 
      // Cela initiera un flux de données sur lequel nous nous abonnerons pour récupérer la réponse lorsque celle-ci sera reçue de l'API. 
      // Le backend transmettant les infos de paiement à Stripe. Stripe renverra un code secret au backend, qui à son tour nous transmettra ce code.
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          // Une fois le code secret reçu, on va envoyer les données confidentielles de paiement à stripe avec le code secret
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry?.value.code
                  }
                }
              }
            }, { handleActions: false })
            // lorsque la réponse est reçu
          .then((result: any) => {
            if (result.error) {
              // Afficher l'erreur
              alert(`Une erreur est survenue: ${result.error.message}`);
              this.isDisabled = false;
            } else {
              // Appeler l'API REST via le CheckoutService, en passant l'achat en paramètre afin quel soit traité en backend
              this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Votre commande a bien été reçue.\nNuméro de suivi de commande: ${response.orderTrackingNumber}`);
                  // Réinitialiser le panier
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: err => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })
            }            
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }

  /**
   * Permet de réinitialiser le panier et le formulaire puis redirige vers la page des produits.
   */
  resetCart() {
    // Réinitialiser les données du panier
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    // Réinitialiser le formulaire
    this.checkoutFormGroup.reset();
    // Revenir à la page des produits
    this.router.navigateByUrl("/products");
  }

  /**
   * Gère la mise à jour des mois de la carte de crédit en fonction de l'année sélectionnée.
   */
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
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
    const formGroup = this.checkoutFormGroup.get(formGroupName);
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

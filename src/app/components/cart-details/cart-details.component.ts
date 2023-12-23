import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Récupérer les articles du panier
    this.cartItems = this.cartService.cartItems;
    // S'abonner à totalPrice de cartService
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    // S'abonner à totalQuantity de cartService
    this.cartService.totalQuantity.subscribe( 
      data => this.totalQuantity = data
    );
    // Calculer le prix total et la quantité du panier
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}

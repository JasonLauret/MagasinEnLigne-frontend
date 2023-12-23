import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // Vérifiez si il y a déjà des articles dans le panier
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    if (this.cartItems.length > 0) {
      // Rechercher l'article dans le panier en fonction de son id
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
      // Vérifiez si il en éxiste un
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart && existingCartItem) {
      // S'il en éxiste, incrémenter la quantité
      existingCartItem.quantity++;
    }
    else {
      // Sinon, ajoutez l'élément au tableau
      this.cartItems.push(theCartItem);
    }
    // Calculer le prix total et la quantité totale du panier
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // Publier les nouvelles valeurs et tous les abonnés recevront les nouvelles données
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // Récupère l'index de l'élément dans le tableau
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );
    // S'il est trouvé, supprime l'élément du tableau à l'index donné
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}

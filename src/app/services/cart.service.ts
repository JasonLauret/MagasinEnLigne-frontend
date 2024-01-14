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
  storage: Storage = localStorage;

  constructor() {
    // Récupérer les données du storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.cartItems = data;
      // Calculer les totaux en fonction des données lues du local storage
      this.computeCartTotals();
    }
  }

  /**
   * Permet d'ajouter un article au panier
   * @param theCartItem
   */
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

  /**
   * Permet de calculer le prix total et la quantité totale des articles dans le panier.
   */
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    // Parcours du tableau des articles du panier pour accumuler les coûts et les quantités
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // Publier les nouvelles valeurs et tous les abonnés recevront les nouvelles données
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Persiter les données mis à jour dans le local storage
    this.persistCartItems();
  }
  
  /**
   * Permet de persiter cartItems dans le local storage
   */
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  /**
   * Permet de diminuer la quantité d'un article dans le panier
   * @param theCartItem 
   */
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    this.computeCartTotals();
  }

  /**
   * Permet de supprimer un article du panier
   * @param theCartItem 
   */
  remove(theCartItem: CartItem) {
    // Récupère l'index de l'élément dans le tableau. S'il n'est pas trouvé la méthode findIndex renvoie -1
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );
    // Si findIndex ne revoie pas -1, on supprime l'élément du tableau à l'index donné.
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}

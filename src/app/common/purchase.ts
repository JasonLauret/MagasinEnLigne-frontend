import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';

export class Purchase {
    customer!: Customer;
    // Livraison
    shippingAddress!: Address;
    // Facturation
    billingAddress!: Address;
    order!: Order;
    orderItems!: OrderItem[]; 
}

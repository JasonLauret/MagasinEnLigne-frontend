// Class de DTO, permet de définir l'objet à envoyer
// Le point d'exclamation permet d'indiquer au compilateur TypeScript que la propriété ne sera ni nulle, ni indéfinie
export class PaymentInfo {
    amount!: number;
    currency!: string;
    receiptEmail!: string;
}

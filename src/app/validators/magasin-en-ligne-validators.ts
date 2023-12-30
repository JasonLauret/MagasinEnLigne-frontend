import { FormControl, ValidationErrors } from "@angular/forms";

export class MagasinEnLigneValidators {
    /**
     * Permet de vérifier qu'il n'y a pas d'espace
     * @param control
     * @returns 
     */
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {
        // Vérifier si la chaîne contient uniquement des espaces
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // Si c'est invalide, cela renvoie un objet d'erreur
            return { 'notOnlyWhitespace': true };
        } else {
            // Si c'est valide, cela renvoie null
            return null;
        }
    }
}

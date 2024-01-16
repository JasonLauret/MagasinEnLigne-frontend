import { Injectable } from '@angular/core';
import { State } from '../common/state';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private baseUrl = environment.magasinEnLigneApiUrl + '/admin/states';

  constructor(private httpClient: HttpClient) { }
 
  /**
   * Récuperation des état 
   * @returns liste d'état
   */
  getStates(): Observable<State[]> {
    return this.httpClient.get<State[]>(this.baseUrl);
  }

  /**
   * Récuperation des état par un code
   * @returns liste d'état
   */
  getByCountryCode(code: string): Observable<State[]> {
    return this.httpClient.get<State[]>(this.baseUrl + '/byCountryCode/' + code);
  }

  /**
   * Récuperation d'un état via son id
   * @param id de l'état à récupérer
   * @returns un état
   */
  getState(id: number): Observable<State> {
    return this.httpClient.get<State>(this.baseUrl + '/' + id);
  }

  /**
   * Permet d'ajouter un état
   * @param stateData données de l'état à ajouter
   * @returns 
   */
  addState(stateData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/add`, stateData).pipe(
      catchError(this.handleError)
    );;
  }

  /**
   * Permet de modifier un état
   * @param id de l'état à modifier
   * @param updatedEtat données de l'état modifier
   * @returns 
   */
  updateState(id: number, updatedEtat: State): Observable<any> {
    return this.httpClient.put<State>(
      `${this.baseUrl}/update/${id}`,
      updatedEtat
    );
  }

  /**
   * Permet de supprimer un état
   * @param id de l'état à supprimer
   * @returns 
   */
  deleteState(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
  

  private handleError(error: any) {
    let errorMessage = 'Une erreur inattendue s\'est produite';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = error.error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

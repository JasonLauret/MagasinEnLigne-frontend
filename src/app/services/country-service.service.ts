import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl = environment.magasinEnLigneApiUrl + '/admin/countries';

  constructor(private httpClient: HttpClient) {}

  /**
   * Récuperation des pays 
   * @returns Une liste de pays
   */
  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.baseUrl);
  }

  /**
   * Récuperation d'un pays via son code
   * @param code code du pays a récupérer
   * @returns Un pays
   */
  getCountry(code: string): Observable<Country> {
    return this.httpClient.get<Country>(this.baseUrl + '/' + code);
  }

  /**
   * Permet d'ajouter un pays
   * @param countryData donnés du pays à ajouter
   * @returns 
   */
  addCountry(countryData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/add`, countryData);
  }

  /**
   * Permet de modifier un pays
   * @param id du pays à modifier
   * @param updatedCountry données du pays modifier
   * @returns 
   */
  updateCountry(id: number, updatedCountry: any): Observable<any> {
    return this.httpClient.put<any>(
      `${this.baseUrl}/update/${id}`,
      updatedCountry
    );
  }

  /**
   * Permet de supprimer un pays
   * @param id du pays à supprimer
   * @returns 
   */
  deleteCountry(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
}

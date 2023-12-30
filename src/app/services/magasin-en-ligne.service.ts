import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MagasinEnLigneService {

  private countriesUrl = environment.magasinEnLigneApiUrl + '/countries';
  private statesUrl = environment.magasinEnLigneApiUrl + '/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {
    // URL de recherche
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    // Construir un tableau pour la liste déroulante "Mois" (commence au mois en cours et boucle jusqu'au mois 12)
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    // Construir un tableau pour la liste déroulante "Mois" (commence à l'année en cours et boucle sur les 10 prochaines années)
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}

/**
 * Permet de mapper les données recu de l'api directement avec notre modèle (ici Country)
 */
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

/**
 * Permet de mapper les données recu de l'api directement avec notre modèle (ici State)
 */
interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
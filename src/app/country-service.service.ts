import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Country } from './common/country';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl = environment.magasinEnLigneApiUrl + '/admin/countries';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.baseUrl);
  }

  getCountry(code: string): Observable<Country> {
    return this.httpClient.get<Country>(this.baseUrl + '/' + code);
  }

  addCountry(countryData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/add`, countryData);
  }

  updateCountry(id: number, updatedCountry: any): Observable<any> {
    return this.httpClient.put<any>(
      `${this.baseUrl}/update/${id}`,
      updatedCountry
    );
  }

  deleteCountry(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
}

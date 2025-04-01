import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      catchError((err) => {
        return throwError(
          () =>
            new Error(
              `No se pudo obtener las capitales de esta búsqueda: ${query}`
            )
        );
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      delay(3000),
      catchError((err) => {
        return throwError(
          () =>
            new Error(
              `No se pudo obtener los países de esta búsqueda: ${query}`
            )
        );
      })
    );
  }

  searchByCountryByAlphaCode(code: string): Observable<Country> {
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      map((countries) => countries[0]),
      catchError((err) => {
        return throwError(
          () =>
            new Error(
              `No se pudo obtener los países de esta búsqueda: ${code}`
            )
        );
      })
    );
  }
}

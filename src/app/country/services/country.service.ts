import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { catchError, count, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []); // Mejor que !
    }

    console.log('Llamando a la API', query);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
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

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []).pipe(
        delay(1000) // Simular un retardo
      ); // Mejor que !
    }

    console.log('Llamando a la API', query);

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      // delay(1000),
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

  searchByRegion(region: string): Observable<Country[]> {
    region = region.toLowerCase();

    if(this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []); // Mejor que !
    }

    console.log('Llamando a la API', region);

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((err) => {
        return throwError(
          () =>
            new Error(
              `No se pudo obtener los países de esta búsqueda: ${region}`
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
            new Error(`No se pudo obtener los países de esta búsqueda: ${code}`)
        );
      })
    );
  }
}

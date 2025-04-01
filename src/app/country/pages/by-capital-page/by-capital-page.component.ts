import { Component, inject, resource, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  imports: [CountryListComponent, CountrySearchInputComponent],
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  query = signal('');

  // Resource pattern
  countryResource = rxResource({
    // Siempre regresa un objeto, automáticamente cambia si la señal cambia
    request: () => ({
      query: this.query(),
    }),
    loader: ({ request }) => {
      // Siempre es una función asíncrona
      // Validación para que no se haga la petición si no hay query
      if (!request.query) return of([]);

      // Se hace la petición y se regresa el resultado, y regresa una promesa
      return this.countryService.searchByCapital(request.query);
    },
  });

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     },
  //   });
  // }
}

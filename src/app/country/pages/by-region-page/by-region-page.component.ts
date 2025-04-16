import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { Region } from '../../interfaces/region.interfaece';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region {
  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export default class ByRegionPageComponent {
  countryService = inject(CountryService);
  // Para matener la ruta
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  queryParams = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';

  selectedRegion = linkedSignal<Region>(() =>
    validateQueryParam(this.queryParams)
  );

  regions = signal<Region[]>([
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ]);

  regionResource = rxResource({
    request: () => ({
      region: this.selectedRegion(),
    }),
    loader: ({ request }) => {
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          query: request.region,
        },
      });
      return this.countryService.searchByRegion(request.region);
    },
  });
}

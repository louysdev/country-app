import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './country-search-input.component.html',
})
export class CountrySearchInputComponent {
  placeholder = input<string>("Buscar");
  inputValue = output<string>();

  onSearch(value: string) {
    this.inputValue.emit(value);
  }
}

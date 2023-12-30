import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/common/country';
import { CountryService } from 'src/app/country-service.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countries: Country[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (response) => {
        this.countries = response;
      },
      error: (err) => console.error(err),
    });
  }

  deleteCountry(countryId: number): void {
      this.countryService.deleteCountry(countryId).subscribe({
        next: () => {
          const index = this.countries.findIndex(

            (country) => country.id === countryId
          );

          // Si l'index est trouvé (différent de -1), on supprime l'élément du tableau
          if (index !== -1) {
            this.countries.splice(index, 1);
          }
        },
        error: (err) => console.error(err),
      });
    
  }
}

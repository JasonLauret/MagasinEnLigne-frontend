import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CountryService } from 'src/app/services/country-service.service';
import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  states: State[] = [];
  countries: Country[] = [];

  constructor(
    private stateService: StateService,
    private countryService: CountryService,
  ) {}
  
  ngOnInit(): void {
    this.getState();
    
    this.countryService.getCountries().subscribe({
      next: (response) => this.countries = response,
      error: (err) => console.error(err),
    });
  }

  getState() {
    this.stateService.getStates().subscribe({
      next: (response) => this.states = response,
      error: (err) => console.error(err),
    });
    
  }

  
  deleteState(stateId: number) {
    this.stateService.deleteState(stateId).subscribe({
      next: () => {
        const index = this.states.findIndex(
          (state) => state.id === stateId
        );
        // Si l'index est trouvé (différent de -1), on supprime l'élément du tableau
        if (index !== -1) {
          this.states.splice(index, 1);
        }
      },
      error: (err) => console.error(err),
    });
  }

  filterByCountry(event: any) {
    const countryCode = event.target.value;        
    // Appliquez le filtre en fonction du pays sélectionné
    if (countryCode === '') {
      // Si aucun pays n'est sélectionné, affichez tous les états
      this.getState();
    } else {
      // Sinon, filtrez les états en fonction du pays sélectionné
      if (countryCode) {
        this.stateService.getByCountryCode(countryCode).subscribe((data) => {
          this.states = data;
        });
      }
    }
  }

}

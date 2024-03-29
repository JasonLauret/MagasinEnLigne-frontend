import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { MagasinEnLigneService } from 'src/app/services/magasin-en-ligne.service';
import { StateService } from 'src/app/services/state.service';
import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';

@Component({
  selector: 'app-form-state',
  templateUrl: './form-state.component.html',
  styleUrls: ['./form-state.component.css']
})
export class FormStateComponent implements OnInit {

  stateForm: FormGroup | undefined;
  state: State | undefined;
  getIdStatedToUpdate!: number;
  countries: Country[] = [];
  messageErreur: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private magasinEnLigneService: MagasinEnLigneService,
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.magasinEnLigneService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.stateForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
        ],
      ],
    });

    this.getIdStatedToUpdate = +this.route.snapshot.paramMap.get('id')!;
    if (this.getIdStatedToUpdate) {
      this.stateService.getState(this.getIdStatedToUpdate).subscribe({
        next: (response) => {
          this.state = response;
          const selectedCountry = this.countries.find(
            (country) => country.name === this.state?.country.name
          );
          this.stateForm?.patchValue(
            {
              name: this.state.name,
              country: selectedCountry
            }
          );
        },
        error: (err) => console.error(err),
      });
    }
  }
  
  onSubmit() {
    if (this.stateForm?.valid) {      
      if (!this.getIdStatedToUpdate) {        
        this.stateService.addState(this.stateForm.value).subscribe({
          next: () => {
            this.router.navigateByUrl('/state');
          },
          error: (err) => {
            this.messageErreur = err;
          }
        });
      } else {
        if (this.state?.id) {
          console.log("this.stateForm.value : ", this.stateForm.value);
          console.log("this.state.id : ", this.state.id);
          
          this.stateService
            .updateState(this.state.id, this.stateForm.value)
            .subscribe({
              next: () => {
                this.router.navigateByUrl('/state');
              },
              error: (err) => this.messageErreur = err.message,
            });
        }
      }
    } else {
      // Gérer le cas où le formulaire n'est pas valide
      console.log('Veuillez remplir correctement le formulaire.');
    }
  }

  get name() { return this.stateForm?.get('name'); }
  get country() { return this.stateForm?.get('country'); }

}

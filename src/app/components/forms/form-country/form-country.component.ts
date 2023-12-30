import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { CountryService } from 'src/app/country-service.service';
import { MagasinEnLigneValidators } from 'src/app/validators/magasin-en-ligne-validators';

@Component({
  selector: 'app-form-country',
  templateUrl: './form-country.component.html',
  styleUrls: ['./form-country.component.css']
})
export class FormCountryComponent implements OnInit {
  countryForm: FormGroup | undefined; // Formulaire de checkout
  country: Country | undefined;
  codeCountryToUpdate: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.countryForm = this.formBuilder.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          MagasinEnLigneValidators.notOnlyWhitespace,
        ],
      ],
    });

    this.codeCountryToUpdate = this.route.snapshot.paramMap.get('code');
    if (this.codeCountryToUpdate) {
      this.countryService.getCountry(this.codeCountryToUpdate).subscribe({
        next: (response) => {
          this.country = response;
          this.countryForm?.patchValue(response);
        },
        error: (err) => console.error(err),
      });
    }
  }

  onSubmit(): void {
    if (this.countryForm?.valid) {
      if (!this.codeCountryToUpdate) {
        this.countryService.addCountry(this.countryForm?.value).subscribe({
          next: () => {
            this.router.navigateByUrl('/country');
          },
          error: (err) => console.error(err),
        });
      } else {
        if (this.country?.id) {
          this.countryService
            .updateCountry(this.country?.id, this.countryForm?.value)
            .subscribe({
              next: () => {
                this.router.navigateByUrl('/country');
              },
              error: (err) => console.error(err),
            });
        }
      }
    } else {
      // Gérer le cas où le formulaire n'est pas valide
      console.log('Veuillez remplir correctement le formulaire.');
    }
  }

  get code() {
    return this.countryForm?.get('code');
  }

  get name() {
    return this.countryForm?.get('name');
  }
}

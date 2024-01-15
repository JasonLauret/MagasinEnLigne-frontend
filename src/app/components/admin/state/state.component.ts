import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/common/state';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  states: State[] = [];

  constructor(private stateService: StateService) {}
  
  ngOnInit(): void {
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
}

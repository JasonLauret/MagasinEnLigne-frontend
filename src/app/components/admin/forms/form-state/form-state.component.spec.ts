import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStateComponent } from './form-state.component';

describe('FormStateComponent', () => {
  let component: FormStateComponent;
  let fixture: ComponentFixture<FormStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormStateComponent]
    });
    fixture = TestBed.createComponent(FormStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

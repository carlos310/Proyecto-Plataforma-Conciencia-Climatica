import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosMainForm } from './ingresos-main-form.js';

describe('IngresosMainForm', () => {
  let component: IngresosMainForm;
  let fixture: ComponentFixture<IngresosMainForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosMainForm],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresosMainForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

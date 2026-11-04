import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gastos } from './gastos-form.js';

describe('Gastos', () => {
  let component: Gastos;
  let fixture: ComponentFixture<Gastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gastos],
    }).compileComponents();

    fixture = TestBed.createComponent(Gastos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

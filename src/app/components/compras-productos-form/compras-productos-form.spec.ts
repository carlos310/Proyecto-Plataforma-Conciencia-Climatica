import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProductosForm } from './compras-productos-form.js';

describe('ComprasProductosForm', () => {
  let component: ComprasProductosForm;
  let fixture: ComponentFixture<ComprasProductosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasProductosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasProductosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

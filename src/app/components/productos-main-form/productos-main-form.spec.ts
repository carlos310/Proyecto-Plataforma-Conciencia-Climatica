import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosMainForm } from './productos-main-form.js';

describe('PorductosMainForm', () => {
  let component: ProductosMainForm;
  let fixture: ComponentFixture<ProductosMainForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosMainForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosMainForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

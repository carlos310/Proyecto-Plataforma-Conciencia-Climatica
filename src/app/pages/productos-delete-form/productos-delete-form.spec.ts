import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDeleteForm } from './productos-delete-form';

describe('ProductosDeleteForm', () => {
  let component: ProductosDeleteForm;
  let fixture: ComponentFixture<ProductosDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDeleteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosDeleteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

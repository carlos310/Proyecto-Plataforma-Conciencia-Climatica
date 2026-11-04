import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEditForm } from './productos-edit-form';

describe('ProductosEditForm', () => {
  let component: ProductosEditForm;
  let fixture: ComponentFixture<ProductosEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProductosCreate } from './compras-productos-create';

describe('ComprasProductosCreate', () => {
  let component: ComprasProductosCreate;
  let fixture: ComponentFixture<ComprasProductosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasProductosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasProductosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

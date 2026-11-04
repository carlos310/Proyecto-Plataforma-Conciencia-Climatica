import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProductosEdit } from './compras-productos-edit';

describe('ComprasProductosEdit', () => {
  let component: ComprasProductosEdit;
  let fixture: ComponentFixture<ComprasProductosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasProductosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasProductosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
